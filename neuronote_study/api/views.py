from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from .models import uploadPDF, User
from rest_framework.permissions import IsAuthenticated, AllowAny
from openAI_api.views import ProcessPDFsView
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

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

# Want to get all the pdf files uploaded by a user, use filter instead of get    
# class getPDFView(APIView):
#     def get(self, request, user_key):
#         pdf = uploadPDF.objects.filter(user=user_key)

#         if pdf.exists():
#             return Response({"error": "PDF not found"}, status=status.HTTP_404_NOT_FOUND)
        
#         pdf_list = [{"pdf_file": pdf.pdf_file, "title": pdf.pdf_name, "key": pdf.pdf_key} for pdf in pdf]

#         return Response({"pdf": pdf_list}, status=status.HTTP_200_OK)
    
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
        
    
    
