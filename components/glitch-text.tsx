"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: "low" | "medium" | "high"
  color?: "default" | "neon" | "rainbow" | "soft"
}

export default function GlitchText({ text, className = "", intensity = "medium", color = "default" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchText, setGlitchText] = useState(text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?"

  // Determine glitch frequency and duration based on intensity
  const getGlitchParams = () => {
    switch (intensity) {
      case "low":
        return { frequency: 3000, duration: 100, probability: 0.3 }
      case "high":
        return { frequency: 800, duration: 300, probability: 0.7 }
      case "medium":
      default:
        return { frequency: 1500, duration: 200, probability: 0.5 }
    }
  }

  const { frequency, duration, probability } = getGlitchParams()

  // Get color classes based on color prop
  const getColorClasses = () => {
    switch (color) {
      case "neon":
        return {
          base: "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]",
          layer1: "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]",
          layer2: "text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]",
        }
      case "rainbow":
        return {
          base: "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
          layer1: "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]",
          layer2: "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]",
        }
      case "soft":
        return {
          base: "text-slate-200/90 drop-shadow-[0_0_8px_rgba(226,232,240,0.3)]",
          layer1: "text-cyan-300/80 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]",
          layer2: "text-pink-300/80 drop-shadow-[0_0_6px_rgba(236,72,153,0.5)]",
        }
      default:
        return {
          base: "text-white",
          layer1: "text-cyan-500",
          layer2: "text-pink-500",
        }
    }
  }

  const colorClasses = getColorClasses()

  // Text scramble effect
  const scrambleText = () => {
    let iterations = 0
    const maxIterations = 10

    const scrambleInterval = setInterval(() => {
      if (iterations >= maxIterations) {
        clearInterval(scrambleInterval)
        setGlitchText(text)
        return
      }

      // Randomly replace some characters
      const newText = text
        .split("")
        .map((char, idx) => {
          // Higher chance to scramble characters in the middle of the animation
          const shouldScramble = Math.random() < 0.3 * Math.sin((iterations / maxIterations) * Math.PI)
          return shouldScramble ? chars[Math.floor(Math.random() * chars.length)] : char
        })
        .join("")

      setGlitchText(newText)
      iterations++
    }, 50)
  }

  useEffect(() => {
    // Random glitch effect
    intervalRef.current = setInterval(() => {
      if (Math.random() < probability) {
        setIsGlitching(true)
        scrambleText()
        setTimeout(() => setIsGlitching(false), duration + Math.random() * 100)
      }
    }, frequency)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text, duration, frequency, probability])

  return (
    <div className={`relative ${className}`}>
      {/* Base text */}
      <motion.div
        animate={{
          opacity: isGlitching ? [1, 0.8, 1, 0.6, 1] : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`relative ${colorClasses.base}`}
      >
        <span className="relative" data-text={glitchText}>
          {glitchText}
        </span>
      </motion.div>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          <div
            className={`absolute top-0 left-0 ${colorClasses.layer1}`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
              transform: `translate(${-2 - Math.random() * 4}px, ${Math.random() * 2}px)`,
              opacity: 0.8,
            }}
          >
            {glitchText}
          </div>
          <div
            className={`absolute top-0 left-0 ${colorClasses.layer2}`}
            style={{
              clipPath: "polygon(0 45%, 100% 45%, 100% 100%, 0 100%)",
              transform: `translate(${2 + Math.random() * 4}px, ${-Math.random() * 2}px)`,
              opacity: 0.8,
            }}
          >
            {glitchText}
          </div>

          {/* Random horizontal slices for more intense glitching */}
          {intensity === "high" && (
            <>
              <div
                className={`absolute top-0 left-0 ${colorClasses.layer1}`}
                style={{
                  clipPath: `polygon(0 ${30 + Math.random() * 10}%, 100% ${30 + Math.random() * 10}%, 100% ${40 + Math.random() * 10}%, 0 ${40 + Math.random() * 10}%)`,
                  transform: `translate(${-3 - Math.random() * 5}px, 0)`,
                  opacity: 0.7,
                }}
              >
                {glitchText}
              </div>
              <div
                className={`absolute top-0 left-0 ${colorClasses.layer2}`}
                style={{
                  clipPath: `polygon(0 ${60 + Math.random() * 10}%, 100% ${60 + Math.random() * 10}%, 100% ${70 + Math.random() * 10}%, 0 ${70 + Math.random() * 10}%)`,
                  transform: `translate(${3 + Math.random() * 5}px, 0)`,
                  opacity: 0.7,
                }}
              >
                {glitchText}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
