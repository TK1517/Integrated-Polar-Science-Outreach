"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className={`rounded-2xl border border-white/30 bg-white/10 p-6 shadow-xl shadow-slate-950/5 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}