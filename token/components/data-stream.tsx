"use client"

import { useEffect, useRef } from "react"

interface DataStreamProps {
  className?: string
  speed?: "slow" | "medium" | "fast"
  density?: "low" | "medium" | "high"
  color?: "cyan" | "green" | "purple" | "mixed"
}

export default function DataStream({
  className = "",
  speed = "medium",
  density = "medium",
  color = "cyan",
}: DataStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Set speed parameters
  const getSpeedParams = () => {
    switch (speed) {
      case "slow":
        return { fallSpeed: 1, updateInterval: 80 }
      case "fast":
        return { fallSpeed: 5, updateInterval: 30 }
      case "medium":
      default:
        return { fallSpeed: 3, updateInterval: 50 }
    }
  }

  // Set density parameters
  const getDensityParams = () => {
    switch (density) {
      case "low":
        return { columnCount: 20, dropChance: 0.01 }
      case "high":
        return { columnCount: 80, dropChance: 0.05 }
      case "medium":
      default:
        return { columnCount: 50, dropChance: 0.03 }
    }
  }

  // Set color parameters
  const getColorParams = () => {
    switch (color) {
      case "green":
        return {
          primary: "#22c55e",
          secondary: "#16a34a",
          highlight: "#4ade80",
        }
      case "purple":
        return {
          primary: "#a855f7",
          secondary: "#9333ea",
          highlight: "#c084fc",
        }
      case "mixed":
        return {
          primary: "#06b6d4",
          secondary: "#a855f7",
          highlight: "#ec4899",
        }
      case "cyan":
      default:
        return {
          primary: "#06b6d4",
          secondary: "#0891b2",
          highlight: "#22d3ee",
        }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Get parameters
    const { fallSpeed, updateInterval } = getSpeedParams()
    const { columnCount, dropChance } = getDensityParams()
    const { primary, secondary, highlight } = getColorParams()

    // Calculate column width
    const fontSize = 14
    const columnWidth = Math.ceil(canvas.width / columnCount)

    // Create columns
    const columns: number[] = []
    for (let i = 0; i < columnCount; i++) {
      columns[i] = Math.floor((Math.random() * canvas.height) / fontSize) * -1
    }

    // Characters to display
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"

    // Animation loop
    const draw = () => {
      if (!canvas || !ctx) return

      // Semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw characters
      for (let i = 0; i < columns.length; i++) {
        // Get a random character
        const charIndex = Math.floor(Math.random() * chars.length)
        const char = chars[charIndex]

        // Calculate x position
        const x = i * columnWidth

        // Calculate y position
        const y = columns[i] * fontSize

        // Determine if this is a highlight character
        const isHighlight = Math.random() < 0.1

        // Set color based on position and highlight
        if (isHighlight) {
          ctx.fillStyle = highlight
        } else if (columns[i] < 0) {
          ctx.fillStyle = secondary
        } else {
          ctx.fillStyle = primary
        }

        // Draw the character
        ctx.font = `${fontSize}px monospace`
        ctx.fillText(char, x, y)

        // Move the column down
        columns[i]++

        // Reset column if it's off screen or randomly
        if (columns[i] * fontSize > canvas.height && Math.random() > 0.975) {
          columns[i] = 0
        }

        // Randomly add new drops
        if (columns[i] === 0 && Math.random() < dropChance) {
          columns[i] = -1
        }
      }
    }

    // Start animation
    const interval = setInterval(draw, updateInterval)

    // Cleanup
    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [speed, density, color])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
}
