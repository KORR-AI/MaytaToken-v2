"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import ModernButton from "@/components/modern-button"

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Set loaded state after a short delay to ensure smooth animation
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 z-0"></div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex flex-col items-center justify-center z-20"
      >
        {/* Text Container */}
        <motion.div
          className="mb-10 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Main title */}
          <h1 className="text-5xl md:text-7xl mb-4">
            <span className="neotech-font" data-text="Mayta">
              Mayta
            </span>
            <span className="neotech-font gradient" data-text="Token">
              Token
            </span>
          </h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-white/80 mt-4 text-base md:text-lg tracking-wider font-light"
          >
            THE SOLANA TOKEN CREATION PLATFORM
          </motion.div>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Link href="/create">
            <ModernButton size="lg" className="px-10 py-4 text-xl">
              ENTER
            </ModernButton>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
