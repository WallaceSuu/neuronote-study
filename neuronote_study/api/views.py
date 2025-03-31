from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from .models import uploadPDF

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
        new_upload = uploadPDF(pdf_file=pdf_file)
        new_upload.save()
        
        return Response({"message": "File uploaded successfully"}, status=status.HTTP_200_OK)
    
    
