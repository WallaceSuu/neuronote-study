from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from .models import uploadPDF, User

class uploadPDFView(APIView):
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

        # Adding the uploaded file to the django database
        new_upload = uploadPDF(pdf_file=pdf_file, pdf_name=pdf_file.name)
        new_upload.save()
        
        return Response({"message": "File uploaded successfully"}, status=status.HTTP_200_OK)

# Want to get all the pdf files uploaded by a user, use filter instead of get    
# class getPDFView(APIView):
#     def get(self, request, user_key):
#         pdf = uploadPDF.objects.filter(user=user_key)

#         if pdf.exists():
#             return Response({"error": "PDF not found"}, status=status.HTTP_404_NOT_FOUND)
        
#         pdf_list = [{"pdf_file": pdf.pdf_file, "title": pdf.pdf_name, "key": pdf.pdf_key} for pdf in pdf]

#         return Response({"pdf": pdf_list}, status=status.HTTP_200_OK)
    
class RegisterUserView(APIView):
    def post(self, request):
        try:
            data = request.data
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            first_name = data.get('first_name')
            last_name = data.get('last_name')

            if not all([username, email, password, first_name, last_name]):
                return Response(
                    {"error": "All fields are required"},
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

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )

            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    
