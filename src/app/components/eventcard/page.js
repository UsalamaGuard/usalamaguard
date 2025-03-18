"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function EventCard({ timestamp, image }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-midnight-blue rounded-2xl shadow-md"
    >
      <div className="flex items-center">
        <Zap className="text-glow-cyan mr-2" />
        <span>Motion Detected at {new Date(timestamp).toLocaleString()}</span>
      </div>
      {image && <img src={image} alt="Captured" className="mt-4 rounded-lg max-w-full" />}
    </motion.div>
  );
}