"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-black via-gray-900 to-black p-10 shadow-2xl">

      {/* 🔥 Animated Background Glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-[400px] h-[400px] bg-cyan-500 blur-[120px] top-[-100px] left-[-100px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500 blur-[120px] bottom-[-100px] right-[-100px] animate-pulse" />
      </div>

      <div className="relative grid lg:grid-cols-2 gap-10 items-center">

        {/* LEFT */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold leading-tight"
          >
            Talk to your code.<br />
            <span className="text-cyan-400">AI that listens.</span>
          </motion.h1>

          <p className="mt-6 text-gray-400 max-w-xl">
            DevVoice is a voice-first AI assistant that understands your code,
            analyzes problems, and responds in real-time.
          </p>

          {/* CTA */}
          <div className="mt-8 flex gap-4">
            <Link
              href="/dashboard"
              className="relative px-6 py-3 rounded-xl bg-cyan-400 text-black font-semibold overflow-hidden group"
            >
              <span className="relative z-10">Start Talking</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition" />
            </Link>

            <Link
              href="/demo"
              className="px-6 py-3 rounded-xl border border-gray-600 hover:border-cyan-400 transition"
            >
              Watch Demo
            </Link>
          </div>
        </div>

        {/* RIGHT (VOICE ORB) */}
        <div className="flex justify-center items-center">

          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative"
          >
            {/* glow */}
            <div className="absolute w-48 h-48 bg-cyan-400 blur-3xl opacity-30 rounded-full" />

            {/* orb */}
            <div className="w-32 h-32 rounded-full border border-cyan-400 flex items-center justify-center backdrop-blur-xl">
              🎤
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}