"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import GlitchText from "./glitch-text"

interface CyberTextProps {
  text: string
  className?: string
  withSubtext?: boolean
}

export default function CyberText({ text, className = "", withSubtext = false }: CyberTextProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-xl rounded-full"
        animate={{
          opacity: hovered ? 0.8 : 0.4,
          scale: hovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Main text with glitch effect */}
      <div className="relative">
        <GlitchText text={text} intensity="high" color="soft" className="relative z-10 font-extrabold tracking-wider" />

        {/* Text shadow/echo effect */}
        <div className="absolute inset-0 text-cyan-500/20 blur-sm -z-10 transform translate-x-1 translate-y-1">
          {text}
        </div>
        <div className="absolute inset-0 text-pink-500/20 blur-sm -z-10 transform -translate-x-1 -translate-y-1">
          {text}
        </div>
      </div>

      {/* Optional subtext */}
      {withSubtext && (
        <motion.div
          className="mt-4 text-center text-slate-300/80 text-sm md:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          CREATE • TRADE • INNOVATE
        </motion.div>
      )}

      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 border border-cyan-500/50 opacity-70"></div>
      <div className="absolute -bottom-4 -right-4 w-8 h-8 border border-pink-500/50 opacity-70"></div>
    </div>
  )
}
