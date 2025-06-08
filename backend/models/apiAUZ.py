from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
import subprocess
import glob
import uuid
import warnings
import logging

import torch._dynamo
torch._dynamo.config.suppress_errors = True

warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)
logging.getLogger("torch._dynamo").setLevel(logging.CRITICAL)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
warnings.filterwarnings("ignore", category=UserWarning)

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'Zonos', 'Zonos')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'AniTalker','code')))

import torch
import torchaudio
from AniTalker.code.demo import main, get_arg_parser
from Zonos.Zonos.zonos.model import Zonos
from Zonos.Zonos.zonos.conditioning import make_cond_dict
from Zonos.Zonos.zonos.utils import DEFAULT_DEVICE as device

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.abspath("uploadsAZ")
OUTPUT_FOLDER = os.path.abspath("outputs")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load Zonos model (your original code)
try:
    print("Downloading model(ZONOS)...")
    model = Zonos.from_pretrained("Zyphra/Zonos-v0.1-transformer", device=device)
    print("\nModel download and integrated succesfully!!!\n")
except:
    print("Error in downloading model...")

@app.route("/")  
def check_active():
    return jsonify({"status": "active"})

def enhance_image(image_filename):
    print("Upscaling the Image...")
    REAL_ESRGAN_DIR = os.path.abspath("Real-ESRGAN")
    INPUT_PATH = os.path.join(UPLOAD_FOLDER, image_filename)
    OUTPUT_DIR = OUTPUT_FOLDER

    if not os.path.exists(INPUT_PATH):
        return False, f"Input image not found: {INPUT_PATH}"

    command = [
        sys.executable,
        os.path.join(REAL_ESRGAN_DIR, "inference_realesrgan.py"),
        "-n", "RealESRGAN_x4plus",
        "-i", INPUT_PATH,
        "--face_enhance",
        "--fp32",
        "-o", OUTPUT_DIR
    ]

    result = subprocess.run(command, capture_output=True, text=True, cwd=REAL_ESRGAN_DIR)

    if result.returncode != 0:
        return False, f"Enhancement failed. STDERR: {result.stderr}"

    input_base = os.path.splitext(os.path.basename(image_filename))[0]
    output_pattern = os.path.join(OUTPUT_DIR, f"{input_base}_out.png")
    matching_files = glob.glob(output_pattern)

    if not matching_files:
        return False, "Output file not found."

    output_path = matching_files[0]
    print("Upscaling completed...")
    return True, output_path

@app.route('/enhance-image', methods=['POST'])
def api_enhance_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file part in the request"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save uploaded file
    filename = file.filename
    save_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(save_path)

    success, result = enhance_image(filename)
    if not success:
        return jsonify({"error": result}), 500

    # Return the enhanced image file
    return send_file(result, mimetype='image/png')

def generate_tts_audio(audio_file_path, text, output_path="./outputs/output.wav"):
    try:
        print("Creating audio file...")
        wav, sampling_rate = torchaudio.load(audio_file_path)
        speaker = model.make_speaker_embedding(wav, sampling_rate)

        cond_dict = make_cond_dict(text=text, speaker=speaker, language="en-us")
        conditioning = model.prepare_conditioning(cond_dict)

        codes = model.generate(conditioning)
        wavs = model.autoencoder.decode(codes).cpu()

        torchaudio.save(output_path, wavs[0], model.autoencoder.sampling_rate)
        return output_path, None
    except Exception as e:
        return None, str(e)

@app.route("/inf", methods=["POST"])
def TTS():
    print(request.form)
    if "audio" not in request.files or "text" not in request.form:
        return jsonify({"error": "Please provide both an audio file and text"}), 400

    audio_file = request.files["audio"]
    text = request.form["text"]

    audio_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
    audio_file.save(audio_path)

    output_path = os.path.join(OUTPUT_FOLDER, "output.wav")
    result_path, error = generate_tts_audio(audio_path, text, output_path)

    if error:
        return jsonify({"status": f"TTS generation failed: {error}"}), 500
    print("Successfully generated audio")

    return send_file(result_path, as_attachment=True)

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

    # Generate TTS audio
    temp_tts_audio_path = os.path.join(OUTPUT_FOLDER, "output.wav")
    tts_audio_path, tts_error = generate_tts_audio(temp_ref_audio_path, text, temp_tts_audio_path)

    if tts_error:
        return jsonify({'error': f'TTS generation failed: {tts_error}'}), 500

    print("Successfully generated audio...")
    output_video_path, video_error = generate_avatar_video(image_file, tts_audio_path)

    if video_error:
        return jsonify({'error': f'Avatar generation failed: {video_error}'}), 500

    print("Avatar created")
    return send_file(output_video_path, mimetype='video/mp4', as_attachment=True,
                     download_name=os.path.basename(output_video_path))

