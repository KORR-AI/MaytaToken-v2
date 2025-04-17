"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface DigitalSpinnerProps {
  progress: number
  status: string
}

export default function DigitalSpinner({ progress, status }: DigitalSpinnerProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  // Animate the progress counter
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < progress) {
          return Math.min(prev + 1, progress)
        }
        return prev
      })
    }, 30)

    return () => clearInterval(interval)
  }, [progress])

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-64 h-64">
        {/* Digital circuit background */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 overflow-hidden">
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="w-full h-full opacity-20">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 h-px bg-cyan-500/50"
                  style={{
                    width: "100%",
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                  }}
                />
              ))}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 rounded-full border border-cyan-500/30"
                  style={{
                    width: `${(i + 1) * 25}%`,
                    height: `${(i + 1) * 25}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Rotating outer ring with data points */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(6, 182, 212, 0.7) 0%, rgba(6, 182, 212, 0.1) 20%, rgba(6, 182, 212, 0) 30%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 30}deg) translateX(32px) rotate(-${i * 30}deg)`,
                boxShadow: "0 0 8px rgba(6, 182, 212, 0.8)",
              }}
            />
          ))}
        </motion.div>

        {/* Middle rotating ring with analytical segments */}
        <motion.div
          className="absolute inset-8 rounded-full overflow-hidden"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <div className="w-full h-full relative">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-0 w-1/2 h-1/2"
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  transformOrigin: "bottom right",
                  background:
                    i % 2 === 0
                      ? "linear-gradient(45deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0))"
                      : "linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(236, 72, 153, 0))",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Inner rotating ring with data visualization */}
        <motion.div
          className="absolute inset-16 rounded-full border-2 border-pink-500/30 overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <div className="absolute inset-0 bg-black/60">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 bg-pink-500/70"
                style={{
                  width: "6.25%",
                  left: `${i * 6.25}%`,
                  opacity: 0.7,
                }}
                animate={{
                  height: [`${Math.random() * 30 + 30}%`, `${Math.random() * 30 + 70}%`],
                }}
                transition={{
                  duration: 1 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Center core with progress display - enhanced visibility */}
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="w-40 h-40 bg-black/90 rounded-full flex items-center justify-center border-2 border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <motion.div
              className="w-36 h-36 rounded-full bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30 flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 15px rgba(6,182,212,0.4)",
                  "0 0 25px rgba(6,182,212,0.6)",
                  "0 0 15px rgba(6,182,212,0.4)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="w-32 h-32 rounded-full bg-black/95 flex items-center justify-center text-white font-mono text-6xl font-bold relative">
                {/* Background glow for text */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-md"></div>

                <motion.div
                  className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300"
                  animate={{
                    scale: [1, 1.05, 1],
                    textShadow: [
                      "0 0 10px rgba(251,191,36,0.7)",
                      "0 0 20px rgba(251,191,36,0.9)",
                      "0 0 10px rgba(251,191,36,0.7)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  {displayProgress}%
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Orbiting data points */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full shadow-lg shadow-pink-500/50"></div>
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
        </motion.div>

        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <motion.div
            className="absolute h-px w-full bg-cyan-400/70 blur-[1px]"
            style={{ boxShadow: "0 0 8px rgba(6, 182, 212, 0.8)" }}
            animate={{ top: ["-5%", "105%"] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          ></motion.div>
        </div>
      </div>

      {/* Status text */}
      <motion.div
        className="mt-8 text-xl text-center font-medium text-cyan-300 max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        key={status} // This forces re-animation when status changes
      >
        {status}
      </motion.div>
    </div>
  )
}
