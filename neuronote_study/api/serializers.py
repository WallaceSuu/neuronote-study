from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UploadPDFSerializer(serializers.ModelSerializer):
    class Meta:
        model = uploadPDF
        fields = ['id', 'pdf_name', 'pdf_key', 'created_at']

class noteSerializer(serializers.ModelSerializer):
    class Meta:
        model = note
        fields = '__all__'

class flashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = flashcard
        fields = '__all__'
        
    
