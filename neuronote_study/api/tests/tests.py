from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

# User registration tests
class RegistrationTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            first_name='Test',
            last_name='User'
        )
        self.register_url = reverse('register')
        self.valid_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'first_name': 'New',
            'last_name': 'User'
        }

    def test_register_with_existing_email(self):
        data = self.valid_data.copy()
        data['email'] = 'testuser@example.com'
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(response.data['error'], 'Email already exists')

    def test_register_with_existing_username(self):
        data = self.valid_data.copy()
        data['username'] = 'testuser'
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(response.data['error'], 'Username already exists')

    def test_register_with_missing_fields(self):
        # Test missing username
        data = self.valid_data.copy()
        del data['username']
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data['error'])

        # Test missing email
        data = self.valid_data.copy()
        del data['email']
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data['error'])

        # Test missing password
        data = self.valid_data.copy()
        del data['password']
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data['error'])

# User login tests
class LoginTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            first_name='Test',
            last_name='User'
        )
        self.login_url = reverse('login')

    def test_login_with_wrong_credentials(self):
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid credentials')

    def test_login_with_correct_credentials(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['username'], 'testuser')

# Password reset tests
class PasswordResetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            first_name='Test',
            last_name='User'
        )
        self.password_reset_url = reverse('api-password-reset')

    def test_password_reset_with_nonexistent_email(self):
        data = {'email': 'nonexistent@example.com'}
        response = self.client.post(self.password_reset_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 0)
        self.assertIn('message', response.data)

    def test_password_reset_with_valid_email(self):
        data = {'email': 'testuser@example.com'}
        response = self.client.post(self.password_reset_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('message', response.data)

class UsernameChangeTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            first_name='Test',
            last_name='User'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='otheruser@example.com',
            password='testpassword',
            first_name='Other',
            last_name='User'
        )
        self.client.force_authenticate(user=self.user)
        self.edit_username_url = reverse('edit-username', kwargs={'new_username': 'newusername'})

    def test_change_username_to_existing_username(self):
        url = reverse('edit-username', kwargs={'new_username': 'otheruser'})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Username already exists')

    def test_change_username_more_than_once_per_week(self):
        # First username change
        url = reverse('edit-username', kwargs={'new_username': 'newusername1'})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Try to change again within a week
        url = reverse('edit-username', kwargs={'new_username': 'newusername2'})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('You can only change your username once a week', response.data['error'])

    def test_change_username_after_week(self):
        # First username change
        url = reverse('edit-username', kwargs={'new_username': 'newusername1'})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Update last_username_change to more than a week ago
        self.user.last_username_change = timezone.now() - timedelta(days=8)
        self.user.save()

        # Try to change again after a week
        url = reverse('edit-username', kwargs={'new_username': 'newusername2'})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        
        
