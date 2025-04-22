import torch
import torchaudio
from zonos.model import Zonos
from zonos.conditioning import make_cond_dict
from zonos.utils import DEFAULT_DEVICE as device
import os
os.environ["TORCHDYNAMO_DISABLE"] = "1"
os.environ["PHONEMIZER_ESPEAK_PATH"] = r"C:\Program Files (x86)\eSpeak\command_line\espeak.exe"
os.environ["PHONEMIZER_ESPEAK_LIBRARY"] = r"C:\Program Files (x86)\eSpeak\espeak_sap.dll"


# model = Zonos.from_pretrained("Zyphra/Zonos-v0.1-hybrid", device=device)
model = Zonos.from_pretrained("Zyphra/Zonos-v0.1-transformer", device=device)

wav, sampling_rate = torchaudio.load("voices/santosh2.wav")
speaker = model.make_speaker_embedding(wav, sampling_rate)

torch.manual_seed(421)

cond_dict = make_cond_dict(text="Hello, world!", speaker=speaker, language="en-us")
conditioning = model.prepare_conditioning(cond_dict)

codes = model.generate(conditioning)

wavs = model.autoencoder.decode(codes).cpu()
torchaudio.save("sample.wav", wavs[0], model.autoencoder.sampling_rate)
