from django.urls import path
from .views import uploadPDFView, RegisterUserView
from openAI_api.views import GetNotesView

urlpatterns = [
    path('upload-pdf/', uploadPDFView.as_view(), name='upload-pdf'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('notes/', GetNotesView.as_view(), name='notes'),
]
