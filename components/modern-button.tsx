import type * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

export default function ModernButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  icon,
  className,
  ...props
}: ModernButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "button-gradient text-white hover:shadow-lg transition-shadow duration-300"
      case "secondary":
        return "bg-secondary text-white hover:bg-secondary/80"
      case "outline":
        return "bg-transparent border border-white/20 text-white hover:bg-white/5"
      case "ghost":
        return "bg-transparent text-white hover:bg-white/5"
      default:
        return "button-gradient text-white"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm"
      case "lg":
        return "px-6 py-3 text-base"
      case "md":
      default:
        return "px-4 py-2 text-sm"
    }
  }

  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-all duration-300 flex items-center justify-center",
        getVariantClasses(),
        getSizeClasses(),
        fullWidth ? "w-full" : "",
        loading ? "opacity-80 cursor-not-allowed" : "",
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
    </button>
  )
}
