"use client"

import { useEffect, useRef } from "react"

interface CyberBackgroundProps {
  intensity?: "low" | "medium" | "high"
  color?: "blue" | "purple" | "cyan" | "mixed"
  className?: string
}

export default function CyberBackground({
  intensity = "medium",
  color = "mixed",
  className = "",
}: CyberBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Set intensity parameters
  const getIntensityParams = () => {
    switch (intensity) {
      case "low":
        return { particleCount: 50, speed: 0.5, size: 1 }
      case "high":
        return { particleCount: 200, speed: 1.5, size: 2 }
      case "medium":
      default:
        return { particleCount: 100, speed: 1, size: 1.5 }
    }
  }

  // Set color parameters
  const getColorScheme = () => {
    switch (color) {
      case "blue":
        return ["#0ea5e9", "#1d4ed8", "#2563eb"]
      case "purple":
        return ["#a855f7", "#7e22ce", "#6b21a8"]
      case "cyan":
        return ["#06b6d4", "#0891b2", "#0e7490"]
      case "mixed":
      default:
        return ["#06b6d4", "#a855f7", "#ec4899"]
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

    // Create particles
    const { particleCount, speed, size } = getIntensityParams()
    const colors = getColorScheme()

    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      pulse: number
    }[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * size + 0.5,
        speedX: (Math.random() - 0.5) * speed,
        speedY: (Math.random() - 0.5) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * 0.02 + 0.01,
      })
    }

    // Create grid lines
    const gridLines: {
      x1: number
      y1: number
      x2: number
      y2: number
      color: string
      opacity: number
      pulse: number
    }[] = []

    // Horizontal grid lines
    for (let y = 0; y < canvas.height; y += 40) {
      gridLines.push({
        x1: 0,
        y1: y,
        x2: canvas.width,
        y2: y,
        color: "#06b6d4",
        opacity: Math.random() * 0.1 + 0.05,
        pulse: Math.random() * 0.01 + 0.005,
      })
    }

    // Vertical grid lines
    for (let x = 0; x < canvas.width; x += 40) {
      gridLines.push({
        x1: x,
        y1: 0,
        x2: x,
        y2: canvas.height,
        color: "#06b6d4",
        opacity: Math.random() * 0.1 + 0.05,
        pulse: Math.random() * 0.01 + 0.005,
      })
    }

    // Animation loop
    let animationFrameId: number
    let time = 0

    const render = () => {
      if (!canvas || !ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update time
      time += 0.01

      // Draw grid lines
      gridLines.forEach((line) => {
        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.strokeStyle = line.color
        ctx.globalAlpha = Math.sin(time * line.pulse) * 0.1 + line.opacity
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Draw and update particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = Math.sin(time * particle.pulse) * 0.2 + particle.opacity
        ctx.fill()

        // Update particle position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })

      // Draw scan line
      const scanLineY = (Math.sin(time * 0.5) * 0.5 + 0.5) * canvas.height
      ctx.beginPath()
      ctx.moveTo(0, scanLineY)
      ctx.lineTo(canvas.width, scanLineY)
      ctx.strokeStyle = "rgba(6, 182, 212, 0.3)"
      ctx.globalAlpha = 0.5
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw glow around scan line
      const gradient = ctx.createLinearGradient(0, scanLineY - 10, 0, scanLineY + 10)
      gradient.addColorStop(0, "rgba(6, 182, 212, 0)")
      gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.2)")
      gradient.addColorStop(1, "rgba(6, 182, 212, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, scanLineY - 10, canvas.width, 20)

      // Continue animation
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [intensity, color])

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full -z-10 ${className}`} />
}
