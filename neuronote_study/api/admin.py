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

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            obj.delete()

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'user_id', 'email')
    list_filter = ('user_id',)
    search_fields = ('username', 'email')
    readonly_fields = ('user_id',)
    ordering = ('-user_id',)
    list_per_page = 25

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            obj.delete()

@admin.register(note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('note_text', 'user', 'note_key', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('note_text',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    list_per_page = 25

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            obj.delete()

@admin.register(flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display = ('flashcard_title', 'flashcard_question', 'user', 'note', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('flashcard_title', 'flashcard_question')
    
@admin.register(flashcard_answer)
class FlashcardAnswerAdmin(admin.ModelAdmin):
    list_display = ('flashcard_answer', 'answer_text', 'is_correct')
    list_filter = ('is_correct',)
    search_fields = ('flashcard_answer', 'answer_text')

@admin.register(chat_message)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('message', 'user', 'role', 'note', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('message',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    list_per_page = 25

@admin.register(notebook_page)
class NotebookPageAdmin(admin.ModelAdmin):
    list_display = ('page_title', 'page_number', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('page_title',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    list_per_page = 25

@admin.register(notebook_note)
class NotebookNoteAdmin(admin.ModelAdmin):
    list_display = ('notebook_page', 'note', 'text', 'created_at', 'sidebar')
    list_filter = ('created_at',)
    search_fields = ('notebook_page', 'note', 'text')
    readonly_fields = ('created_at',)

