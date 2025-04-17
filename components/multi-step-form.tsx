"use client"

import { useFormStep } from "@/context/form-step-context"
import StepIndicator from "./step-indicator"
import Step1BasicInfo from "./token-steps/step1-basic-info"
import Step2Appearance from "./token-steps/step2-appearance"
import Step3Authorities from "./token-steps/step3-authorities"
import Step4Review from "./token-steps/step4-review"

export default function MultiStepForm() {
  const { currentStep } = useFormStep()

  return (
    <div className="max-w-4xl mx-auto px-4">
      <StepIndicator />

      {currentStep === 1 && <Step1BasicInfo />}
      {currentStep === 2 && <Step2Appearance />}
      {currentStep === 3 && <Step3Authorities />}
      {currentStep === 4 && <Step4Review />}
    </div>
  )
}
