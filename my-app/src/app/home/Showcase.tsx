// src/app/home/Showcase.tsx
'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const Showcase: React.FC = () => {
  return (
    <section id="showcase" className="relative py-16 md:py-24 bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200 dark:bg-purple-900/40 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-200 dark:bg-purple-900/40 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-1 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-purple-500" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Experience <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-200">AI Avatars</span> in Action
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See our revolutionary technology through interactive demonstrations
          </p>
        </div>

        {/* Featured Preview */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="aspect-video relative">
            <Image
              src="/api/placeholder/1200/675"
              alt="AI Avatar Demo Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent flex items-center justify-center">
              <div className="text-white text-center p-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-black">Lifelike AI Avatars</h3>
                <p className="text-lg mb-6 max-w-lg text-black">Experience realistic expressions, natural head movements, and perfect lip synchronization</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Ready to see more?</h4>
              <p className="text-gray-600 dark:text-gray-300">Check out our complete demo library</p>
            </div>
            <Link 
              href="/demo" 
              className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              View Full Demos
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        
        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 dark:border-purple-900/50">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Realistic Avatars</h3>
            <p className="text-gray-600 dark:text-gray-300">Photorealistic AI avatars that capture human expressions with stunning detail.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 dark:border-purple-900/50">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Voice Cloning</h3>
            <p className="text-gray-600 dark:text-gray-300">Zero-shot voice cloning technology that reproduces any voice with just a short sample.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 dark:border-purple-900/50">
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Lip Sync & Movement</h3>
            <p className="text-gray-600 dark:text-gray-300">Perfect synchronization between speech and lip movements with natural head positioning.</p>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <Link 
            href="/demo" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
          >
            Explore All Demos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Showcase;