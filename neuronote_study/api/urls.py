from django.urls import path
from .views import ExampleView

urlpatterns = [
    path('', ExampleView.as_view(), name='index'),
]
