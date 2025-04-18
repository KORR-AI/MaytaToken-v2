import type * as React from "react"
import { cn } from "@/lib/utils"

interface CleanCardProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "bordered" | "subtle"
}

export default function CleanCard({ children, className = "", variant = "default" }: CleanCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "bordered":
        return "border border-gray-200 dark:border-gray-800"
      case "subtle":
        return "bg-gray-50 dark:bg-gray-900/50"
      case "default":
      default:
        return "bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800"
    }
  }

  return <div className={cn("rounded-lg shadow-sm p-4", getVariantClasses(), className)}>{children}</div>
}
