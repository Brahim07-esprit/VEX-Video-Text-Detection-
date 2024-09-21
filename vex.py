from flask import Flask, render_template, request, jsonify, redirect, Response, url_for
from PIL import Image
from io import BytesIO
import base64
import cv2
import yt_dlp
import numpy as np
import easyocr
import logging
import re
import os

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
uploaded_video = None
UPLOAD_FOLDER = 'static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
reader = easyocr.Reader(['en'])

@app.route('/')
def index():
    video_uploaded = uploaded_video is not None
    return render_template('index.html', video_uploaded=video_uploaded)

@app.route('/upload', methods=['POST'])
def upload_file():
    global uploaded_video
    video_file = request.files['video_file']
    if video_file and video_file.filename.endswith('.mp4'):
        uploaded_video = BytesIO(video_file.read())
        return redirect(url_for('index'))
    return 'Invalid file format.'

@app.route('/upload_youtube', methods=['POST'])
def upload_youtube():
    global uploaded_video
    youtube_link = request.form['youtube_link']
    clean_link = youtube_link.split('&')[0]  # Removes any extraneous URL parameters

    ydl_opts = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=mp4]/best[ext=mp4]',
        'outtmpl': os.path.join(app.config['UPLOAD_FOLDER'], '%(id)s.%(ext)s'),
        'merge_output_format': 'mp4',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([clean_link])
        final_file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{clean_link[-11:]}.mp4")
        if os.path.exists(final_file_path):
            with open(final_file_path, 'rb') as f:
                uploaded_video = BytesIO(f.read())
            return redirect(url_for('index'))
        else:
            logging.error("The final MP4 file does not exist.")
            return 'Error downloading video: The final MP4 file does not exist.'
    except Exception as e:
        logging.error(f"Error downloading video: {e}")
        return f'Error downloading video: {str(e)}'

@app.route('/video')
def video():
    def generate():
        global uploaded_video
        uploaded_video.seek(0)
        while True:
            buf = uploaded_video.read(4096)
            if not buf:
                break
            yield buf
    return Response(generate(), content_type='video/mp4')

@app.route('/detect_text', methods=['POST'])
def detect_text():
    data = request.json
    image_data = data['image_data'].split(',')[1]
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes))
    image_np = np.array(image)
    image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    results = reader.readtext(image_bgr)
    detected_text_data = {
        'text': [],
        'left': [],
        'top': [],
        'width': [],
        'height': []
    }
    for (bbox, text, prob) in results:
        detected_text_data['text'].append(text)
        detected_text_data['left'].append(int(bbox[0][0]))
        detected_text_data['top'].append(int(bbox[0][1]))
        detected_text_data['width'].append(int(bbox[2][0] - bbox[0][0]))
        detected_text_data['height'].append(int(bbox[2][1] - bbox[0][1]))
    logging.info(f"Detected text data: {detected_text_data}")
    return jsonify(detected_text_data)

@app.route('/extract_text_in_rectangle', methods=['POST'])
def extract_text_in_rectangle():
    data = request.json
    image_data = data['image_data'].split(',')[1]
    rect = data['rect']
    image_bytes = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_bytes))
    image_np = np.array(image)
    image_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
    cropped_image = image_bgr[rect['y']:rect['y']+rect['height'], rect['x']:rect['x']+rect['width']]
    results = reader.readtext(cropped_image)
    extracted_text = [text for (_, text, _) in results]
    print("Extracted Text: ", extracted_text)
    return jsonify({"text": ' '.join(extracted_text)})

if __name__ == '__main__':
    app.run(debug=True)
