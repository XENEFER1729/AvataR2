<<<<<<< HEAD
"use client"
import React from 'react';
import { useState } from 'react';
import { animate, stagger } from "motion"
import { splitText } from "motion-plus"
import { useEffect, useRef } from "react"


const Hero1 = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState('');
  const fullText = 'Turn a Photo and Voice into a Talking Video. Instantly.';
  const [showCursor, setShowCursor] = useState(true);
  useEffect(() => {
    setText('');

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        const cursorInterval = setInterval(() => {
          setShowCursor(prev => !prev);
        }, 500);

        return () => clearInterval(cursorInterval);
      }
    }, 60); 

    return () => clearInterval(typingInterval);
  }, []);
  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!containerRef.current) return
      containerRef.current.style.visibility = "visible"

      const { words } = splitText(
        containerRef.current.querySelector("h1")!
      )
      animate(
        words,
        { opacity: [0, 1], y: [10, 0] },
        {
          type: "spring",
          duration: 2,
          bounce: 0,
          delay: stagger(0.05),
        }
      )
    })
  }, [])

  return (
    <div className="container relative w-full md:w-1/2 p-16 text-white z-10 " ref={containerRef} >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent md:hidden z-[-1]" />

      <div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          Bring Your Images to Life Today!
        </h1>
        <h2 className="text-xl sm:text-2xl mb-8 font-semibold text-start">
          {text}
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
        </h2>
      </div>
      {/* <Stylesheet /> */}
      <div className="flex gap-2">
        <button className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-lg font-semibold transition-all cursor-pointer">
          Learn More
        </button>
        <button className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-lg font-semibold transition-all cursor-pointer">
          Watch Demo
        </button>
=======
// src/app/home/Hero.tsx
'use client'

import React from 'react';
import Image from 'next/image';

const Hero1: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 transition-colors duration-300"></div>
        
        {/* Abstract purple circles */}
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-purple-300 dark:bg-purple-800 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-purple-400 dark:bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-30 dark:opacity-10"></div>
>>>>>>> a0cb2157123827d7803d5883e32a78c188d3ce62
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 text-sm font-medium">
              Next-Gen AI Avatar Creation
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Transform Your 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-200"> Digital Identity</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Create stunning, hyper-realistic avatars powered by cutting-edge AI. Express yourself like never before with our advanced avatar generation technology.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a 
                href="#signup" 
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </a>
              <a 
                href="#demo" 
                className="px-8 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-medium rounded-md shadow-md hover:shadow-lg border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300"
              >
                Try Demo
              </a>
            </div>
          </div>
          
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-full">
            <div className="absolute inset-0 bg-purple-200 dark:bg-purple-900 rounded-2xl overflow-hidden shadow-xl transition-colors duration-300">
              <div className="p-4 h-full flex items-center justify-center">
                {/* Hero image - realistic avatar */}
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image 
                    src="/api/placeholder/800/600" 
                    alt="Ultra-realistic AI Generated Avatar" 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-xl"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-transparent rounded-xl"></div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-400 dark:bg-purple-700 rounded-full opacity-30 blur-2xl transition-colors duration-300"></div>
            <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 hidden lg:block">
              <div className="w-16 h-16 bg-purple-500 dark:bg-purple-400 opacity-20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero1;