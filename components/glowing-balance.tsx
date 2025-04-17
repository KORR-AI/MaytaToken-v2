"use client"

import { motion } from "framer-motion"

interface GlowingBalanceProps {
  balance: number
  size?: "sm" | "md" | "lg"
  showSol?: boolean
  className?: string
}

export default function GlowingBalance({ balance, size = "md", showSol = true, className = "" }: GlowingBalanceProps) {
  // Determine text size based on size prop
  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xl"
      case "lg":
        return "text-3xl"
      case "md":
      default:
        return "text-2xl"
    }
  }

  const textSize = getTextSize()

  return (
    <div className={`relative flex items-baseline ${className}`}>
      {/* Background glow effect */}
      <div className="absolute -inset-4 bg-green-500/10 blur-xl rounded-full"></div>

      {/* Illuminated balance */}
      <div className="relative z-10 flex items-baseline">
        <motion.span
          className={`font-mono tracking-widest font-bold text-green-400 ${textSize}`}
          style={{
            textShadow: "0 0 5px rgba(74,222,128,0.8), 0 0 10px rgba(74,222,128,0.6), 0 0 15px rgba(74,222,128,0.4)",
          }}
          animate={{
            opacity: [0.9, 1, 0.9],
            textShadow: [
              "0 0 5px rgba(74,222,128,0.8), 0 0 10px rgba(74,222,128,0.6), 0 0 15px rgba(74,222,128,0.4)",
              "0 0 8px rgba(74,222,128,0.9), 0 0 15px rgba(74,222,128,0.7), 0 0 20px rgba(74,222,128,0.5)",
              "0 0 5px rgba(74,222,128,0.8), 0 0 10px rgba(74,222,128,0.6), 0 0 15px rgba(74,222,128,0.4)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          {balance.toFixed(4)}
        </motion.span>

        {showSol && (
          <span
            className={`ml-2 ${size === "lg" ? "text-xl" : "text-base"} font-bold text-green-300 drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]`}
          >
            SOL
          </span>
        )}
      </div>
    </div>
  )
}
