"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CleanButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "danger" | "success"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

export default function CleanButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  className,
  ...props
}: CleanButtonProps) {
  // Map our custom variants to shadcn button variants
  const getVariant = () => {
    switch (variant) {
      case "primary":
        return "default"
      case "secondary":
        return "secondary"
      case "outline":
        return "outline"
      case "danger":
        return "destructive"
      case "success":
        return "default" // We'll customize this with className
      default:
        return "default"
    }
  }

  // Map our custom sizes to tailwind classes
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

  // Get custom classes for variants that need special styling
  const getCustomClasses = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 text-white"
      default:
        return ""
    }
  }

  return (
    <Button
      variant={getVariant()}
      className={cn(
        getSizeClasses(),
        getCustomClasses(),
        fullWidth ? "w-full" : "",
        "flex items-center justify-center transition-all",
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  )
}
