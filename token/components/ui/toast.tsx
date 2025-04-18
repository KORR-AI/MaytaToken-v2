"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export interface ToastProps {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, title, description, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Allow animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, id, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-amber-900/70 border-amber-500 text-amber-200" // Changed from green to amber
      case "error":
        return "bg-red-900/70 border-red-500 text-red-200"
      case "warning":
        return "bg-orange-900/70 border-orange-500 text-orange-200"
      case "info":
      default:
        return "bg-blue-900/70 border-blue-500 text-blue-200"
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className={`${getTypeStyles()} border backdrop-blur-sm rounded-lg shadow-lg p-4 mb-4 max-w-md w-full`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{title}</h3>
              {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
            </div>
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onClose(id), 300)
              }}
              className="text-white/70 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export interface ToastContainerProps {
  children: React.ReactNode
}

export function ToastContainer({ children }: ToastContainerProps) {
  return <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-4 max-w-md">{children}</div>
}
