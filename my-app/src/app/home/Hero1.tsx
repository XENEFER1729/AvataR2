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
      </div>
    </div>
  );
};

export default Hero1;
