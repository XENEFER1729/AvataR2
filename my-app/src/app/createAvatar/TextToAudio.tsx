import React, { useState, useRef } from 'react';

interface TextToAudioInterface {
  text: string;
  audio: File | null;
}

interface FormErrors {
  text?: string;
  audio?: string;
}

const TextToAudio = () => {
  const [formData, setFormData] = useState<TextToAudioInterface>({
    text: '',
    audio: null
  });
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [outputAudioUrl, setOutputAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const outputAudioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, text: e.target.value }));
    setErrors(prev => ({ ...prev, text: undefined }));
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setFormData(prev => ({ ...prev, audio: file }));
    const newAudioUrl = URL.createObjectURL(file);
    setAudioUrl(newAudioUrl);
    setErrors(prev => ({ ...prev, audio: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.text.trim()) {
      newErrors.text = 'Please enter some text';
    }
    
    if (!formData.audio) {
      newErrors.audio = 'Please upload an audio file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create form data for multipart/form-data request
      const requestData = new FormData();
      requestData.append('text', formData.text);
      if (formData.audio) {
        requestData.append('audio', formData.audio);
      }
      
      const response = await fetch('http://10.11.16.189:1234/inf', {
        method: 'POST',
        body: requestData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      
      const blob = await response.blob();
      
      if (outputAudioUrl) {
        URL.revokeObjectURL(outputAudioUrl);
      }
      
      const newOutputAudioUrl = URL.createObjectURL(blob);
      setOutputAudioUrl(newOutputAudioUrl);
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error processing request:', error);
      setErrors({ 
        text: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      text: '',
      audio: null
    });
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    if (outputAudioUrl) {
      URL.revokeObjectURL(outputAudioUrl);
      setOutputAudioUrl(null);
    }
    
    setErrors({});
    setSubmitted(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Text to Audio Converter</h2>
      
      {submitted && outputAudioUrl ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg> */}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Conversion Successful!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your text has been converted to audio using your voice sample.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Audio:</h4>
            <audio
              ref={outputAudioRef}
              controls
              className="w-full"
              src={outputAudioUrl}
              autoPlay
            >
              Your browser does not support the audio element.
            </audio>
            
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  // Create an anchor element and trigger download
                  const a = document.createElement('a');
                  a.href = outputAudioUrl;
                  a.download = 'generated-audio.wav'; // Default filename
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Download Audio
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Text to Convert
            </label>
            <textarea
              id="text-input"
              rows={4}
              value={formData.text}
              onChange={handleTextChange}
              className={`w-full px-3 py-2 border ${errors.text ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter the text you want to convert to audio using your voice..."
            ></textarea>
            {errors.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="audio-input" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Voice Sample
            </label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.audio ? 'border-red-300' : 'border-gray-300'} border-dashed rounded-md`}>
              <div className="space-y-1 text-center">
                {/* <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg> */}
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="audio-input" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload a voice sample</span>
                    <input 
                      id="audio-input" 
                      name="audio-input" 
                      type="file" 
                      accept="audio/*"
                      className="sr-only"
                      onChange={handleAudioChange}
                      ref={fileInputRef}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">WAV files recommended (up to 10MB)</p>
              </div>
            </div>
            {errors.audio && (
              <p className="mt-1 text-sm text-red-600">{errors.audio}</p>
            )}
            
            {audioUrl && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-500">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 3.5v12a1 1 0 01-1.707.707L4.586 12.5H2a1 1 0 01-1-1v-2a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg> */}
                  </div>
                  <span className="ml-2 text-sm text-gray-700">{formData.audio?.name}</span>
                </div>
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
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Convert to Audio'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TextToAudio;