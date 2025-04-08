import React from 'react';

const Hero1 = () => {
  return (
    <div className="relative w-full md:w-1/2 p-16 text-white z-10">
      {/* Gradient overlay for smaller screens */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent md:hidden z-[-1]" />

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
        Bring Your Images to Life Today!
      </h1>
      <h2 className="text-xl sm:text-2xl mb-8">
        Turn a Photo and Voice into a Talking Video. Instantly.
      </h2>
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
