from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils import timezone
from datetime import timedelta
from api.models import User, uploadPDF, note, flashcard, notebook_page, notebook_note
import os

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

class PasswordSetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword',
            first_name='Test',
            last_name='User'
        )
        self.password_set_url = reverse('api-password-reset')

    def test_password_set_with_weak_password(self):
        data = {
            'email': self.user.email,
            'password': 'weak'
        }
        response = self.client.post(self.password_set_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data['error'])
    
    def test_change_password_with_wrong_password(self):
        data = {
            'email': self.user.email,
            'password': 'testpassword'
        }
        response = self.client.post(self.password_set_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data['error'])

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

# PDF Upload & Processing tests
class PDFUploadTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        self.client.force_authenticate(user=self.user)
        self.upload_url = reverse('upload-pdf')
        self.test_pdf_path = 'test_files/test.pdf'
        
        # Create test PDF file
        os.makedirs('test_files', exist_ok=True)
        with open(self.test_pdf_path, 'wb') as f:
            f.write(b'%PDF-1.4\n%Test PDF content')

    def tearDown(self):
        # Clean up test files
        if os.path.exists(self.test_pdf_path):
            os.remove(self.test_pdf_path)
        if os.path.exists('test_files'):
            os.rmdir('test_files')

    def test_upload_pdf_success(self):
        with open(self.test_pdf_path, 'rb') as pdf_file:
            response = self.client.post(
                self.upload_url,
                {'pdf_file': pdf_file},
                format='multipart'
            )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_upload_pdf_no_file(self):
        response = self.client.post(self.upload_url, {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'No file uploaded')

    def test_upload_pdf_unauthorized(self):
        self.client.force_authenticate(user=None)
        with open(self.test_pdf_path, 'rb') as pdf_file:
            response = self.client.post(
                self.upload_url,
                {'pdf_file': pdf_file},
                format='multipart'
            )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

# Notes and Flashcards tests
class NotesTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='otheruser@example.com',
            password='testpassword'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create a test PDF
        self.pdf = uploadPDF.objects.create(
            pdf_file='test.pdf',
            pdf_name='test.pdf',
            user=self.user
        )
        
        # Create a test note
        self.note = note.objects.create(
            note_title='Test Note',
            note_text='Test content',
            user=self.user,
            note_key=self.pdf
        )

    def test_create_note_success(self):
        data = {
            'note_title': 'New Note',
            'note_text': 'New content',
            'pdf_id': self.pdf.id
        }
        response = self.client.post(reverse('notes'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(note.objects.count(), 2)

    def test_create_note_empty_content(self):
        data = {
            'note_title': 'Empty Note',
            'note_text': '',
            'pdf_id': self.pdf.id
        }
        response = self.client.post(reverse('notes'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_note_success(self):
        response = self.client.delete(
            reverse('delete-note', kwargs={'note_id': self.note.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(note.objects.count(), 0)

    def test_delete_nonexistent_note(self):
        response = self.client.delete(
            reverse('delete-note', kwargs={'note_id': 999})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_access_other_user_note(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.delete(
            reverse('delete-note', kwargs={'note_id': self.note.id})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

# Notebook tests
class NotebookTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create test PDF and note
        self.pdf = uploadPDF.objects.create(
            pdf_file='test.pdf',
            pdf_name='test.pdf',
            user=self.user
        )
        self.note = note.objects.create(
            note_title='Test Note',
            note_text='Test content',
            user=self.user,
            note_key=self.pdf
        )
        
        # Create test notebook page
        self.notebook_page = notebook_page.objects.create(
            user=self.user,
            page_number=1,
            page_title='Test Page'
        )

    def test_create_notebook_page(self):
        data = {
            'page_title': 'New Page',
            'page_number': 2
        }
        response = self.client.post(
            reverse('create-notebook-page'),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(notebook_page.objects.count(), 2)

    def test_create_notebook_note(self):
        data = {
            'page_number': 1,
            'note': self.note.id,
            'text': 'Test notebook note',
            'sidebar': True
        }
        response = self.client.post(
            reverse('create-notebook-note'),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(notebook_note.objects.count(), 1)

    def test_get_notebook_pages(self):
        response = self.client.get(reverse('notebook-pages'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['pages']), 1)

    def test_delete_notebook_page(self):
        response = self.client.post(
            reverse('delete-notebook-page', kwargs={'page_id': self.notebook_page.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(notebook_page.objects.count(), 0)

# Security tests
class SecurityTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpassword'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='otheruser@example.com',
            password='testpassword'
        )
        self.client.force_authenticate(user=self.user)

    def test_access_protected_route_without_auth(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('user'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_other_user_data(self):
        # Create a PDF for other user
        pdf = uploadPDF.objects.create(
            pdf_file='test.pdf',
            pdf_name='test.pdf',
            user=self.other_user
        )
        
        # Try to access it as first user
        response = self.client.get(
            reverse('get-user-pdfs')
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['pdfs']), 0)  # Should not see other user's PDFs

    def test_invalid_token(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token invalid-token')
        response = self.client.get(reverse('user'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        
        
