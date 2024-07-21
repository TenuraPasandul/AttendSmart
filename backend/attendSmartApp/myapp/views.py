# users/views.py
import os
from django.conf import settings
from django.shortcuts import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from myapp.utils import recognize_face

@api_view(['POST'])
@csrf_exempt  # Only needed if CSRF protection is enabled
@permission_classes([IsAuthenticated])
def face_recognition_login(request):
    image = request.FILES.get('image')
    if not image:
        return Response({'message': 'No image found'}, status=400)

    # Save uploaded image temporarily (you can delete this after processing)
    image_path = os.path.join(settings.MEDIA_ROOT, 'temp.jpg')
    with open(image_path, 'wb') as f:
        for chunk in image.chunks():
            f.write(chunk)

    # Perform face recognition
    recognized_user = recognize_face(image_path)  # Replace with your face recognition logic

    # Delete temporary image file
    if os.path.exists(image_path):
        os.remove(image_path)

    if recognized_user:
        return Response({'message': 'Login successful', 'user': recognized_user})
    else:
        return Response({'message': 'Face not recognized'}, status=400)
