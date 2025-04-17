"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DataDisplayProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  className?: string
  variant?: "primary" | "secondary" | "success" | "danger" | "warning"
  animated?: boolean
  loading?: boolean
  prefix?: string
  suffix?: string
}

export default function DataDisplay({
  title,
  value,
  icon,
  className = "",
  variant = "primary",
  animated = true,
  loading = false,
  prefix = "",
  suffix = "",
}: DataDisplayProps) {
  const [displayValue, setDisplayValue] = useState<string | number>("")

  // Get variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return {
          border: "border-purple-500/30",
          bg: "bg-purple-900/10",
          text: "text-purple-400",
          glow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]",
        }
      case "success":
        return {
          border: "border-green-500/30",
          bg: "bg-green-900/10",
          text: "text-green-400",
          glow: "shadow-[0_0_15px_rgba(34,197,94,0.2)]",
        }
      case "danger":
        return {
          border: "border-red-500/30",
          bg: "bg-red-900/10",
          text: "text-red-400",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]",
        }
      case "warning":
        return {
          border: "border-yellow-500/30",
          bg: "bg-yellow-900/10",
          text: "text-yellow-400",
          glow: "shadow-[0_0_15px_rgba(234,179,8,0.2)]",
        }
      case "primary":
      default:
        return {
          border: "border-cyan-500/30",
          bg: "bg-cyan-900/10",
          text: "text-cyan-400",
          glow: "shadow-[0_0_15px_rgba(6,182,212,0.2)]",
        }
    }
  }

  const variantClasses = getVariantClasses()

  // Animate value counter
  useEffect(() => {
    if (!animated || loading) {
      setDisplayValue(value)
      return
    }

    // If value is a number, animate counting up
    if (typeof value === "number") {
      const duration = 1000 // ms
      const steps = 20
      const stepDuration = duration / steps
      const increment = (value - (typeof displayValue === "number" ? displayValue : 0)) / steps

      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++

        if (currentStep >= steps) {
          setDisplayValue(value)
          clearInterval(interval)
        } else {
          setDisplayValue((prev) =>
            typeof prev === "number"
              ? Math.round((prev + increment) * 100) / 100
              : Math.round(increment * currentStep * 100) / 100,
          )
        }
      }, stepDuration)

      return () => clearInterval(interval)
    } else {
      // If value is a string, animate typing
      const targetValue = value.toString()
      const duration = 500 // ms
      const charCount = targetValue.length
      const stepDuration = duration / charCount

      let currentIndex = 0

      const interval = setInterval(() => {
        if (currentIndex >= charCount) {
          clearInterval(interval)
          return
        }

        setDisplayValue(targetValue.substring(0, currentIndex + 1))
        currentIndex++
      }, stepDuration)

      return () => clearInterval(interval)
    }
  }, [value, animated, loading, displayValue])

  return (
    <motion.div
      className={cn(
        "relative rounded-md border p-4",
        variantClasses.border,
        variantClasses.bg,
        animated ? variantClasses.glow : "",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current"></div>

      {/* Title */}
      <div className="flex items-center mb-2">
        {icon && <span className="mr-2">{icon}</span>}
        <h3 className={`text-sm font-medium ${variantClasses.text}`}>{title}</h3>
      </div>

      {/* Value */}
      <div className="flex items-center">
        {loading ? (
          <div className="flex items-center">
            <motion.div
              className={`w-4 h-4 border-2 border-current border-t-transparent rounded-full ${variantClasses.text}`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <span className={`ml-2 ${variantClasses.text}`}>Loading...</span>
          </div>
        ) : (
          <div className="font-mono text-2xl font-bold">
            {prefix && <span className={`text-sm ${variantClasses.text}`}>{prefix}</span>}
            <span className={variantClasses.text}>{displayValue}</span>
            {suffix && <span className={`text-sm ${variantClasses.text}`}>{suffix}</span>}
          </div>
        )}
      </div>

      {/* Scan line effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className={`absolute h-[1px] w-full ${variantClasses.text} opacity-30`}
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
