from django.db import models
from django.contrib.auth.models import AbstractUser
import random
import string
import uuid

def generateRandomKey():
    # Use UUID for guaranteed uniqueness 
    return str(uuid.uuid4())

class User(AbstractUser):
    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.username

class uploadPDF(models.Model):
    pdf_file = models.FileField(upload_to='pdf_files/')
    pdf_name = models.CharField(max_length=255, null=True, blank=True)
    pdf_key = models.CharField(max_length=36, default=generateRandomKey, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.pdf_file.name
    
class note(models.Model):
    note_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    note_key = models.ForeignKey(uploadPDF, on_delete=models.CASCADE)

    def __str__(self):
        return self.note_text

