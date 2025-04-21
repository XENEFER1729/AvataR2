'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from './home/Navbar';
import Hero1 from './home/Hero1';
import Footer from './home/Footer';

const Page = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 ">
        <Image
          src="/avatar5.jpg" // from public folder
          alt="Background"
          fill
          className="object-cover object-fit "
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-transparent z-0" />

      {/* Foreground Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero1 />
      </div>
      <Footer />
    </div>
  );
};

export default Page;


































