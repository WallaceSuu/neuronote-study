from django.urls import path
from .views import *
from openAI_api.views import GetNotesView

urlpatterns = [
    path('upload-pdf/', uploadPDFView.as_view(), name='upload-pdf'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('notes/', GetNotesView.as_view(), name='notes'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', getUserView.as_view(), name='user'),
]