@app.route('/createAvatarFullPipeline', methods=['POST'])
def create_avatar_full_pipeline():
    image_file = request.files.get('image')
    reference_audio = request.files.get('audio')
    text = request.form.get('text')

    if not image_file or not reference_audio or not text:
        return jsonify({'error': 'Image, audio, and text are required'}), 400

    ref_audio_path = os.path.join(UPLOAD_FOLDER, reference_audio.filename)
    reference_audio.save(ref_audio_path)

    input_image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
    image_file.save(input_image_path)

    tts_audio_path = os.path.join(OUTPUT_FOLDER, "output_tts.wav")
    tts_audio, tts_error = generate_tts_audio(ref_audio_path, text, tts_audio_path)
    if tts_error:
        return jsonify({'error': f'TTS generation failed: {tts_error}'}), 500

    success, enhanced_image_path_or_err = enhance_image(image_file.filename)
    if not success:
        return jsonify({'error': f'Image enhancement failed: {enhanced_image_path_or_err}'}), 500

    from werkzeug.datastructures import FileStorage
    with open(enhanced_image_path_or_err, 'rb') as f:
        enhanced_file = FileStorage(f, filename=os.path.basename(enhanced_image_path_or_err))

        output_video_path, video_error = generate_avatar_video(enhanced_file, tts_audio)

        if video_error:
            return jsonify({'error': f'Avatar generation failed: {video_error}'}), 500

    return send_file(output_video_path, mimetype='video/mp4', as_attachment=True,
                     download_name=os.path.basename(output_video_path))


if __name__ == "__main__":
    app.run(debug=True)













# @app.route('/createAvatarEnhanced', methods=['POST'])
# def create_avatar_enhanced():
#     image_file = request.files.get('image')
#     reference_audio = request.files.get('audio')
#     text = request.form.get('text')

#     if not image_file or not reference_audio or not text:
#         return jsonify({'error': 'Image, audio, and text are required'}), 400

#     temp_ref_audio_path = os.path.join(UPLOAD_FOLDER, reference_audio.filename)
#     reference_audio.save(temp_ref_audio_path)

#     enhanced_image_success, enhanced_image_path_or_err = enhance_image(image_file.filename)
#     if not enhanced_image_success:
#         return jsonify({'error': f'Image enhancement failed: {enhanced_image_path_or_err}'}), 500

#     print("Image enhanced successfully")

#     temp_tts_audio_path = os.path.join(OUTPUT_FOLDER, "output.wav")
#     tts_audio_path, tts_error = generate_tts_audio(temp_ref_audio_path, text, temp_tts_audio_path)

#     if tts_error:
#         return jsonify({'error': f'TTS generation failed: {tts_error}'}), 500

#     print("Audio generated successfully")

#     # Create a fake FileStorage for the enhanced image to pass to avatar video generation
#     from werkzeug.datastructures import FileStorage
#     with open(enhanced_image_path_or_err, 'rb') as f:
#         enhanced_file = FileStorage(f, filename=os.path.basename(enhanced_image_path_or_err))

#         output_video_path, video_error = generate_avatar_video(enhanced_file, tts_audio_path)

#         if video_error:
#             return jsonify({'error': f'Avatar generation failed: {video_error}'}), 500

#     print("Avatar created successfully")
#     return send_file(output_video_path, mimetype='video/mp4', as_attachment=True,
#                      download_name=os.path.basename(output_video_path))







# from flask import Flask, request, jsonify, send_file
# import os
# import sys
# import subprocess
# import glob

# app = Flask(__name__)

# UPLOAD_FOLDER = os.path.abspath("uploadsAZ")
# OUTPUT_FOLDER = os.path.abspath("outputs")

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# def enhance_image(image_filename):
#     REAL_ESRGAN_DIR = os.path.abspath("Real-ESRGAN")
#     INPUT_PATH = os.path.join(UPLOAD_FOLDER, image_filename)
#     OUTPUT_DIR = OUTPUT_FOLDER

#     if not os.path.exists(INPUT_PATH):
#         return False, f"Input image not found: {INPUT_PATH}"

#     command = [
#         sys.executable,
#         os.path.join(REAL_ESRGAN_DIR, "inference_realesrgan.py"),
#         "-n", "RealESRGAN_x4plus",
#         "-i", INPUT_PATH,
#         "--face_enhance",
#         "--fp32",
#         "-o", OUTPUT_DIR
#     ]

#     result = subprocess.run(command, capture_output=True, text=True, cwd=REAL_ESRGAN_DIR)

#     if result.returncode != 0:
#         return False, f"Enhancement failed. STDERR: {result.stderr}"

#     input_base = os.path.splitext(os.path.basename(image_filename))[0]
#     output_pattern = os.path.join(OUTPUT_DIR, f"{input_base}_out.png")
#     matching_files = glob.glob(output_pattern)

#     if not matching_files:
#         return False, "Output file not found."

#     output_path = matching_files[0]
#     return True, output_path

# @app.route('/enhance-image', methods=['POST'])
# def api_enhance_image():
#     if 'image' not in request.files:
#         return jsonify({"error": "No image file part in the request"}), 400

#     file = request.files['image']
#     if file.filename == '':
#         return jsonify({"error": "No selected file"}), 400

#     # Save uploaded file
#     filename = file.filename
#     save_path = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(save_path)

#     success, result = enhance_image(filename)
#     if not success:
#         return jsonify({"error": result}), 500

#     # Return the enhanced image file
#     return send_file(result, mimetype='image/png')

# if __name__ == "__main__":
#     app.run(debug=True)
