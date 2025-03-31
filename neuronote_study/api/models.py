from django.db import models
import random
import string

def generateRandomKey():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=16))

class uploadPDF(models.Model):
    pdf_file = models.FileField(upload_to='pdf_files/')
    pdf_key = models.CharField(max_length=255, default=generateRandomKey, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.pdf_file.name
    
class User(models.Model):
    username = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.username
    
class note(models.Model):
    note_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    note_key = models.ForeignKey(uploadPDF, on_delete=models.CASCADE)

    def __str__(self):
        return self.note_text
