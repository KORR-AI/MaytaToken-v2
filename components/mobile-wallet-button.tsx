"use client"

import { useState } from "react"
import {
  connectWithPhantomDeepLink,
  connectWithUniversalLink,
  getQRCodeUrl,
  getPhantomAppStoreLink,
} from "@/lib/mobile-wallet-connector"
import ModernButton from "./modern-button"
import ModernCard from "./modern-card"
import { ExternalLink, Smartphone, QrCode } from "lucide-react"

export default function MobileWalletButton() {
  const [showOptions, setShowOptions] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const handleConnectClick = () => {
    setShowOptions(true)
  }

  const handleDirectConnect = () => {
    // Try the direct deep link first
    connectWithPhantomDeepLink()
  }

  const handleUniversalLink = () => {
    // Try the universal link approach
    connectWithUniversalLink()
  }

  const toggleQRCode = () => {
    setShowQR(!showQR)
  }

  return (
    <div className="w-full">
      {!showOptions ? (
        <ModernButton onClick={handleConnectClick} size="lg" className="w-full">
          <Smartphone className="mr-2" size={18} />
          Connect Phantom Mobile
        </ModernButton>
      ) : (
        <ModernCard className="p-4 border border-amber-500/30" variant="gradient">
          <h3 className="text-lg font-bold text-amber-400 mb-4 text-center">Connect with Phantom Mobile</h3>

          <div className="space-y-4">
            <div className="flex flex-col space-y-3">
              <ModernButton onClick={handleDirectConnect} className="w-full">
                Open in Phantom App
              </ModernButton>

              <ModernButton onClick={handleUniversalLink} variant="outline" className="w-full">
                Try Alternative Connection
              </ModernButton>

              <ModernButton onClick={toggleQRCode} variant={showQR ? "primary" : "outline"} className="w-full">
                <QrCode className="mr-2" size={16} />
                {showQR ? "Hide QR Code" : "Show QR Code"}
              </ModernButton>
            </div>

            {showQR && (
              <div className="flex flex-col items-center mt-4">
                <img
                  src={getQRCodeUrl() || "/placeholder.svg"}
                  alt="QR Code to connect"
                  className="w-48 h-48 mb-2 bg-white p-2 rounded-lg"
                />
                <p className="text-sm text-white/80 text-center">Scan this QR code with another device</p>
              </div>
            )}

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-bold text-white mb-2">Don't have Phantom?</h4>
              <a
                href={getPhantomAppStoreLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
              >
                <Smartphone className="mr-2" size={18} />
                <span>Download Phantom App</span>
                <ExternalLink size={16} className="ml-2" />
              </a>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowOptions(false)}
                className="text-sm text-white/60 hover:text-white underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  )
}
