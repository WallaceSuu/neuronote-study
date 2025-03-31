from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import render, redirect

class RegisterUserView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()

        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

class LoginUserView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Generate a token for the user
            token, created = Token.objects.get_or_create(user=user)
            return Response({"message": "User logged in successfully", "token": token.key}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LoginView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "User logged out successfully"}, status=status.HTTP_200_OK)

#future note for myself, use @login_required or IsAuthenticated decorator to protect 
#the views and only let authenticated users access them

@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user) #keep user logged in after password change
            return redirect('change_password_done')
        else:
            form = PasswordChangeForm(request.user)
        return render(request, 'change_password.html', {'form': form})
