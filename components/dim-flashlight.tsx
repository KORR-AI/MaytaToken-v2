"use client"

import { useState, useEffect } from "react"

interface DimFlashlightProps {
  color?: string
  size?: number
  opacity?: number
  mixBlendMode?: string
  className?: string
}

export default function DimFlashlight({
  color = "rgba(255, 191, 36, 0.2)", // Adjusted from 0.15 to 0.2
  size = 600,
  opacity = 0.5, // Adjusted from 0.4 to 0.5
  mixBlendMode = "screen",
  className = "",
}: DimFlashlightProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Calculate size as a quarter of the viewport's smallest dimension
  const calculatedSize = Math.min(windowSize.width, windowSize.height) * 0.5

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-10 ${className}`}
      style={{
        background: `radial-gradient(circle ${calculatedSize}px at ${mousePosition.x}px ${mousePosition.y}px, ${color}, rgba(0,0,0,0.075) 70%, transparent 100%)`, // Adjusted transparency
        width: "100%",
        height: "100%",
        opacity,
        mixBlendMode: mixBlendMode as any,
        transition: "background 0.05s ease-out",
      }}
    />
  )
}
