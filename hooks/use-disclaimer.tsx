"use client"

import { useState, useCallback } from "react"
import DisclaimerModal from "@/components/disclaimer-modal"

export function useDisclaimer() {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false)

  const openDisclaimer = useCallback(() => {
    setIsDisclaimerOpen(true)
  }, [])

  const closeDisclaimer = useCallback(() => {
    setIsDisclaimerOpen(false)
  }, [])

  // Component to render the modal
  const DisclaimerModalComponent = useCallback(
    () => <DisclaimerModal isOpen={isDisclaimerOpen} onClose={closeDisclaimer} />,
    [isDisclaimerOpen, closeDisclaimer],
  )

  return {
    openDisclaimer,
    closeDisclaimer,
    DisclaimerModal: DisclaimerModalComponent,
  }
}
