"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface MetadataComparisonProps {
  className?: string
  animated?: boolean
}

export default function MetadataComparison({ className = "", animated = true }: MetadataComparisonProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`w-full max-w-3xl mx-auto my-8 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Background Grid */}
        <rect width="800" height="400" fill="#000" fillOpacity="0.3" rx="8" />
        <g opacity="0.1" stroke="#06B6D4" strokeWidth="0.5">
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 20} x2="800" y2={i * 20} />
          ))}
          {Array.from({ length: 40 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="400" />
          ))}
        </g>

        {/* Title */}
        <text x="400" y="40" textAnchor="middle" fill="#FBBF24" fontSize="20" fontWeight="bold">
          Metadata Implementation Comparison
        </text>

        {/* Traditional Approach - Left Side */}
        <g>
          <text x="200" y="80" textAnchor="middle" fill="#F87171" fontSize="16" fontWeight="bold">
            Traditional Metaplex
          </text>

          {/* Token Mint Account */}
          <motion.rect
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: animated && hovered ? [0.8, 1, 0.8] : 0.8,
              y: animated && hovered ? [120, 115, 120] : 120,
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            x="120"
            y="120"
            width="160"
            height="80"
            rx="8"
            fill="#7F1D1D"
            fillOpacity="0.3"
            stroke="#F87171"
            strokeWidth="1.5"
          />
          <text x="200" y="165" textAnchor="middle" fill="#F9FAFB" fontSize="14">
            Token Mint Account
          </text>

          {/* Metadata Account */}
          <motion.rect
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: animated && hovered ? [0.8, 1, 0.8] : 0.8,
              y: animated && hovered ? [250, 255, 250] : 250,
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
            x="120"
            y="250"
            width="160"
            height="80"
            rx="8"
            fill="#7F1D1D"
            fillOpacity="0.3"
            stroke="#F87171"
            strokeWidth="1.5"
          />
          <text x="200" y="295" textAnchor="middle" fill="#F9FAFB" fontSize="14">
            Metadata Account
          </text>

          {/* Connection Line */}
          <motion.path
            initial={{ opacity: 0.6 }}
            animate={{
              opacity: animated && hovered ? [0.6, 1, 0.6] : 0.6,
              strokeDashoffset: animated && hovered ? [0, 100] : 0,
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            d="M200 200 L200 250"
            stroke="#F87171"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <circle cx="200" cy="200" r="4" fill="#F87171" />
          <circle cx="200" cy="250" r="4" fill="#F87171" />

          {/* Disadvantages */}
          <g opacity="0.8">
            <text x="80" y="350" fill="#F87171" fontSize="12" fontWeight="bold">
              • Multiple Accounts
            </text>
            <text x="80" y="370" fill="#F87171" fontSize="12" fontWeight="bold">
              • Higher Costs
            </text>
          </g>
        </g>

        {/* Token-2022 Approach - Right Side */}
        <g>
          <text x="600" y="80" textAnchor="middle" fill="#10B981" fontSize="16" fontWeight="bold">
            Token-2022 Extension
          </text>

          {/* Combined Account */}
          <motion.rect
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: animated && hovered ? [0.8, 1, 0.8] : 0.8,
              y: animated && hovered ? [160, 165, 160] : 160,
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            x="520"
            y="160"
            width="160"
            height="120"
            rx="8"
            fill="#065F46"
            fillOpacity="0.3"
            stroke="#10B981"
            strokeWidth="1.5"
          />

          {/* Divider Line */}
          <motion.line
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: animated && hovered ? [0.8, 1, 0.8] : 0.8,
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            x1="520"
            y1="220"
            x2="680"
            y2="220"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />

          <text x="600" y="195" textAnchor="middle" fill="#F9FAFB" fontSize="14">
            Token Mint Account
          </text>
          <text x="600" y="245" textAnchor="middle" fill="#F9FAFB" fontSize="14">
            Embedded Metadata
          </text>

          {/* Advantages */}
          <g opacity="0.8">
            <text x="520" y="350" fill="#10B981" fontSize="12" fontWeight="bold">
              • Single Account
            </text>
            <text x="520" y="370" fill="#10B981" fontSize="12" fontWeight="bold">
              • Cost Efficient
            </text>
          </g>
        </g>

        {/* Center Comparison */}
        <g>
          <motion.path
            initial={{ opacity: 0 }}
            animate={{
              opacity: animated && hovered ? [0, 0.7, 0] : 0,
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            d="M300 220 L500 220"
            stroke="#FBBF24"
            strokeWidth="2"
            strokeDasharray="10,5"
          />

          {/* Comparison Arrow */}
          <motion.polygon
            initial={{ opacity: 0.8 }}
            animate={{
              opacity: animated && hovered ? [0.8, 1, 0.8] : 0.8,
              x: animated && hovered ? [380, 385, 380] : 380,
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            points="400,210 420,220 400,230"
            fill="#FBBF24"
          />
        </g>

        {/* Scan Line Effect */}
        {animated && (
          <motion.line
            initial={{ y1: 0, y2: 0 }}
            animate={{ y1: 400, y2: 400 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            x1="0"
            x2="800"
            stroke="#06B6D4"
            strokeWidth="1"
            opacity="0.3"
          />
        )}
      </svg>
    </div>
  )
}
