"use client"

import { motion } from "framer-motion"
import ThickProgressBar from "./thick-progress-bar"

interface TokenProcessingScreenProps {
  progress: number
  status: string
  onCancel?: () => void
}

export default function TokenProcessingScreen({ progress, status, onCancel }: TokenProcessingScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <motion.div
        className="max-w-2xl w-full relative overflow-hidden border border-amber-500/30 bg-gradient-to-b from-black/80 to-gray-900/60 rounded-xl p-8 shadow-lg shadow-amber-500/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated borders */}
        <div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"
          style={{ animation: "shimmer 2s infinite linear" }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0"
          style={{ animation: "shimmer 2s infinite linear reverse" }}
        ></div>
        <div
          className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500/0 via-amber-500 to-amber-500/0"
          style={{ animation: "shimmer 2s infinite linear" }}
        ></div>
        <div
          className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-amber-500/0 via-amber-500 to-amber-500/0"
          style={{ animation: "shimmer 2s infinite linear reverse" }}
        ></div>

        {/* Title */}
        <motion.h2
          className="text-2xl font-bold text-amber-400 text-center mb-8"
          animate={{
            textShadow: [
              "0 0 10px rgba(251, 191, 36, 0.5)",
              "0 0 20px rgba(251, 191, 36, 0.8)",
              "0 0 10px rgba(251, 191, 36, 0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          Creating Your Token
        </motion.h2>

        {/* Progress bar */}
        <div className="mb-8">
          <ThickProgressBar
            progress={progress}
            height="h-16"
            glowColor={progress >= 50 ? "rgba(251, 191, 36, 0.9)" : "rgba(251, 191, 36, 0.7)"}
            className={progress >= 50 ? "animate-pulse-subtle" : ""}
          />
        </div>

        {/* Status message */}
        <div className="bg-black/40 border border-amber-500/20 rounded-lg p-4 mb-6 max-h-60 overflow-auto">
          <h3 className="text-lg font-medium text-amber-400 mb-2">Status</h3>
          <div
            className={`whitespace-pre-line ${progress >= 50 ? "text-xl font-medium text-amber-300" : "text-white/80"}`}
          >
            {progress >= 50 ? (
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  textShadow: [
                    "0 0 5px rgba(251, 191, 36, 0.3)",
                    "0 0 10px rgba(251, 191, 36, 0.5)",
                    "0 0 5px rgba(251, 191, 36, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                {status}
                {progress >= 75 && progress < 100 && (
                  <span className="block mt-2 text-green-400">Almost there! Finalizing your token...</span>
                )}
                {progress >= 90 && (
                  <span className="block mt-2 text-green-500 font-bold">Success is moments away!</span>
                )}
              </motion.div>
            ) : (
              status
            )}
          </div>
        </div>

        {/* Cancel button (only show if progress is low) */}
        {progress < 20 && onCancel && (
          <div className="text-center mt-4">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to cancel? This may leave your transaction in an incomplete state.",
                  )
                ) {
                  onCancel()
                }
              }}
              className="text-sm text-white/60 hover:text-white underline"
            >
              Cancel (Only if stuck)
            </button>
          </div>
        )}

        {/* Add some additional visual elements for excitement when progress is high */}
        {progress >= 50 && (
          <div className="mt-4 text-center">
            <motion.div
              className="inline-block"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 1, 0, -1, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-amber-400 text-xl font-bold">
                {progress >= 90
                  ? "🚀 Almost Complete! 🚀"
                  : progress >= 75
                    ? "🔥 Making Great Progress! 🔥"
                    : "⚡ Creating Your Token! ⚡"}
              </span>
            </motion.div>
          </div>
        )}

        {/* Add keyframes for the shimmer animation */}
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </motion.div>
    </div>
  )
}
