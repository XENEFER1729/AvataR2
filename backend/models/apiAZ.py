from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sys
import os
from flask import send_file

import torch._dynamo
torch._dynamo.config.suppress_errors = True

import warnings
warnings.filterwarnings("ignore", category=UserWarning)

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
    print("Downloading model...")
    model = Zonos.from_pretrained("Zyphra/Zonos-v0.1-transformer", device=device)
    print("\nModel download and integrated succesfully!!!\n")

except:
    print("Error in downloading model...")

@app.route("/")  
def check_active():
    return jsonify({"status": "active"})


if not os.path.exists("outputs"):
    os.makedirs("outputs")
    
def generate_tts_audio(audio_file, text, output_path="./outputs/output.wav"):
    try:
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

    return send_file(output_path, mimetype='video/mp4', as_attachment=True, download_name=os.path.basename(output_path))


@app.route('/createAvatar', methods=['POST'])
def create_avatar():
    image_file = request.files.get('image')
    reference_audio = request.files.get('audio')
    text = request.form.get('text')

    if not image_file or not reference_audio or not text:
        return jsonify({'error': 'Image, audio, and text are required'}), 400

    temp_tts_audio_path = "./outputs/output.wav"
    tts_audio_path, tts_error = generate_tts_audio(reference_audio, text, temp_tts_audio_path)

    if tts_error:
        return jsonify({'error': f'TTS generation failed: {tts_error}'}), 500

    output_video_path, video_error = generate_avatar_video(image_file, tts_audio_path)

    if video_error:
        return jsonify({'error': f'Avatar generation failed: {video_error}'}), 500

    return send_file(output_video_path, mimetype='video/mp4', as_attachment=True, download_name=os.path.basename(output_video_path))


if __name__ == "__main__":
    app.run(port=1235, debug=True)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

# def generate_avatar_video(image_file, audio_file, infer_type="hubert_audio_only", seed=0):
#     try:
#         image_filename = os.path.splitext(image_file.filename)[0]
#         audio_filename = os.path.splitext(audio_file.filename)[0]

#         image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
#         audio_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
#         image_file.save(image_path)
#         audio_file.save(audio_path)

#         parser = get_arg_parser()
#         base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'AniTalker'))
#         ckpt_dir = os.path.join(base_dir, "ckpts")
#         output_dir = os.path.join(base_dir, "output")

#         stage1_ckpt = os.path.join(ckpt_dir, "stage1.ckpt")
#         stage2_ckpt = os.path.join(ckpt_dir, "stage2_audio_only_hubert.ckpt")

#         args_list = [
#             "--test_image_path", image_path,
#             "--test_audio_path", audio_path,
#             "--infer_type", infer_type,
#             "--seed", str(seed),
#             "--device", "cpu",
#             "--stage1_checkpoint_path", stage1_ckpt,
#             "--stage2_checkpoint_path", stage2_ckpt,
#             "--result_path", output_dir
#         ]

#         args = parser.parse_args(args_list)
#         main(args)

#         output_filename = f"{image_filename}-{audio_filename}.mp4"
#         output_filepath = os.path.join(output_dir, output_filename)

#         if not os.path.exists(output_filepath):
#             return None, "Output video not found"

#         return output_filepath, None

#     except Exception as e:
#         return None, str(e)