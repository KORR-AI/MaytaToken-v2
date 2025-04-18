interface CleanProgressProps {
  value: number
  max?: number
  className?: string
  showValue?: boolean
  size?: "sm" | "md" | "lg"
  label?: string
}

export default function CleanProgress({
  value,
  max = 100,
  className = "",
  showValue = true,
  size = "md",
  label,
}: CleanProgressProps) {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-1.5"
      case "lg":
        return "h-4"
      case "md":
      default:
        return "h-2.5"
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Label and value */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1 text-sm">
          {label && <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>}
          {showValue && (
            <span className="text-gray-600 dark:text-gray-400">
              {value}/{max}
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${getSizeClasses()}`}>
        <div
          className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
