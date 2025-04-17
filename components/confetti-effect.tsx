"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ConfettiEffectProps {
  duration?: number
  count?: number
  colors?: string[]
}

export default function ConfettiEffect({
  duration = 5000,
  count = 100,
  colors = ["#06b6d4", "#a855f7", "#ec4899", "#22c55e", "#fbbf24"],
}: ConfettiEffectProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      color: string
      rotation: number
      delay: number
    }>
  >([])

  useEffect(() => {
    // Generate confetti particles
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // random x position (0-100%)
      y: -10, // start above the viewport
      size: Math.random() * 8 + 4, // random size between 4-12px
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360, // random initial rotation
      delay: Math.random() * 1000, // random delay for staggered effect
    }))

    setParticles(newParticles)

    // Clean up after duration
    const timer = setTimeout(() => {
      setParticles([])
    }, duration)

    return () => clearTimeout(timer)
  }, [count, colors, duration])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%", // mix of circles and squares
            boxShadow: `0 0 ${particle.size / 2}px ${particle.color}80`,
          }}
          initial={{
            y: -20,
            x: 0,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: ["0%", `${100 + Math.random() * 50}%`],
            x: ["0%", `${(Math.random() - 0.5) * 50}%`, `${(Math.random() - 0.5) * 100}%`],
            opacity: [0, 1, 0],
            rotate: [0, particle.rotation, particle.rotation * 2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: particle.delay / 1000,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}
