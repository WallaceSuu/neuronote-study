from django.contrib import admin
from .models import uploadPDF

@admin.register(uploadPDF)
class UploadPDFAdmin(admin.ModelAdmin):
    list_display = ('pdf_file', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('pdf_file',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    list_per_page = 25


