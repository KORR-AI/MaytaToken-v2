"use client"

import { useState, useEffect } from "react"
import { isMobileDevice, isPhantomInstalled } from "@/lib/phantom-mobile-connector"
import DirectMobileConnect from "./direct-mobile-connect"
import ModernButton from "./modern-button"
import { Smartphone } from "lucide-react"

export default function MobileWalletConnect({ onConnect }: { onConnect?: () => void }) {
  const [showConnectOptions, setShowConnectOptions] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [phantomInstalled, setPhantomInstalled] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
    setPhantomInstalled(isPhantomInstalled())
  }, [])

  if (!isMobile) {
    return null
  }

  if (!showConnectOptions) {
    return (
      <ModernButton onClick={() => setShowConnectOptions(true)} size="lg" className="w-full">
        <Smartphone className="mr-2" size={18} />
        Connect Phantom Mobile
      </ModernButton>
    )
  }

  return (
    <div className="w-full">
      <DirectMobileConnect onConnect={onConnect} />

      <div className="mt-4 text-center">
        <button
          onClick={() => setShowConnectOptions(false)}
          className="text-sm text-white/60 hover:text-white underline"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
