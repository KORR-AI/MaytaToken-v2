"use client"

import { motion } from "framer-motion"

interface MetadataFlowProps {
  className?: string
  animated?: boolean
}

export default function MetadataFlow({ className = "", animated = true }: MetadataFlowProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto my-12 ${className}`}>
      <svg viewBox="0 0 900 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Background */}
        <rect width="900" height="300" fill="#000" fillOpacity="0.2" rx="8" />

        {/* Grid Lines */}
        <g opacity="0.1" stroke="#06B6D4" strokeWidth="0.5">
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 20} x2="900" y2={i * 20} />
          ))}
          {Array.from({ length: 45 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="300" />
          ))}
        </g>

        {/* Title */}
        <text x="450" y="30" textAnchor="middle" fill="#FBBF24" fontSize="18" fontWeight="bold">
          Token-2022 Metadata Flow
        </text>

        {/* Wallet */}
        <motion.g
          initial={{ opacity: 0.9 }}
          animate={animated ? { opacity: [0.9, 1, 0.9] } : {}}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <rect
            x="50"
            y="120"
            width="120"
            height="80"
            rx="8"
            fill="#000"
            fillOpacity="0.5"
            stroke="#A855F7"
            strokeWidth="1.5"
          />
          <text x="110" y="165" textAnchor="middle" fill="#F9FAFB" fontSize="14" fontWeight="bold">
            Wallet
          </text>
        </motion.g>

        {/* Transaction */}
        <motion.g
          initial={{ opacity: 0.9, x: 0 }}
          animate={
            animated
              ? {
                  opacity: [0.9, 1, 0.9],
                  x: [0, 5, 0],
                }
              : {}
          }
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
        >
          <rect
            x="250"
            y="120"
            width="120"
            height="80"
            rx="8"
            fill="#000"
            fillOpacity="0.5"
            stroke="#FBBF24"
            strokeWidth="1.5"
          />
          <text x="310" y="155" textAnchor="middle" fill="#F9FAFB" fontSize="14" fontWeight="bold">
            Single
          </text>
          <text x="310" y="175" textAnchor="middle" fill="#F9FAFB" fontSize="14" fontWeight="bold">
            Transaction
          </text>
        </motion.g>

        {/* Token Mint */}
        <motion.g
          initial={{ opacity: 0.9 }}
          animate={
            animated
              ? {
                  opacity: [0.9, 1, 0.9],
                  y: [0, -3, 0],
                }
              : {}
          }
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        >
          <rect
            x="450"
            y="80"
            width="140"
            height="160"
            rx="8"
            fill="#000"
            fillOpacity="0.5"
            stroke="#06B6D4"
            strokeWidth="1.5"
          />
          <line x1="450" y1="140" x2="590" y2="140" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 4" />
          <text x="520" y="120" textAnchor="middle" fill="#F9FAFB" fontSize="14" fontWeight="bold">
            Token Mint
          </text>
          <text x="520" y="180" textAnchor="middle" fill="#F9FAFB" fontSize="14" fontWeight="bold">
            Metadata
          </text>
        </motion.g>

        {/* Blockchain */}
        <motion.g
          initial={{ opacity: 0.9 }}
          animate={animated ? { opacity: [0.9, 1, 0.9] } : {}}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.5 }}
        >
          <rect
            x="670"
            y="100"
            width="180"
            height="120"
            rx="8"
            fill="#000"
            fillOpacity="0.5"
            stroke="#EC4899"
            strokeWidth="1.5"
          />
          <text x="760" y="165" textAnchor="middle" fill="#F9FAFB" fontSize="14" fontWeight="bold">
            Solana Blockchain
          </text>
        </motion.g>

        {/* Flow Arrows */}
        {/* Wallet to Transaction */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={
            animated
              ? {
                  opacity: [0, 1, 0],
                }
              : { opacity: 0.7 }
          }
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <path d="M170 160 L250 160" stroke="#A855F7" strokeWidth="2" />
          <polygon points="240,155 250,160 240,165" fill="#A855F7" />
        </motion.g>

        {/* Transaction to Token */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={
            animated
              ? {
                  opacity: [0, 1, 0],
                }
              : { opacity: 0.7 }
          }
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.7 }}
        >
          <path d="M370 160 L450 160" stroke="#FBBF24" strokeWidth="2" />
          <polygon points="440,155 450,160 440,165" fill="#FBBF24" />
        </motion.g>

        {/* Token to Blockchain */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={
            animated
              ? {
                  opacity: [0, 1, 0],
                }
              : { opacity: 0.7 }
          }
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.4 }}
        >
          <path d="M590 160 L670 160" stroke="#06B6D4" strokeWidth="2" />
          <polygon points="660,155 670,160 660,165" fill="#06B6D4" />
        </motion.g>

        {/* Data Packets */}
        {animated && (
          <>
            <motion.circle
              cx="210"
              cy="160"
              r="4"
              fill="#A855F7"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: [170, 250],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.2,
                repeatDelay: 0.5,
              }}
            />

            <motion.circle
              cx="410"
              cy="160"
              r="4"
              fill="#FBBF24"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: [370, 450],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.9,
                repeatDelay: 0.5,
              }}
            />

            <motion.circle
              cx="630"
              cy="160"
              r="4"
              fill="#06B6D4"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: [590, 670],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1.6,
                repeatDelay: 0.5,
              }}
            />
          </>
        )}

        {/* Scan Line Effect */}
        {animated && (
          <motion.line
            initial={{ y1: 0, y2: 0 }}
            animate={{ y1: 300, y2: 300 }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            x1="0"
            x2="900"
            stroke="#06B6D4"
            strokeWidth="1"
            opacity="0.3"
          />
        )}

        {/* Labels */}
        <text x="110" y="220" textAnchor="middle" fill="#A855F7" fontSize="12">
          User Signs
        </text>

        <text x="310" y="220" textAnchor="middle" fill="#FBBF24" fontSize="12">
          Single Atomic Operation
        </text>

        <text x="520" y="260" textAnchor="middle" fill="#06B6D4" fontSize="12">
          Combined Account
        </text>

        <text x="760" y="240" textAnchor="middle" fill="#EC4899" fontSize="12">
          Permanent Storage
        </text>
      </svg>
    </div>
  )
}
