from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('submit/', views.submit, name='submit'),
    path('notes/', views.notes, name='notes'),
    path('flashcards/', views.flashcards, name='flashcards'),
    path('chat/', views.chat, name='chat'),
    path('notebook/', views.notebook, name='notebook'),
    path('about/', views.about, name='about'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),
    path('forgot-password/', views.forgot_password, name='forgot-password'),
]
