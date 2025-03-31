from django.urls import path
from .views import uploadPDFView

urlpatterns = [
    path('upload-pdf/', uploadPDFView.as_view(), name='upload-pdf'),
]
