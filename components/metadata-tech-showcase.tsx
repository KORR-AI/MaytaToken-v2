"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"
import ModernCard from "./modern-card"
import MetadataTechIcon from "./artwork/metadata-tech-icon" // Import our new component

export default function MetadataTechShowcase() {
  return (
    <motion.div
      className="mt-16 mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-white">Advanced </span>
          <span className="gradient-text">Metadata Technology</span>
        </h2>
        <p className="text-white/80 max-w-3xl mx-auto">
          Our platform uses cutting-edge Token-2022 Extension Pointer technology for more efficient, cost-effective
          token creation
        </p>
      </div>

      <ModernCard className="p-6 border border-amber-500/30 bg-gradient-to-b from-amber-900/20 to-black/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-amber-400 mb-2">Single Transaction</h3>
            <p className="text-white/80 text-sm">
              Create tokens and metadata in one atomic operation, reducing complexity and fees
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            {/* Add our new icon component here */}
            <MetadataTechIcon className="mb-4" />
            <h3 className="text-xl font-bold text-amber-400 mb-2">Embedded Metadata</h3>
            <p className="text-white/80 text-sm">
              Metadata stored directly in the token mint account for improved efficiency
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-4 relative overflow-hidden">
            {/* Animated highlight effect */}
            <motion.div
              className="absolute inset-0 bg-amber-500/10 rounded-lg"
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [0.95, 1, 0.95],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center mb-4">
                <ArrowRight className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-400 mb-2">Learn More</h3>
              <p className="text-white/80 text-sm mb-4">Discover how our approach revolutionizes token creation</p>

              <Link href="/technology/metadata">
                <button className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg transition-all duration-300 text-sm flex items-center">
                  Explore Technology
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </ModernCard>
    </motion.div>
  )
}
