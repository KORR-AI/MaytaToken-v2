"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useTokenForm } from "./token-form-context"

type FormStep = 1 | 2 | 3 | 4

interface FormStepContextType {
  currentStep: FormStep
  goToStep: (step: FormStep) => void
  nextStep: () => void
  prevStep: () => void
  isLastStep: boolean
  isFirstStep: boolean
}

const FormStepContext = createContext<FormStepContextType | undefined>(undefined)

export function FormStepProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<FormStep>(1)
  const { formState } = useTokenForm()

  const goToStep = (step: FormStep) => {
    setCurrentStep(step)
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as FormStep)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep)
    }
  }

  const isLastStep = currentStep === 4
  const isFirstStep = currentStep === 1

  return (
    <FormStepContext.Provider
      value={{
        currentStep,
        goToStep,
        nextStep,
        prevStep,
        isLastStep,
        isFirstStep,
      }}
    >
      {children}
    </FormStepContext.Provider>
  )
}

export function useFormStep() {
  const context = useContext(FormStepContext)
  if (context === undefined) {
    throw new Error("useFormStep must be used within a FormStepProvider")
  }
  return context
}
