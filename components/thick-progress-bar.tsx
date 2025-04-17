"use client"

import { motion } from "framer-motion"

interface ThickProgressBarProps {
  progress: number
  className?: string
  height?: string
  showPercentage?: boolean
  glowColor?: string
  pulseIntensity?: number // Add this new prop
}

export default function ThickProgressBar({
  progress,
  className = "",
  height = "h-8",
  showPercentage = true,
  glowColor = "rgba(251, 191, 36, 0.7)",
  pulseIntensity = 1.2, // Default pulse intensity
}: ThickProgressBarProps) {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(100, Math.max(0, progress))

  // Determine if we should show enhanced effects (for progress >= 50%)
  const enhancedEffects = progress >= 50

  return (
    <div className={`relative w-full ${className}`}>
      {/* Background track with grid lines */}
      <div className={`w-full ${height} bg-gray-900/80 rounded-lg overflow-hidden border border-amber-500/30 relative`}>
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-10 gap-px pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-full border-r border-white/5" />
          ))}
        </div>

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

        {/* Progress fill */}
        <motion.div
          className={`h-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 relative overflow-hidden ${
            enhancedEffects ? "shadow-lg" : ""
          }`}
          style={{ width: `${safeProgress}%` }}
          initial={{ width: 0 }}
          animate={{
            width: `${safeProgress}%`,
            boxShadow: enhancedEffects ? `0 0 20px ${glowColor}` : "none",
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`,
            }}
            animate={{
              opacity: enhancedEffects ? [0.7, 1, 0.7] : [0.5, 0.7, 0.5],
            }}
            transition={{ duration: enhancedEffects ? 1.5 : 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          {/* Scan line effect - faster when progress is high */}
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ left: ["-10%", "110%"] }}
            transition={{
              duration: enhancedEffects ? 1.5 : 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Additional scan line for enhanced effect */}
          {enhancedEffects && (
            <motion.div
              className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{ left: ["-10%", "110%"] }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: 0.5,
              }}
            />
          )}

          {/* Highlight segments */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${i % 2 === 0 ? "bg-white/10" : "bg-transparent"}`}
                style={{
                  animation: enhancedEffects && i > 4 ? "pulse 1.5s ease-in-out infinite alternate" : "none",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Percentage display */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={`font-bold font-mono ${enhancedEffects ? "text-2xl" : "text-lg"} ${
              enhancedEffects ? "text-amber-300" : "text-amber-400"
            }`}
            style={{
              textShadow: enhancedEffects
                ? "0 0 15px rgba(251, 191, 36, 0.9), 0 0 10px rgba(251, 191, 36, 0.7)"
                : "0 0 10px rgba(251, 191, 36, 0.8)",
            }}
            animate={{
              scale: enhancedEffects ? [1, 1.1, 1] : [1, 1.05, 1],
              textShadow: enhancedEffects
                ? [
                    "0 0 15px rgba(251, 191, 36, 0.7)",
                    "0 0 25px rgba(251, 191, 36, 0.9)",
                    "0 0 15px rgba(251, 191, 36, 0.7)",
                  ]
                : [
                    "0 0 10px rgba(251, 191, 36, 0.7)",
                    "0 0 15px rgba(251, 191, 36, 0.9)",
                    "0 0 10px rgba(251, 191, 36, 0.7)",
                  ],
            }}
            transition={{
              duration: enhancedEffects ? 1.5 : 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {Math.round(safeProgress)}%
          </motion.div>
        </div>
      )}
    </div>
  )
}
