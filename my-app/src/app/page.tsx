<<<<<<< HEAD
'use client';
=======
"use client";

import React from "react";
import { toast } from "sonner";
// src/app/page.tsx
import Hero from "./home/Hero1";
import Features from "./home/Features";
import Showcase from "./home/Showcase";
import Testimonials from "./home/Testimonials";
// import Pricing from './home/Pricing'
import CallToAction from "./home/CallToAction";
import Footer from "./home/Footer";
// import Header from './home/Header'
import Navbar from "./home/Navbar";
// import { Button } from "@/components/ui/button"
>>>>>>> ed944fa3860a89c14cdca9dc8827cd7bae85b52b

import React from 'react';
import Image from 'next/image';
import Navbar from './home/Navbar';
import Hero1 from './home/Hero1';
import Footer from './home/Footer';

const Page = () => {
  return (
<<<<<<< HEAD
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
=======
    <div>
      {/* <button
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }>
      </button> */}
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Navbar />

        <main>
          <Hero />
          <Features />
          <Showcase />
          <Testimonials />
          {/* <Pricing /> */}
          <CallToAction />
        </main>

        <Footer />
      </div>
>>>>>>> ed944fa3860a89c14cdca9dc8827cd7bae85b52b
    </div>
  );
};

export default Page;


































