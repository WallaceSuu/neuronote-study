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

    def delete(self, *args, **kwargs):
        # First delete all notes
        self.user_notes.all().delete()
        # Then delete all PDFs
        self.user_pdfs.all().delete()
        # Finally delete the user
        super().delete(*args, **kwargs)

class uploadPDF(models.Model):
    pdf_file = models.FileField(upload_to='pdf_files/')
    pdf_name = models.CharField(max_length=255, null=True, blank=True)
    pdf_key = models.CharField(max_length=36, default=generateRandomKey, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='user_pdfs')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Upload PDF'
        verbose_name_plural = 'Upload PDFs'

    def __str__(self):
        return self.pdf_file.name
    
    def delete(self, *args, **kwargs):
        # Delete all related notes first
        self.pdf_notes.all().delete()
        # Then delete the PDF file and record
        super().delete(*args, **kwargs)

class note(models.Model):
    note_title = models.CharField(max_length=255, null=True, blank=True)
    note_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_notes')
    note_key = models.ForeignKey(uploadPDF, on_delete=models.CASCADE, related_name='pdf_notes', db_constraint=False)

    class Meta:
        verbose_name = 'Note'
        verbose_name_plural = 'Notes'

    def __str__(self):
        return self.note_title if self.note_title else self.note_text[:50]

    def delete(self, *args, **kwargs):
        # Store references before deletion
        pdf = self.note_key
        user = self.user
        # Delete the note
        super().delete(*args, **kwargs)
        # Clean up any orphaned PDFs or users if needed
        if pdf and not pdf.pdf_notes.exists():
            pdf.delete()
        if user and not user.user_notes.exists():
            user.delete()

class flashcard(models.Model):
    flashcard_title = models.CharField(max_length=255, null=True, blank=True)
    flashcard_question = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_flashcards')
    note = models.ForeignKey(note, on_delete=models.CASCADE, related_name='note_flashcards', db_constraint=False)

class flashcard_answer(models.Model):
    flashcard_answer = models.ForeignKey(flashcard, on_delete=models.CASCADE, related_name='flashcard_answers')
    answer_text = models.TextField()
    is_correct = models.BooleanField(default=False)
    
