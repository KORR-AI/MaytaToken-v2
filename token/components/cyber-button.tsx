"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CyberButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary" | "danger" | "success"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  fullWidth?: boolean
  icon?: React.ReactNode
  loading?: boolean
}

export default function CyberButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  fullWidth = false,
  icon,
  loading = false,
}: CyberButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return {
          base: "bg-gray-900 border-purple-500/50 text-purple-300",
          hover: "hover:border-purple-400 hover:bg-purple-950/30",
          active: "active:bg-purple-900/20",
          disabled: "disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-500",
          glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
        }
      case "danger":
        return {
          base: "bg-gray-900 border-red-500/50 text-red-300",
          hover: "hover:border-red-400 hover:bg-red-950/30",
          active: "active:bg-red-900/20",
          disabled: "disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-500",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
        }
      case "success":
        return {
          base: "bg-gray-900 border-green-500/50 text-green-300",
          hover: "hover:border-green-400 hover:bg-green-950/30",
          active: "active:bg-green-900/20",
          disabled: "disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-500",
          glow: "shadow-[0_0_15px_rgba(34,197,94,0.3)]",
        }
      case "primary":
      default:
        return {
          base: "bg-gray-900 border-cyan-500/50 text-cyan-300",
          hover: "hover:border-cyan-400 hover:bg-cyan-950/30",
          active: "active:bg-cyan-900/20",
          disabled: "disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-500",
          glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]",
        }
    }
  }

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1 text-sm"
      case "lg":
        return "px-6 py-3 text-lg"
      case "md":
      default:
        return "px-4 py-2 text-base"
    }
  }

  const variantClasses = getVariantClasses()
  const sizeClasses = getSizeClasses()

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        // Base styles
        "relative overflow-hidden border-2 rounded-md font-medium transition-all duration-300 flex items-center justify-center",
        // Variant styles
        variantClasses.base,
        variantClasses.hover,
        variantClasses.active,
        variantClasses.disabled,
        // Size styles
        sizeClasses,
        // Width
        fullWidth ? "w-full" : "",
        // Glow effect on hover
        isHovered ? variantClasses.glow : "",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        boxShadow: isHovered ? variantClasses.glow : "none",
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current"></div>

      {/* Scan line effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute h-[1px] w-full bg-current opacity-50"
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Button content */}
      <div className="flex items-center justify-center gap-2">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {loading ? (
          <div className="flex items-center gap-2">
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </div>
    </motion.button>
  )
}
