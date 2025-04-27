"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import PinataSettings from "@/components/pinata-settings"
import { getPinataKeys } from "@/lib/pinata-service"

export default function PinataModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasPinataKeys, setHasPinataKeys] = useState(() => {
    if (typeof window !== "undefined") {
      return !!getPinataKeys()
    }
    return false
  })

  const handleClose = () => {
    setIsOpen(false)
    // Check if keys are now configured
    if (typeof window !== "undefined") {
      setHasPinataKeys(!!getPinataKeys())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={hasPinataKeys ? "outline" : "default"} className="w-full">
          {hasPinataKeys ? "Update IPFS Settings" : "Configure IPFS Storage"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <PinataSettings onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
