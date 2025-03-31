from django.shortcuts import render

def index(request):
    return render(request, 'frontend/index.html')

def submit(request):
    return render(request, 'frontend/index.html')

def notes(request):
    return render(request, 'frontend/index.html')

def about(request):
    return render(request, 'frontend/index.html')