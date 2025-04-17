"use client"

import { useState, useEffect } from "react"

interface LanternEffectProps {
  color?: string
  size?: number
  opacity?: number
  mixBlendMode?: string
  className?: string
}

export default function LanternEffect({
  color = "rgba(255, 191, 36, 0.2)", // Adjusted from 0.15 to 0.2
  size = 600,
  opacity = 0.5, // Adjusted from 0.4 to 0.5
  mixBlendMode = "screen",
  className = "",
}: LanternEffectProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-10 ${className}`}
      style={{
        background: `radial-gradient(circle ${size}px at ${mousePosition.x}px ${mousePosition.y}px, ${color}, transparent 100%)`,
        width: "100%",
        height: "100%",
        opacity,
        mixBlendMode: mixBlendMode as any,
        transition: "background 0.05s ease-out",
      }}
    />
  )
}
