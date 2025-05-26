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
from datetime import datetime, timedelta
from django.utils import timezone
from django.contrib.auth import views as auth_views
import logging
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

logger = logging.getLogger(__name__)

class uploadPDFView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            pdf_file = request.FILES.get('pdf_file')
            if not pdf_file:
                return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
            
            upload_dir = "media/uploads/"
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
            
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class getUserPDFsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get only PDFs belonging to the authenticated user
            user = request.user
            pdfs = uploadPDF.objects.filter(user=user).order_by('-created_at')
            
            # Serialize the PDFs
            pdf_data = [{
                'pdf_id': pdf.pdf_key,
                'pdf_name': pdf.pdf_name,
                'created_at': pdf.created_at,
                'file_url': request.build_absolute_uri(pdf.pdf_file.url) if pdf.pdf_file else None
            } for pdf in pdfs]
            
            return Response({
                'status': 'success',
                'pdfs': pdf_data
            }, status=status.HTTP_200_OK)
            
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable authentication for registration
    
    def post(self, request):
        try:
            data = request.data
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            first_name = data.get('first_name')
            last_name = data.get('last_name')

            # Check for missing fields
            if not all([username, email, password, first_name, last_name]):
                missing_fields = [field for field in ['username', 'email', 'password', 'first_name', 'last_name'] 
                                if not data.get(field)]
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check for duplicate username
            if User.objects.filter(username=username).exists():
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check for duplicate email
            if User.objects.filter(email=email).exists():
                return Response(
                    {"error": "Email already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate password strength
            if len(password) < 8:
                return Response(
                    {"error": "Password must be at least 8 characters long"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create the user
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
                return Response(
                    {"error": f"Error creating user: {str(create_error)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class editUsernameView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, new_username):
        try:
            user = request.user
            if not new_username:
                return Response({
                    "error": "New username is required"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if username has been changed in the last week
            if user.last_username_change:
                one_week_ago = timezone.now() - timedelta(days=7)
                if user.last_username_change > one_week_ago:
                    days_left = 7 - (timezone.now() - user.last_username_change).days
                    return Response({
                        "error": f"You can only change your username once a week. Try again in {days_left} days."
                    }, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username__iexact=new_username).exists():
                return Response({
                    "error": "Username already exists"
                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                user.username = new_username
                user.last_username_change = timezone.now()
                user.save()
                return Response({
                    "message": "Username updated successfully"
                }, status=status.HTTP_200_OK)
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteNoteView(APIView):
    authentication_classes = [TokenAuthentication]
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
            
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
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
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
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

        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {"error": f"Error creating notebook note: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class getSidebarNotebookNotesView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, page_number):
        try:
            user = request.user
            try:
                page_number = int(page_number)
            except (TypeError, ValueError):
                return Response(
                    {"error": "page_number must be a valid integer"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get or create the notebook page
            notebook_page_obj, created = notebook_page.objects.get_or_create(
                user=user,
                page_number=page_number,
                defaults={'page_title': f'Page {page_number}'}
            )

            # Get the notebook notes
            notebook_notes = notebook_note.objects.filter(
                notebook_page=notebook_page_obj,
                sidebar=True
            )
            serializer = NotebookNoteSerializer(notebook_notes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class getNotebookNotesView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, page_number):
        try:
            user = request.user
            try:
                page_number = int(page_number)
            except (TypeError, ValueError):
                return Response(
                    {"error": "page_number must be a valid integer"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the notebook page and verify ownership
            try:
                notebook_page_obj = notebook_page.objects.get(
                    user=user,
                    page_number=page_number
                )
            except notebook_page.DoesNotExist:
                return Response(
                    {"error": f"Page {page_number} does not exist or you don't have access to it"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Get the notebook notes
            notebook_notes = notebook_note.objects.filter(
                notebook_page=notebook_page_obj,
                sidebar=False
            )
            serializer = NotebookNoteSerializer(notebook_notes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class updateNotebookNoteView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, note_id):
        try:
            user = request.user
            # Get the notebook note and verify ownership through notebook_page
            notebook_note_obj = notebook_note.objects.get(
                id=note_id,
                notebook_page__user=user  # Filter through the notebook_page relationship
            )
            
            # Update sidebar status if provided
            if 'sidebar' in request.data:
                notebook_note_obj.sidebar = request.data.get('sidebar')
            
            # Update location if provided
            if 'location_x' in request.data:
                notebook_note_obj.location_x = request.data.get('location_x')
            if 'location_y' in request.data:
                notebook_note_obj.location_y = request.data.get('location_y')
            if 'location_z' in request.data:
                notebook_note_obj.location_z = request.data.get('location_z')
            
            # Update text if provided
            if 'text' in request.data:
                notebook_note_obj.text = request.data.get('text')
            
            notebook_note_obj.save()
            
            return Response({
                'id': notebook_note_obj.id,
                'note': notebook_note_obj.note.id,
                'text': notebook_note_obj.text,
                'location_x': notebook_note_obj.location_x,
                'location_y': notebook_note_obj.location_y,
                'location_z': notebook_note_obj.location_z,
                'sidebar': notebook_note_obj.sidebar
            })
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except notebook_note.DoesNotExist:
            return Response({'error': 'Notebook note not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    def delete(self, request, note_id):
        user = request.user
        try:
            # Get the notebook note and verify ownership through notebook_page
            notebook_note_obj = notebook_note.objects.get(
                id=note_id,
                notebook_page__user=user
            )
            notebook_note_obj.delete()
            return Response({'message': 'Notebook note deleted successfully'}, status=200)
        except notebook_note.DoesNotExist:
            return Response({'error': 'Notebook note not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class editNotebookNoteView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, note_id):
        user = request.user
        try:
            note_obj = notebook_note.objects.get(id=note_id, user=user)
            note_obj.text = request.data.get('text')
            note_obj.save()
            return Response({'message': 'Notebook note updated successfully'}, status=status.HTTP_200_OK)
        except notebook_note.DoesNotExist:
            return Response({'error': 'Notebook note not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class createNotebookPageView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            page_title = request.data.get('page_title')
            page_number = request.data.get('page_number')
            notebook_page_obj = notebook_page.objects.create(
                user=user,
                page_title=page_title,
                page_number=page_number
            )
            return Response({'message': 'Notebook page created successfully'}, status=status.HTTP_201_CREATED)
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class getNotebookPagesView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            # Get all pages for the user
            pages = notebook_page.objects.filter(user=user).order_by('page_number')
            total_pages = pages.count()
            
            # Serialize the pages
            pages_data = [{
                'id': page.id,
                'page_number': page.page_number,
                'page_title': page.page_title
            } for page in pages]
            
            return Response({
                'total_pages': total_pages,
                'pages': pages_data
            }, status=status.HTTP_200_OK)
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class deleteNotebookPageView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, page_id):
        try:
            # Get the page to be deleted
            page_to_delete = notebook_page.objects.get(id=page_id, user=request.user)
            deleted_page_number = page_to_delete.page_number
            
            # Delete the page
            page_to_delete.delete()
            
            # Get all pages with numbers greater than the deleted page
            pages_to_update = notebook_page.objects.filter(
                user=request.user,
                page_number__gt=deleted_page_number
            ).order_by('page_number')
            
            # Update page numbers
            for page in pages_to_update:
                page.page_number -= 1
                page.page_title = f'Page {page.page_number}'
                page.save()
            
            return Response({
                'message': 'Page deleted successfully',
                'deleted_page_number': deleted_page_number,
                'next_page_number': deleted_page_number if deleted_page_number > 1 else 1
            }, status=status.HTTP_200_OK)
        except AuthenticationFailed:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except notebook_page.DoesNotExist:
            return Response({'error': 'Page not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {'error': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Check if user exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Don't reveal that the user doesn't exist
                return Response(
                    {'message': 'If an account exists with this email, you will receive a password reset link.'},
                    status=status.HTTP_200_OK
                )

            # Generate password reset token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Create reset URL
            reset_url = request.build_absolute_uri(
                reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
            )
            
            # Send email using send_mail
            subject = 'Password Reset for Neuronote Study'
            message = f'Please click the following link to reset your password: {reset_url}'
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [email]
            
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=from_email,
                    recipient_list=recipient_list,
                    fail_silently=False,
                )
            except Exception as email_error:
                logger.error(f"Failed to send email: {str(email_error)}")
                logger.error(f"Email settings: HOST={settings.EMAIL_HOST}, PORT={settings.EMAIL_PORT}, USER={settings.EMAIL_HOST_USER}")
                raise
            
            return Response(
                {'message': 'If an account exists with this email, you will receive a password reset link.'},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            logger.error(f"Error sending password reset email: {str(e)}")
            return Response(
                {'error': 'An error occurred while processing your request'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
