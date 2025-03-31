from django.db import models

class uploadPDF(models.Model):
    pdf_file = models.FileField(upload_to='pdf_files/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.pdf_file.name
