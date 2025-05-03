from django.urls import path
from . import views

urlpatterns = [
    path('pdfs/', views.GetUserPDFsView.as_view(), name='get-user-pdfs'),
    path('process-pdfs/', views.ProcessPDFsView.as_view(), name='process-pdfs'),
    path('notes/', views.GetNotesView.as_view(), name='get-notes'),
]
