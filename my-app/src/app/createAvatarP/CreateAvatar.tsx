"use client"
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from "sonner"
import {
  Upload,
  ImagePlus,
  Check,
  Mic,
  Plus,
  Music,
  Loader2,
  Trash2,
  AlertTriangle,
  Text,
  Camera,
  // MicOff,
  // PauseCircle,
  // PlayCircle,
  StopCircle,
  Save
} from 'lucide-react'

interface Inputs {
  image: File | null
  preview: string | null
}

interface FormErrors {
  text?: string
  image?: string
  audio?: string
}

export default function UploadContentForm() {
  const [text, setText] = useState('')
  const [image, setImage] = useState<Inputs>({
    image: null,
    preview: null,
  })
  const [audio, setAudio] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [recordingAudio, setRecordingAudio] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([])
  const [videoCaptureActive, setVideoCaptureActive] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Image functions
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (image.preview) {
      URL.revokeObjectURL(image.preview)
    }

    setImage({
      image: file,
      preview: URL.createObjectURL(file),
    })

    setErrors(prev => ({ ...prev, image: undefined }))
  }

  const startCamera = async () => {
    try {
      setVideoCaptureActive(true)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast.error("Could not access camera")
      setVideoCaptureActive(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()

      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setVideoCaptureActive(false)
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob((blob) => {
          if (blob) {
            if (image.preview) {
              URL.revokeObjectURL(image.preview)
            }

            const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" })
            const imageUrl = URL.createObjectURL(blob)

            setImage({
              image: file,
              preview: imageUrl
            })

            toast.success("Photo captured")
            stopCamera()
          }
        }, 'image/jpeg', 0.9)
      }
    }
  }

  // Audio functions
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }

    setAudio(file)
    const newAudioUrl = URL.createObjectURL(file)
    setAudioUrl(newAudioUrl)

    setErrors(prev => ({ ...prev, audio: undefined }))
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      setMediaRecorder(recorder)
      setAudioChunks([])

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data])
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl)
        }

        const audioFile = new File([audioBlob], "recorded-audio.webm", { type: "audio/webm" })
        const url = URL.createObjectURL(audioBlob)

        setAudio(audioFile)
        setAudioUrl(url)
        setRecordingAudio(false)

        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop())
      }

      recorder.start()
      setRecordingAudio(true)
    } catch (err) {
      console.error("Error starting audio recording:", err)
      toast.error("Could not start audio recording")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    setErrors(prev => ({ ...prev, text: undefined }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (!text.trim()) {
      newErrors.text = "Text input is required"
      isValid = false
    }

    if (!image.image) {
      newErrors.image = "Please select or capture an image"
      isValid = false
    }

    if (!audio) {
      newErrors.audio = "Please select or record an audio file"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please complete all fields", {
        description: "All fields are required to continue",
      })
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('text', text)
      if (image.image) formData.append('image', image.image)
      if (audio) formData.append('audio', audio)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Content uploaded successfully", {
        description: now,
      })
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error("Upload failed")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setText('')
    if (image.preview) URL.revokeObjectURL(image.preview)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setImage({ image: null, preview: null })
    setAudio(null)
    setAudioUrl(null)
    setErrors({})
    stopCamera()
    if (recordingAudio) {
      stopRecording()
    }
    toast("Form Cleared", {
      description: now,
    })
  }

  return (
    <div className="w-full rounded-md bg-gray-950 shadow-2xl overflow-hidden border border-gray-800">
      {/* Header with gradient */}
      <div className="p-3 rounded-sm">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2 underline decoration-2 decoration-purple-500">
          <Upload className="w-6 h-6" />
          Upload Content
        </h1>
      </div>


      <form onSubmit={handleUpload} className="p-10 space-y-8 ">
        {/* Text Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-blue-400 mb-2">
            <Text className="w-4 h-4 mr-2" />
            Text Input
          </label>
          <div className={`relative rounded-lg overflow-hidden transition-all duration-200 ${errors.text ? 'ring-2 ring-red-500' : 'hover:ring-2 hover:ring-blue-500/50'}`}>
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              className={`w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.text ? 'border-red-500' : 'border-gray-700'
                }`}
              placeholder="Enter your text here"
            />
          </div>
          {errors.text && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-red-400" />
              {errors.text}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-blue-400 mb-2">
            <ImagePlus className="h-4 w-4 mr-2" />
            Image Upload
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-3">
              {!videoCaptureActive && (
                <div className="flex space-x-3">
                  <label className={`cursor-pointer flex items-center justify-center flex-1 px-4 py-4 border-2 rounded-lg transition-all duration-200 ${errors.image
                    ? 'bg-red-900/20 text-red-300 border-red-700'
                    : 'bg-blue-900/20 text-blue-300 border-blue-800 hover:bg-blue-800/40 hover:border-blue-600'
                    }`}>
                    <Plus className="h-5 w-5 mr-2" />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 flex items-center justify-center px-4 py-4 border-2 rounded-lg bg-purple-900/20 text-purple-300 border-purple-800 hover:bg-purple-800/40 hover:border-purple-600 transition-all duration-200"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    <span>Take Photo</span>
                  </button>
                </div>
              )}

              {videoCaptureActive && (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-lg border-2 border-purple-700 bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-48 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-3">
                      <button
                        type="button"
                        onClick={takePhoto}
                        className="p-2 bg-purple-700 rounded-full shadow-lg hover:bg-purple-600 transition-all"
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </button>

                      <button
                        type="button"
                        onClick={stopCamera}
                        className="p-2 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 transition-all"
                      >
                        <Trash2 className="h-6 w-6 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {image.image && (
                <p className="text-sm text-blue-400 flex items-center">
                  <Check className="h-4 w-4 mr-1 text-blue-500" />
                  {image.image.name}
                </p>
              )}

              {errors.image && (
                <p className="text-sm text-red-400 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1 text-red-400" />
                  {errors.image}
                </p>
              )}
            </div>

            <div className={`relative h-48 w-full overflow-hidden rounded-lg border-2 transition-all duration-200 ${image.preview ? 'border-blue-700 bg-black/40' : 'border-gray-700 bg-black/20'
              } flex items-center justify-center`}>
              {image.preview ? (
                <Image
                  src={image.preview}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                  <ImagePlus className="h-12 w-12 text-gray-500" />
                  <span className="text-xs mt-2">Image preview</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audio Upload */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-blue-400 mb-2">
            <Mic className="h-4 w-4 mr-2" />
            Audio Upload
          </label>

          <div className="flex space-x-3">
            <label className={`cursor-pointer flex-1 flex items-center justify-center px-4 py-4 border-2 rounded-lg transition-all duration-200 ${errors.audio
              ? 'bg-red-900/20 text-red-300 border-red-700'
              : 'bg-blue-900/20 text-blue-300 border-blue-800 hover:bg-blue-800/40 hover:border-blue-600'
              }`}>
              <Plus className="h-5 w-5 mr-2" />
              <span>Upload Audio</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={recordingAudio ? stopRecording : startRecording}
              className={`flex-1 flex items-center justify-center px-4 py-4 border-2 rounded-lg transition-all duration-200 ${recordingAudio
                ? 'bg-red-900/30 text-red-300 border-red-800 hover:bg-red-800/40 hover:border-red-600'
                : 'bg-purple-900/20 text-purple-300 border-purple-800 hover:bg-purple-800/40 hover:border-purple-600'
                }`}
            >
              {recordingAudio ? (
                <>
                  <StopCircle className="h-5 w-5 mr-2 text-red-400" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2" />
                  <span>Record Audio</span>
                </>
              )}
            </button>
          </div>

          {recordingAudio && (
            <div className="mt-3 bg-red-900/20 p-4 rounded-lg border-2 border-red-800 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-300">Recording in progress...</span>
              </div>
              <span className="text-xs text-red-400">Click {"'Stop Recording'"} when finished</span>
            </div>
          )}

          {errors.audio && (
            <p className="text-sm text-red-400 flex items-center mt-2">
              <AlertTriangle className="h-4 w-4 mr-1 text-red-400" />
              {errors.audio}
            </p>
          )}

          {audio && !recordingAudio && (
            <div className="mt-4 bg-gray-900 p-5 rounded-lg border-2 border-blue-900 transition-all duration-200 hover:border-blue-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-900/50 rounded-full text-blue-400">
                  <Music className="h-4 w-4" />
                </div>
                <span className="text-sm text-blue-300 truncate">{audio.name}</span>
              </div>

              {audioUrl && (
                <div>
                  <p className="text-xs font-medium text-blue-500 mb-2">Audio Preview:</p>
                  <audio
                    ref={audioRef}
                    controls
                    className="w-full h-10"
                    src={audioUrl}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit and Reset Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-blue-700/30"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Uploading...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="h-5 w-5 mr-2" />
                Submit Content
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center border border-gray-700 hover:border-gray-600"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}