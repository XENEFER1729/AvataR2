"use client";
import React from "react";
import { motion } from "framer-motion";

const reasons = [
  {
    title: "Lifelike Avatars 🎭",
    description: "Our avatars blink, smile, and express emotions like real people.",
  },
  {
    title: "Instant Voice Generation 🔊",
    description: "Zero-shot voice cloning with realistic pitch and emotion control.",
  },
  {
    title: "Creative Freedom 🧠",
    description: "Describe anything — the AI will bring it to life in seconds.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className=" py-20 px-6 md:px-20 text-gray-800">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-14 text-indigo-600">
        Why Choose <span className="text-purple-500">AvatarAI?</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {reasons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md dark:bg-black/50 hover:scale-[1.03] ease-linear hover:shadow-lg transition-all"
          >
            <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-700">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
