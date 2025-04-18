"use client"

import { useFormStep } from "@/context/form-step-context"
import { cn } from "@/lib/utils"

export default function StepIndicator() {
  const { currentStep, goToStep } = useFormStep()

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Appearance" },
    { number: 3, title: "Authorities" },
    { number: 4, title: "Review" },
  ]

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <button
              onClick={() => goToStep(step.number as 1 | 2 | 3 | 4)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium mb-2 transition-all duration-300",
                currentStep === step.number
                  ? "bg-amber-500 text-black"
                  : currentStep > step.number
                    ? "bg-amber-900/50 text-amber-400 border border-amber-500/50"
                    : "bg-gray-800/50 text-gray-400 border border-gray-700",
              )}
            >
              {step.number}
            </button>
            <span
              className={cn("text-sm", currentStep === step.number ? "text-amber-400 font-medium" : "text-gray-400")}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="relative mt-4">
        <div className="absolute top-0 left-0 h-1 bg-gray-700 w-full rounded-full"></div>
        <div
          className="absolute top-0 left-0 h-1 bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep - 1) * 33.33}%` }}
        ></div>
      </div>
    </div>
  )
}
