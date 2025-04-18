"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LeverToggleProps {
  enabled: boolean
  onChange: () => void
  label: string
  price?: string
  className?: string
}

export default function LeverToggle({ enabled, onChange, label, price, className }: LeverToggleProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center">
        <span className="text-lg text-white/90 mr-2">{label}</span>
        {price && (
          <span className={`text-sm ${enabled ? "text-amber-400" : "text-white/50"} transition-colors duration-300`}>
            {price}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onChange}
        className={cn(
          "relative w-14 h-7 rounded-full transition-colors duration-300 flex items-center",
          enabled ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-gray-700",
        )}
        aria-pressed={enabled}
      >
        {/* Track highlight when enabled */}
        {enabled && (
          <motion.div
            className="absolute inset-0 rounded-full opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(circle at center, rgba(251, 191, 36, 0.6) 0%, transparent 70%)",
            }}
          />
        )}

        {/* Toggle handle */}
        <motion.div
          className={cn(
            "w-5 h-5 rounded-full shadow-md flex items-center justify-center absolute",
            enabled ? "bg-white" : "bg-gray-300",
          )}
          animate={{
            x: enabled ? "calc(100% - 4px)" : "4px",
            boxShadow: enabled ? "0 0 10px 1px rgba(251, 191, 36, 0.7)" : "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {/* Optional inner dot */}
          <div
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-300",
              enabled ? "bg-amber-500" : "bg-gray-400",
            )}
          />
        </motion.div>
      </button>
    </div>
  )
}
