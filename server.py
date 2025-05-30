from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import os
from ultralytics import YOLO
import torch
from PIL import Image
import torchvision.transforms as transforms

app = Flask(__name__)
CORS(app)

# Initialize face detection
face_cascade = cv2.CascadeClassifier('models/face_detection/haarcascade_frontalface_default.xml')

# Initialize fire detection model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
fire_model = YOLO('models/fire_detection/firedetect.pt')
fire_model.to(device)
fire_model.eval()

# Define image transformation
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Resize((640, 640)),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.route('/detect-face', methods=['POST'])
def detect_face():
    try:
        # Get image data from request
        data = request.json
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        # Draw rectangles around faces
        for (x, y, w, h) in faces:
            cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
        # Convert back to base64
        _, buffer = cv2.imencode('.png', img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return jsonify({
            'success': True,
            'image': f'data:image/png;base64,{img_base64}',
            'faces': len(faces)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/detect-fire', methods=['POST'])
def detect_fire():
    try:
        # Get image data from request
        data = request.json
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if fire_model is None:
            return jsonify({
                'success': False,
                'error': 'Fire detection model not loaded'
            })
        
        # Perform fire detection
        results = fire_model(img)
        
        # Process results
        fire_detected = len(results[0].boxes) > 0
        
        # Draw bounding boxes if fire is detected
        if fire_detected:
            for box in results[0].boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                conf = box.conf[0].cpu().numpy()
                cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
                cv2.putText(img, f'Fire: {conf:.2f}', (int(x1), int(y1)-10),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
        
        # Convert back to base64
        _, buffer = cv2.imencode('.png', img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return jsonify({
            'success': True,
            'fire_detected': fire_detected,
            'confidence': float(results[0].boxes[0].conf[0]) if fire_detected else 0.0,
            'image': f'data:image/png;base64,{img_base64}'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000) 