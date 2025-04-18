"use client"

import { motion } from "framer-motion"

interface MetadataTechIconProps {
  className?: string
  size?: number
  animated?: boolean
}

export default function MetadataTechIcon({ className = "", size = 120, animated = true }: MetadataTechIconProps) {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Circle */}
        <motion.circle
          cx="60"
          cy="60"
          r="56"
          fill="url(#techGradient)"
          fillOpacity="0.1"
          stroke="#FBBF24"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ opacity: 0.7 }}
          animate={
            animated
              ? {
                  opacity: [0.7, 0.9, 0.7],
                  rotate: [0, 360],
                }
              : {}
          }
          transition={{
            opacity: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          }}
        />

        {/* Token Circle */}
        <motion.circle
          cx="60"
          cy="60"
          r="32"
          fill="#000"
          fillOpacity="0.5"
          stroke="#06B6D4"
          strokeWidth="1.5"
          initial={{ scale: 1 }}
          animate={animated ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Token Symbol */}
        <text x="60" y="65" textAnchor="middle" fill="#06B6D4" fontSize="16" fontWeight="bold">
          SPL
        </text>

        {/* Metadata Nodes */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * 60 * Math.PI) / 180
          const x = 60 + 42 * Math.cos(angle)
          const y = 60 + 42 * Math.sin(angle)

          return (
            <motion.g key={i}>
              <motion.circle
                cx={x}
                cy={y}
                r="6"
                fill="#000"
                stroke="#FBBF24"
                strokeWidth="1"
                initial={{ opacity: 0.7 }}
                animate={
                  animated
                    ? {
                        opacity: [0.7, 1, 0.7],
                        y: [y, y - 2, y],
                      }
                    : {}
                }
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />

              {/* Connection Line */}
              <motion.line
                x1="60"
                y1="60"
                x2={x}
                y2={y}
                stroke="#FBBF24"
                strokeWidth="0.75"
                strokeDasharray="3 2"
                initial={{ opacity: 0.5 }}
                animate={animated ? { opacity: [0.5, 0.8, 0.5] } : {}}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            </motion.g>
          )
        })}

        {/* Scan Line */}
        {animated && (
          <motion.line
            x1="0"
            y1="60"
            x2="120"
            y2="60"
            stroke="#06B6D4"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.7, 0],
              y1: [0, 120],
              y2: [0, 120],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        )}

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="techGradient" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
