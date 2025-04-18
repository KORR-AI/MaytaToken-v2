"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface HolographicCardProps {
  children: React.ReactNode
  className?: string
  intensity?: "low" | "medium" | "high"
  variant?: "cyan" | "purple" | "pink" | "mixed"
  interactive?: boolean
}

export default function HolographicCard({
  children,
  className = "",
  intensity = "medium",
  variant = "cyan",
  interactive = true,
}: HolographicCardProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Set intensity parameters
  const getIntensityParams = () => {
    switch (intensity) {
      case "low":
        return { maxRotate: 5, glowOpacity: 0.3, glowSize: 10 }
      case "high":
        return { maxRotate: 15, glowOpacity: 0.7, glowSize: 30 }
      case "medium":
      default:
        return { maxRotate: 10, glowOpacity: 0.5, glowSize: 20 }
    }
  }

  // Set variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case "cyan":
        return {
          border: "border-cyan-500/30",
          glow: "shadow-cyan-500/30",
          gradient: "from-cyan-900/20 to-cyan-700/10",
          highlight: "bg-cyan-500/10",
        }
      case "purple":
        return {
          border: "border-purple-500/30",
          glow: "shadow-purple-500/30",
          gradient: "from-purple-900/20 to-purple-700/10",
          highlight: "bg-purple-500/10",
        }
      case "pink":
        return {
          border: "border-pink-500/30",
          glow: "shadow-pink-500/30",
          gradient: "from-pink-900/20 to-pink-700/10",
          highlight: "bg-pink-500/10",
        }
      case "mixed":
      default:
        return {
          border: "border-cyan-500/30",
          glow: "shadow-cyan-500/30",
          gradient: "from-cyan-900/20 via-purple-900/10 to-pink-900/20",
          highlight: "bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10",
        }
    }
  }

  const { maxRotate, glowOpacity, glowSize } = getIntensityParams()
  const variantClasses = getVariantClasses()

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !interactive) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate mouse position relative to card center
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Calculate rotation based on mouse position
    const rotateY = (mouseX / (rect.width / 2)) * maxRotate
    const rotateX = -((mouseY / (rect.height / 2)) * maxRotate)

    setRotateX(rotateX)
    setRotateY(rotateY)
    setMouseX(mouseX)
    setMouseY(mouseY)
  }

  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  // Add subtle animation when not interactive
  useEffect(() => {
    if (!interactive) {
      const interval = setInterval(() => {
        setRotateX(Math.sin(Date.now() / 2000) * (maxRotate / 3))
        setRotateY(Math.cos(Date.now() / 2000) * (maxRotate / 3))
      }, 50)

      return () => clearInterval(interval)
    }
  }, [interactive, maxRotate])

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-lg border bg-black/80 backdrop-blur-sm transition-all duration-300",
        variantClasses.border,
        isHovered ? `shadow-[0_0_${glowSize}px_rgba(6,182,212,${glowOpacity})]` : "",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        boxShadow: isHovered ? `0 0 ${glowSize}px rgba(6, 182, 212, ${glowOpacity})` : "0 0 0 rgba(6, 182, 212, 0)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${variantClasses.gradient}`} />

      {/* Holographic highlight effect */}
      {isHovered && (
        <motion.div
          className={`absolute inset-0 opacity-50 ${variantClasses.highlight}`}
          style={{
            background: `radial-gradient(circle at ${mouseX + 50}% ${mouseY + 50}%, ${variant === "cyan" ? "rgba(6, 182, 212, 0.3)" : variant === "purple" ? "rgba(168, 85, 247, 0.3)" : variant === "pink" ? "rgba(236, 72, 153, 0.3)" : "rgba(6, 182, 212, 0.3)"}, transparent 50%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
      >
        <motion.div
          className="absolute h-[1px] w-full bg-cyan-400/50"
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full grid grid-cols-12 grid-rows-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`h-${i}`} className="w-full h-px bg-cyan-400/50" style={{ gridRow: i + 1 }} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`v-${i}`} className="h-full w-px bg-cyan-400/50" style={{ gridColumn: i + 1 }} />
          ))}
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan-500/70"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/70"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyan-500/70"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan-500/70"></div>

      {/* Content */}
      <div className="relative z-10 p-4">{children}</div>
    </motion.div>
  )
}
