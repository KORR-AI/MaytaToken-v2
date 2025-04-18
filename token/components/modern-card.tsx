import type * as React from "react"
import { cn } from "@/lib/utils"

interface ModernCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "gradient" | "outline"
}

export default function ModernCard({ children, className = "", variant = "default" }: ModernCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-b from-black/80 to-gray-900/60 border border-white/5"
      case "outline":
        return "bg-transparent border border-white/5"
      case "default":
      default:
        return "bg-black/50 border border-white/5"
    }
  }

  return <div className={cn("rounded-xl p-4 backdrop-blur-sm", getVariantClasses(), className)}>{children}</div>
}
