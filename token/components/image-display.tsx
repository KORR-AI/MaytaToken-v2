"use client"

import { useState, useEffect } from "react"

interface ImageDisplayProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function ImageDisplay({ src, alt, width = 200, height = 200, className = "" }: ImageDisplayProps) {
  const [imageSrc, setImageSrc] = useState<string>(src)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    setImageSrc(src)
    setError(false)
  }, [src])

  // Handle local uploads
  if (src.startsWith("/uploads/")) {
    return (
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => {
          setError(true)
          setImageSrc("/placeholder.svg")
        }}
      />
    )
  }

  // Handle IPFS or other URLs
  return (
    <img
      src={error ? "/placeholder.svg" : imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        setError(true)
        setImageSrc("/placeholder.svg")
      }}
    />
  )
}
