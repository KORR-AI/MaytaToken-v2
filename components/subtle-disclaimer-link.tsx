"use client"

import { useState } from "react"
import Link from "next/link"

interface SubtleDisclaimerLinkProps {
  className?: string
  text?: string
}

export default function SubtleDisclaimerLink({ className = "", text = "Disclaimer" }: SubtleDisclaimerLinkProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <span
      className={`text-white/10 text-[9px] hover:text-white/40 transition-colors duration-700 cursor-default ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? <Link href="/legal/disclaimer">{text}</Link> : text}
    </span>
  )
}
