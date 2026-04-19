"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export default function VoiceOrb() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative flex items-center justify-center"
    >
      <div className="absolute h-40 w-40 bg-cyan-500 blur-3xl opacity-30 rounded-full animate-pulse" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="h-32 w-32 rounded-full border border-cyan-400 flex items-center justify-center backdrop-blur-xl"
      >
        <Mic className="text-cyan-300" />
      </motion.div>
    </motion.div>
  );
}