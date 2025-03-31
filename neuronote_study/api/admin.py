from django.contrib import admin
from .models import *

@admin.register(uploadPDF)
class UploadPDFAdmin(admin.ModelAdmin):
    list_display = ('pdf_file', 'pdf_key', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('pdf_file',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    list_per_page = 25

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'user_id', 'email')
    list_filter = ('user_id',)
    search_fields = ('username', 'email')
    readonly_fields = ('user_id',)
    ordering = ('-user_id',)
    list_per_page = 25

@admin.register(note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('note_text', 'user', 'note_key', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('note_text',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    list_per_page = 25
