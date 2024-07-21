# backend/urls.py
from django.urls import path
from myapp.views import face_recognition_login

urlpatterns = [
    path('api/face-recognition-login/', face_recognition_login, name='face_recognition_login'),
    # Add other URLs as needed
]
