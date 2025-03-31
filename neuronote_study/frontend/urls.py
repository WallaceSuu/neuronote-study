from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('submit/', views.submit, name='submit'),
    path('notes/', views.notes, name='notes'),
    path('about/', views.about, name='about'),
]
