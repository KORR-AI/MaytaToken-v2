"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface GlitchTextEffectProps {
  text: string
  className?: string
  glitchIntensity?: "low" | "medium" | "high"
  color?: "cyan" | "purple" | "pink" | "mixed"
}

export default function GlitchTextEffect({
  text,
  className = "",
  glitchIntensity = "medium",
  color = "mixed",
}: GlitchTextEffectProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [displayText, setDisplayText] = useState(text)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?"

  // Set glitch parameters based on intensity
  const getGlitchParams = () => {
    switch (glitchIntensity) {
      case "low":
        return { frequency: 5000, duration: 100, probability: 0.3 }
      case "high":
        return { frequency: 2000, duration: 300, probability: 0.7 }
      case "medium":
      default:
        return { frequency: 3000, duration: 200, probability: 0.5 }
    }
  }

  // Set color classes based on color prop
  const getColorClasses = () => {
    switch (color) {
      case "cyan":
        return {
          base: "text-cyan-400",
          shadow: "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]",
          layer1: "text-cyan-500",
          layer2: "text-cyan-300",
        }
      case "purple":
        return {
          base: "text-purple-400",
          shadow: "drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]",
          layer1: "text-purple-500",
          layer2: "text-purple-300",
        }
      case "pink":
        return {
          base: "text-pink-400",
          shadow: "drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]",
          layer1: "text-pink-500",
          layer2: "text-pink-300",
        }
      case "mixed":
      default:
        return {
          base: "bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500",
          shadow: "drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]",
          layer1: "text-cyan-500",
          layer2: "text-pink-500",
        }
    }
  }

  const { frequency, duration, probability } = getGlitchParams()
  const colorClasses = getColorClasses()

  // Text scramble effect
  const scrambleText = () => {
    let iterations = 0
    const maxIterations = 10

    const scrambleInterval = setInterval(() => {
      if (iterations >= maxIterations) {
        clearInterval(scrambleInterval)
        setDisplayText(text)
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

      setDisplayText(newText)
      iterations++
    }, 50)
  }

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() < probability) {
        setIsGlitching(true)
        scrambleText()
        setTimeout(() => setIsGlitching(false), duration)
      }
    }, frequency)

    return () => clearInterval(glitchInterval)
  }, [text, duration, frequency, probability])

  return (
    <div className={`relative ${className}`}>
      {/* Base text */}
      <motion.div
        animate={{
          opacity: isGlitching ? [1, 0.8, 1, 0.6, 1] : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`relative ${colorClasses.base} ${colorClasses.shadow}`}
      >
        {displayText}
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
            {displayText}
          </div>
          <div
            className={`absolute top-0 left-0 ${colorClasses.layer2}`}
            style={{
              clipPath: "polygon(0 45%, 100% 45%, 100% 100%, 0 100%)",
              transform: `translate(${2 + Math.random() * 4}px, ${-Math.random() * 2}px)`,
              opacity: 0.8,
            }}
          >
            {displayText}
          </div>

          {/* Random horizontal slices for more intense glitching */}
          {glitchIntensity === "high" && (
            <>
              <div
                className={`absolute top-0 left-0 ${colorClasses.layer1}`}
                style={{
                  clipPath: `polygon(0 ${30 + Math.random() * 10}%, 100% ${30 + Math.random() * 10}%, 100% ${40 + Math.random() * 10}%, 0 ${40 + Math.random() * 10}%)`,
                  transform: `translate(${-3 - Math.random() * 5}px, 0)`,
                  opacity: 0.7,
                }}
              >
                {displayText}
              </div>
              <div
                className={`absolute top-0 left-0 ${colorClasses.layer2}`}
                style={{
                  clipPath: `polygon(0 ${60 + Math.random() * 10}%, 100% ${60 + Math.random() * 10}%, 100% ${70 + Math.random() * 10}%, 0 ${70 + Math.random() * 10}%)`,
                  transform: `translate(${3 + Math.random() * 5}px, 0)`,
                  opacity: 0.7,
                }}
              >
                {displayText}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
