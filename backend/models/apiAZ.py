from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sys
import os
from flask import send_file
import cv2
from PIL import Image

import torch._dynamo
torch._dynamo.config.suppress_errors = True

import warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

import logging
logging.getLogger("torch._dynamo").setLevel(logging.CRITICAL)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
warnings.filterwarnings("ignore", category=UserWarning)

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'Zonos', 'Zonos')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'AniTalker','code')))

import torch
import torchaudio
from AniTalker.code.demo import main,get_arg_parser
from Zonos.Zonos.zonos.model import Zonos
from Zonos.Zonos.zonos.conditioning import make_cond_dict
from Zonos.Zonos.zonos.utils import DEFAULT_DEVICE as device

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploadsAZ'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# UPLOAD_FOLDER = './uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

try:
    print("Downloading model(ZONOS)...")
    model = Zonos.from_pretrained("Zyphra/Zonos-v0.1-transformer", device=device)
    print("\nModel download and integrated succesfully!!!\n")

except:
    print("Error in downloading model...")

@app.route("/")  
def check_active():
    return jsonify({"status": "active"})


if not os.path.exists("outputs"):
    os.makedirs("outputs")

def crop_face(image_path, crop_size=(256, 256)):
    image = cv2.imread(image_path)
    if image is None:
        print(f"Image not found or unreadable: {image_path}")
        return image_path

    print("Cropping image...")

    image = cv2.resize(image, (image.shape[1]*2, image.shape[0]*2), interpolation=cv2.INTER_CUBIC)
    h, w, _ = image.shape

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=10)

    if len(faces) == 0:
        print("No face detected. Skipping crop.")
        return image_path

    x, y, width, height = faces[0]
    pad = 370

    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(w, x + width + pad)
    y2 = min(h, y + height + pad)

    face_crop = image[y1:y2, x1:x2]
    face_crop_resized = cv2.resize(face_crop, crop_size)

    # Convert to RGB and save via PIL
    face_rgb = cv2.cvtColor(face_crop_resized, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(face_rgb)

    base, _ = os.path.splitext(image_path)
    cropped_path = base + "_cropped.png"
    pil_image.save(cropped_path, format='PNG')

    print(f"Cropping complete. Saved: {cropped_path}")
    return cropped_path

def generate_tts_audio(audio_file, text, output_path="./outputs/output.wav"):
    try:
        print("Creating audio file...")
        wav, sampling_rate = torchaudio.load(audio_file)
        speaker = model.make_speaker_embedding(wav, sampling_rate)

        cond_dict = make_cond_dict(text=text, speaker=speaker, language="en-us")
        conditioning = model.prepare_conditioning(cond_dict)

        codes = model.generate(conditioning)
        wavs = model.autoencoder.decode(codes).cpu()

        torchaudio.save(output_path, wavs[0], model.autoencoder.sampling_rate)
        return output_path, None

    except Exception as e:
        return None, str(e)

def generate_avatar_video(image_file, audio_path, infer_type="hubert_audio_only", seed=0):
    try:
        print("Creating Avatar...")
        image_filename = os.path.splitext(image_file.filename)[0]
        audio_filename = os.path.splitext(os.path.basename(audio_path))[0]

        image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
        image_file.save(image_path)

        parser = get_arg_parser()
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'AniTalker'))
        ckpt_dir = os.path.join(base_dir, "ckpts")
        output_dir = os.path.join(base_dir, "output")

        stage1_ckpt = os.path.join(ckpt_dir, "stage1.ckpt")
        stage2_ckpt = os.path.join(ckpt_dir, "stage2_audio_only_hubert.ckpt")

        args_list = [
            "--test_image_path", image_path,
            "--test_audio_path", audio_path,
            "--infer_type", infer_type,
            "--seed", str(seed),
            "--device", "cpu",
            "--stage1_checkpoint_path", stage1_ckpt,
            "--stage2_checkpoint_path", stage2_ckpt,
            "--result_path", output_dir
        ]

        args = parser.parse_args(args_list)
        main(args)

        output_filename = f"{image_filename}-{audio_filename}.mp4"
        output_filepath = os.path.join(output_dir, output_filename)

        if not os.path.exists(output_filepath):
            return None, "Output video not found"

        return output_filepath, None

    except Exception as e:
        return None, str(e)

@app.route('/cropImage', methods=['POST'])
def crop_image():
    image_file = request.files.get('image')
    if not image_file:
        return jsonify({'error': 'Image file is required'}), 400

    image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
    image_file.save(image_path)

    cropped_path = crop_face(image_path)

    return send_file(cropped_path, mimetype='image/jpeg', as_attachment=True,
                     download_name=os.path.basename(cropped_path))

@app.route("/inf", methods=["POST"])
def TTS():
    print(request.form)
    if "audio" not in request.files or "text" not in request.form:
        return jsonify({"error": "Please provide both an audio file and text"}), 400

    audio_file = request.files["audio"]
    text = request.form["text"]

    output_path = "./outputs/output.wav"
    result_path, error = generate_tts_audio(audio_file, text, output_path)

    if error:
        return jsonify({"status": f"TTS generation failed: {error}"}), 500
    print("sucessfully generated audio")

    return send_file(result_path, as_attachment=True)


