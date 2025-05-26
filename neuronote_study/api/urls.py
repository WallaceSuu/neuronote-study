from django.urls import path
from .views import *
from openAI_api.views import GetNotesView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('upload-pdf/', uploadPDFView.as_view(), name='upload-pdf'),
    path('get-user-pdfs/', getUserPDFsView.as_view(), name='get-user-pdfs'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('notes/', GetNotesView.as_view(), name='notes'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', getUserView.as_view(), name='user'),
    path('edit-username/<str:new_username>/', editUsernameView.as_view(), name='edit-username'),
    path('delete-note/<int:note_id>/', DeleteNoteView.as_view(), name='delete-note'),
    path('create-notebook-note/', createNotebookNoteView.as_view(), name='create-notebook-note'),
    path('sidebar-notebook-notes/<int:page_number>/', getSidebarNotebookNotesView.as_view(), name='sidebar-notebook-notes'),
    path('notebook-notes/<int:page_number>/', getNotebookNotesView.as_view(), name='notebook-notes'),
    path('update-notebook-note/<int:note_id>/', updateNotebookNoteView.as_view(), name='update-notebook-note'),
    path('edit-notebook-note/<int:note_id>/', editNotebookNoteView.as_view(), name='edit-notebook-note'),
    path('create-notebook-page/', createNotebookPageView.as_view(), name='create-notebook-page'),
    path('notebook-pages/', getNotebookPagesView.as_view(), name='notebook-pages'),
    path('delete-notebook-page/<int:page_id>/', deleteNotebookPageView.as_view(), name='delete-notebook-page'),
    path('password-reset/', PasswordResetView.as_view(), name='api-password-reset'),
]