// src/components/Login.js
import React, { useState, useRef } from 'react';
import axios from 'axios';

const UserLogin = () => {
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const startFaceRecognition = async () => {
    const video = videoRef.current;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        video.srcObject = stream;
        video.play();

        video.addEventListener('canplay', async () => {
          // Capture an image from the video stream
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
          const capturedImage = canvas.toDataURL('image/jpeg');

          // Perform face recognition
          const formData = new FormData();
          formData.append('image', capturedImage);

          try {
            const response = await axios.post('http://localhost:8000/users/face-recognition-login/', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token your_token_here`,  // Replace with your actual token or remove if not using token auth
              }
            });

            console.log(response.data);
            // Handle login success (redirect or show success message)

          } catch (error) {
            console.error('Face recognition failed:', error.response.data.message);
            // Handle face recognition failure (show error message)
          }
        });

      } catch (error) {
        console.error('Error accessing webcam:', error);
        // Handle webcam access error
      }
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }}></video>
      <button onClick={startFaceRecognition}>Start Face Recognition</button>
    </div>
  );
};

export default UserLogin;