@app.route('/run', methods=['POST'])
def run_inference():
    image_file = request.files.get('image')
    audio_file = request.files.get('audio')

    if not image_file or not audio_file:
        return jsonify({'error': 'Both image and audio files are required'}), 400

    infer_type = request.form.get('infer_type', 'hubert_audio_only')
    seed = int(request.form.get('seed', 0))

    output_path, error = generate_avatar_video(image_file, audio_file, infer_type, seed)

    if error:
        return jsonify({'error': error}), 500
    
    print("Avatar created")

    return send_file(output_path, mimetype='video/mp4', as_attachment=True, download_name=os.path.basename(output_path))


@app.route('/createAvatar', methods=['POST'])
def create_avatar():
    image_file = request.files.get('image')
    reference_audio = request.files.get('audio')
    text = request.form.get('text')

    if not image_file or not reference_audio or not text:
        return jsonify({'error': 'Image, audio, and text are required'}), 400

    temp_ref_audio_path = os.path.join(UPLOAD_FOLDER, reference_audio.filename)
    reference_audio.save(temp_ref_audio_path)

    temp_tts_audio_path = "./outputs/output.wav"
    tts_audio_path, tts_error = generate_tts_audio(temp_ref_audio_path, text, temp_tts_audio_path)

    if tts_error:
        return jsonify({'error': f'TTS generation failed: {tts_error}'}), 500
    
    print("sucessfully generated audio...")
    output_video_path, video_error = generate_avatar_video(image_file, tts_audio_path)

    if video_error:
        return jsonify({'error': f'Avatar generation failed: {video_error}'}), 500
    
    print("Avatar created")
    return send_file(output_video_path, mimetype='video/mp4', as_attachment=True,
                     download_name=os.path.basename(output_video_path))
    
def generate_avatar_video_crop(image_path, audio_path, infer_type="hubert_audio_only", seed=0):
    try:
        print("Creating Avatar...")

        image_filename = os.path.splitext(os.path.basename(image_path))[0]
        audio_filename = os.path.splitext(os.path.basename(audio_path))[0]

        # Removed: image_file.filename and image_file.save()

        parser = get_arg_parser()
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'AniTalker'))
        ckpt_dir = os.path.join(base_dir, "ckpts")
        output_dir = os.path.join(base_dir, "output")

        stage1_ckpt = os.path.join(ckpt_dir, "stage1.ckpt")
        stage2_ckpt = os.path.join(ckpt_dir, "stage2_audio_only_hubert.ckpt")

        args_list = [
            "--test_image_path", image_path,
            "--test_audio_path", audio_path,
            "--infer_type", infer_type,
            "--seed", str(seed),
            "--device", "cpu",
            "--stage1_checkpoint_path", stage1_ckpt,
            "--stage2_checkpoint_path", stage2_ckpt,
            "--result_path", output_dir
        ]

        args = parser.parse_args(args_list)
        main(args)

        output_filename = f"{image_filename}-{audio_filename}.mp4"
        output_filepath = os.path.join(output_dir, output_filename)

        if not os.path.exists(output_filepath):
            return None, "Output video not found"

        return output_filepath, None

    except Exception as e:
        return None, str(e)


@app.route('/createAvatarCrop', methods=['POST'])
def create_avatar_crop():
    image_file = request.files.get('image')
    reference_audio = request.files.get('audio')
    text = request.form.get('text')
    crop_flag = request.form.get('crop', 'false').lower() == 'true'

    if not image_file or not reference_audio or not text:
        return jsonify({'error': 'Image, audio, and text are required'}), 400

    image_filename = os.path.join(UPLOAD_FOLDER, image_file.filename)
    image_file.save(image_filename)

    if crop_flag:
        cropped_path = crop_face(image_filename)
        if not os.path.exists(cropped_path):
            return jsonify({'error': 'Cropping failed: Cropped image not found'}), 500
        image_path_to_use = cropped_path
    else:
        image_path_to_use = image_filename

    temp_ref_audio_path = os.path.join(UPLOAD_FOLDER, reference_audio.filename)
    reference_audio.save(temp_ref_audio_path)

    temp_tts_audio_path = "./outputs/output.wav"
    tts_audio_path, tts_error = generate_tts_audio(temp_ref_audio_path, text, temp_tts_audio_path)

    if tts_error:
        return jsonify({'error': f'TTS generation failed: {tts_error}'}), 500

    print("Successfully generated audio...")

    output_video_path, video_error = generate_avatar_video_crop(image_path_to_use, tts_audio_path)

    if video_error:
        return jsonify({'error': f'Avatar generation failed: {video_error}'}), 500

    print("Avatar created")
    return send_file(output_video_path, mimetype='video/mp4', as_attachment=True,
                     download_name=os.path.basename(output_video_path))

if __name__ == "__main__":
    app.run(port=1235, debug=True)