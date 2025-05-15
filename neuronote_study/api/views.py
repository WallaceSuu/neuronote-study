from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from .models import uploadPDF, User, note, flashcard, notebook_page, notebook_note
from rest_framework.permissions import IsAuthenticated, AllowAny
from openAI_api.views import ProcessPDFsView
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .serializers import *

class uploadPDFView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        pdf_file = request.FILES.get('pdf_file')
        if not pdf_file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        upload_dir =  "media/uploads/"
        os.makedirs(upload_dir, exist_ok=True)

        file_path = os.path.join(upload_dir, pdf_file.name)
        with open(file_path, 'wb+') as destination:
            for chunk in pdf_file.chunks():
                destination.write(chunk)

        # Adding the uploaded file to the django database with user association
        new_upload = uploadPDF(pdf_file=pdf_file, pdf_name=pdf_file.name, user=request.user)
        new_upload.save()
        
        # Process the PDF to generate notes
        process_view = ProcessPDFsView()
        process_response = process_view.post(request)
        
        if process_response.status_code != status.HTTP_200_OK:
            return Response({
                "message": "File uploaded successfully but note generation failed",
                "error": process_response.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            "message": "File uploaded and processed successfully",
            "note_generation": process_response.data
        }, status=status.HTTP_200_OK)

class getUserPDFsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        pdfs = uploadPDF.objects.filter(user=user)
        serializer = UploadPDFSerializer(pdfs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable authentication for registration
    
    def post(self, request):
        try:
            data = request.data
            print(f"Received registration data: {data}")  # Debug log
            
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            first_name = data.get('first_name')
            last_name = data.get('last_name')

            if not all([username, email, password, first_name, last_name]):
                missing_fields = [field for field in ['username', 'email', 'password', 'first_name', 'last_name'] 
                                if not data.get(field)]
                return Response(
                    {"error": f"All fields are required. Missing fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if User.objects.filter(username=username).exists():
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if User.objects.filter(email=email).exists():
                return Response(
                    {"error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                user.save()
                
                return Response(
                    {"message": "User registered successfully"},
                    status=status.HTTP_201_CREATED
                )
            except Exception as create_error:
                print(f"Error creating user: {str(create_error)}")  # Debug log
                return Response(
                    {"error": f"Error creating user: {str(create_error)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            print(f"Registration failed: {str(e)}")  # Debug log
            return Response(
                {"error": f"Registration failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

class getUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DeleteNoteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, note_id):
        try:
            # Get the note and verify ownership
            note_obj = note.objects.get(id=note_id, user=request.user)
            
            # Delete associated flashcards first
            flashcard.objects.filter(note=note_obj).delete()
            
            # Delete the note
            note_obj.delete()
            
            return Response({"message": "Note deleted successfully"}, status=status.HTTP_200_OK)
            
        except note.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Note not found'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable authentication for login
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {"error": "Please provide both username and password"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "username": user.username,
                "message": "Login successful"
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

class createNotebookNoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            # Extract and validate data
            page_number = request.data.get('page_number')
            note_id = request.data.get('note')
            text = request.data.get('text')
            sidebar = request.data.get('sidebar', True)

            # Validate required fields
            missing_fields = []
            if page_number is None:
                missing_fields.append('page_number')
            if note_id is None:
                missing_fields.append('note')
            if not text:
                missing_fields.append('text')

            if missing_fields:
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate data types
            try:
                page_number = int(page_number)
                note_id = int(note_id)
            except (TypeError, ValueError):
                return Response(
                    {"error": "page_number and note must be valid integers"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate text
            if not isinstance(text, str) or not text.strip():
                return Response(
                    {"error": "text must be a non-empty string"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get or create the notebook page
            notebook_page_obj, created = notebook_page.objects.get_or_create(
                user=user,
                page_number=page_number,
                defaults={'page_title': f'Page {page_number}'}
            )

            # Get the note object
            try:
                note_obj = note.objects.get(id=note_id, user=user)
            except note.DoesNotExist:
                return Response(
                    {"error": f"Note with ID {note_id} not found or does not belong to user"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Create the notebook note
            notebook_note_obj = notebook_note.objects.create(
                notebook_page=notebook_page_obj,
                note=note_obj,
                text=text.strip(),
                sidebar=sidebar
            )

            return Response({
                "message": "Notebook note created successfully",
                "notebook_note_id": notebook_note_obj.id,
                "page_number": page_number
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": f"Error creating notebook note: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class getSidebarNotebookNotesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        notebook_notes = notebook_note.objects.filter(user=user, sidebar=True, notebook_page=page_number)
        serializer = NotebookNoteSerializer(notebook_notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class getNotebookNotesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        notebook_notes = notebook_note.objects.filter(user=user, sidebar=False, notebook_page=page_number)
        serializer = NotebookNoteSerializer(notebook_notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
