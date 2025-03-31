from django.urls import path
from .views import uploadPDFView, RegisterUserView

urlpatterns = [
    path('upload-pdf/', uploadPDFView.as_view(), name='upload-pdf'),
    path('register/', RegisterUserView.as_view(), name='register'),
]
