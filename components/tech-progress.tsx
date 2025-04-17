"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TechProgressProps {
  value: number
  max?: number
  className?: string
  showValue?: boolean
  color?: "cyan" | "purple" | "pink" | "mixed"
  size?: "sm" | "md" | "lg"
  animated?: boolean
  label?: string
}

export default function TechProgress({
  value,
  max = 100,
  className = "",
  showValue = true,
  color = "cyan",
  size = "md",
  animated = true,
  label,
}: TechProgressProps) {
  const [displayValue, setDisplayValue] = useState(0)

  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  // Get color classes
  const getColorClasses = () => {
    switch (color) {
      case "purple":
        return {
          bar: "bg-purple-500",
          glow: "shadow-[0_0_10px_rgba(168,85,247,0.7)]",
          text: "text-purple-400",
          border: "border-purple-500/30",
          highlight: "bg-purple-500/20",
        }
      case "pink":
        return {
          bar: "bg-pink-500",
          glow: "shadow-[0_0_10px_rgba(236,72,153,0.7)]",
          text: "text-pink-400",
          border: "border-pink-500/30",
          highlight: "bg-pink-500/20",
        }
      case "mixed":
        return {
          bar: "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500",
          glow: "shadow-[0_0_10px_rgba(6,182,212,0.7)]",
          text: "text-cyan-400",
          border: "border-cyan-500/30",
          highlight: "bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20",
        }
      case "cyan":
      default:
        return {
          bar: "bg-cyan-500",
          glow: "shadow-[0_0_10px_rgba(6,182,212,0.7)]",
          text: "text-cyan-400",
          border: "border-cyan-500/30",
          highlight: "bg-cyan-500/20",
        }
    }
  }

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          height: "h-2",
          text: "text-xs",
          padding: "py-1",
        }
      case "lg":
        return {
          height: "h-6",
          text: "text-base",
          padding: "py-3",
        }
      case "md":
      default:
        return {
          height: "h-4",
          text: "text-sm",
          padding: "py-2",
        }
    }
  }

  const colorClasses = getColorClasses()
  const sizeClasses = getSizeClasses()

  // Animate value counter
  useEffect(() => {
    if (!animated) {
      setDisplayValue(value)
      return
    }

    const duration = 1000 // ms
    const steps = 20
    const stepDuration = duration / steps
    const increment = (value - displayValue) / steps

    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++

      if (currentStep >= steps) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue((prev) => Math.round(prev + increment))
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [value, animated, displayValue])

  return (
    <div className={`w-full ${className}`}>
      {/* Label and value */}
      {(label || showValue) && (
        <div className={`flex justify-between items-center mb-1 ${sizeClasses.text}`}>
          {label && <span className={colorClasses.text}>{label}</span>}
          {showValue && (
            <span className={`font-mono ${colorClasses.text}`}>
              {displayValue}/{max}
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={`relative w-full ${sizeClasses.height} bg-black/50 rounded-sm overflow-hidden border ${colorClasses.border}`}
      >
        {/* Background grid pattern */}
        <div className="absolute inset-0 grid grid-cols-10 gap-px pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-full border-r border-white/5" />
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          className={`h-full ${colorClasses.bar} ${animated ? colorClasses.glow : ""}`}
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
        >
          {/* Scan line effect */}
          {animated && (
            <motion.div
              className="absolute inset-y-0 w-1 bg-white/30 blur-[1px]"
              animate={{ left: ["-10%", "110%"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          )}

          {/* Highlight segments */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${i % 2 === 0 ? "opacity-50" : "opacity-30"}`}
                style={{
                  display: percentage >= (i + 1) * 10 ? "block" : "none",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Tick marks */}
        <div className="absolute inset-0 flex justify-between pointer-events-none">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className={`w-px h-full ${i % 5 === 0 ? "bg-white/20" : "bg-white/10"}`}
              style={{ left: `${i * 10}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
