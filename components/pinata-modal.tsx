"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import PinataSettings from "@/components/pinata-settings"

export function PinataModal() {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Configure Pinata IPFS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <PinataSettings onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
