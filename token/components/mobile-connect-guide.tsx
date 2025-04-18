"use client"

import { useState } from "react"
import { getPhantomDeepLink, getQRCodeUrl } from "@/lib/wallet-utils"
import ModernButton from "./modern-button"
import ModernCard from "./modern-card"
import { ExternalLink, Smartphone } from "lucide-react"

export default function MobileConnectGuide() {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <div className="mt-4">
      <ModernButton onClick={() => setShowGuide(!showGuide)} variant={showGuide ? "outline" : "primary"} size="sm">
        {showGuide ? "Hide Mobile Guide" : "Need help connecting on mobile?"}
      </ModernButton>

      {showGuide && (
        <ModernCard className="mt-4 p-6 border border-amber-500/30" variant="gradient">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Connecting on Android</h3>

          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <img
                src={getQRCodeUrl() || "/placeholder.svg"}
                alt="QR Code to this page"
                className="w-48 h-48 mb-2 bg-white p-2 rounded-lg"
              />
              <p className="text-sm text-white/80 text-center">Scan this QR code with your phone camera</p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-bold text-white mb-2">Step-by-step instructions:</h4>
              <ol className="list-decimal list-inside space-y-2 text-white/80">
                <li>Install the Phantom app from the Play Store</li>
                <li>Open the Phantom app on your device</li>
                <li>
                  Tap the <span className="text-amber-400">Browse</span> icon at the bottom
                </li>
                <li>
                  Enter this URL in the address bar:{" "}
                  <span className="text-amber-400 break-all text-xs">{window.location.href}</span>
                </li>
                <li>Use the app directly within Phantom's browser</li>
              </ol>
            </div>

            <div className="flex flex-col space-y-3">
              <a
                href="https://phantom.app/download"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
              >
                <Smartphone className="mr-2" size={18} />
                <span>Download Phantom App</span>
                <ExternalLink size={16} className="ml-2" />
              </a>

              <a
                href={getPhantomDeepLink()}
                className="flex items-center justify-center p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all duration-300"
              >
                <span>Open in Phantom</span>
                <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  )
}
