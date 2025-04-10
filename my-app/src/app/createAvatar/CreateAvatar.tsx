"use client"
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from "sonner"


interface Inputs {
  image: File | null
  preview: string | null
}

interface FormErrors {
  text?: string
  image?: string
  audio?: string
}

const Main = () => {
  const [text, setText] = useState('')
  const [image, setImage] = useState<Inputs>({
    image: null,
    preview: null,
  })
  const [audio, setAudio] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const audioRef = useRef<HTMLAudioElement>(null)
  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

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

    // Clear any existing error for this field
    setErrors(prev => ({ ...prev, image: undefined }))
  }

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
      newErrors.image = "Please select an image"
      isValid = false
    }

    if (!audio) {
      newErrors.audio = "Please select an audio file"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast("Fill the Form ")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('text', text)
      if (image.image) formData.append('image', image.image)
      if (audio) formData.append('audio', audio)

      // Uncomment when your API route is ready
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // })
      // const data = await response.json()
      // console.log('Upload successful:', data)

      console.log('Form submitted with:', { text, image: image.image?.name, audio: audio?.name })
      // For demo purposes, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      // resetForm() // Uncomment to reset form after successful upload

    } catch (error) {
      console.error('Upload failed:', error)
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
    toast("Form Cleared", {
      description: now,
    })

  }

  return (
    <div className=" p-6 bg-white rounded-lg shadow-md w-full">

      <h1 className="text-2xl font-bold mb-6 text-center">Upload Content</h1>


      <form onSubmit={handleUpload} className="space-y-6">
        {/* Text Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Text Input
          </label>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.text ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Enter your text here"
          />
          {errors.text && (
            <p className="mt-1 text-sm text-red-600">{errors.text}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Image Upload
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex">
                <label className={`cursor-pointer flex items-center justify-center w-full px-4 py-2 border rounded-md hover:bg-blue-100 transition-colors ${errors.image
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-blue-50 text-blue-700 border-blue-300'
                  }`}>
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {image.image && (
                <p className="text-sm text-gray-500">
                  Selected: {image.image.name}
                </p>
              )}
              {errors.image && (
                <p className="text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {image.preview && (
              <div className="relative h-40 w-full overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={image.preview}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Audio Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Audio Upload
          </label>
          <div className="space-y-2">
            <label className={`cursor-pointer flex items-center justify-center w-full px-4 py-2 border rounded-md hover:bg-blue-100 transition-colors ${errors.audio
              ? 'bg-red-50 text-red-700 border-red-300'
              : 'bg-blue-50 text-blue-700 border-blue-300'
              }`}>
              <span>Choose Audio File</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                className="hidden"
              />
            </label>

            {errors.audio && (
              <p className="text-sm text-red-600">{errors.audio}</p>
            )}

            {audio && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-500">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 3.5v12a1 1 0 01-1.707.707L4.586 12.5H2a1 1 0 01-1-1v-2a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg> */}

                  </div>
                  <span className="text-sm text-gray-700">{audio.name}</span>
                </div>

                {audioUrl && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Audio Preview:</p>
                    <audio
                      ref={audioRef}
                      controls
                      className="w-full"
                      src={audioUrl}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit and Reset Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                {/* <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> */}
                Uploading...
              </span>
            ) : (
              'Upload All'
            )}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

export default Main