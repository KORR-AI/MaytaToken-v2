"use client"

import { useState, useEffect } from "react"
import {
  isMobileDevice,
  isPhantomInstalled,
  getQRCodeUrl,
  getPhantomAppStoreLink,
  getPhantomBrowserUrl,
  getDebugInfo,
} from "@/lib/phantom-mobile-connector"
import ModernButton from "./modern-button"
import ModernCard from "./modern-card"
import { ExternalLink, Smartphone, Bug, RefreshCw } from "lucide-react"

export default function DirectMobileConnect({ onConnect }: { onConnect?: () => void }) {
  const [showDebug, setShowDebug] = useState(false)
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [phantomInstalled, setPhantomInstalled] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
    setPhantomInstalled(isPhantomInstalled())
    setDebugInfo(getDebugInfo())
  }, [])

  const refreshDebugInfo = () => {
    setDebugInfo(getDebugInfo())
  }

  const openPhantomBrowser = () => {
    setIsLoading(true)
    window.location.href = getPhantomBrowserUrl()
  }

  return (
    <ModernCard className="p-6 border border-amber-500/30" variant="gradient">
      <h3 className="text-xl font-bold text-amber-400 mb-4 text-center">Connect with Phantom Mobile</h3>

      <div className="space-y-6">
        {/* Main instructions */}
        <div className="bg-black/30 p-4 rounded-lg border border-amber-500/20">
          <h4 className="font-bold text-white mb-2">How to connect:</h4>
          <ol className="list-decimal list-inside space-y-2 text-white/80">
            <li>Install Phantom app if you haven't already</li>
            <li>Open Phantom app on your device</li>
            <li>
              Tap the <span className="text-amber-400">Browse</span> icon at the bottom
            </li>
            <li>Enter this URL or use the button below</li>
          </ol>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <img
            src={getQRCodeUrl() || "/placeholder.svg"}
            alt="QR Code to this page"
            className="w-64 h-64 mb-2 bg-white p-2 rounded-lg"
          />
          <p className="text-sm text-white/80 text-center">Scan this QR code with your phone camera</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col space-y-3">
          <ModernButton onClick={openPhantomBrowser} loading={isLoading} className="w-full">
            <Smartphone className="mr-2" size={18} />
            Open in Phantom Browser
          </ModernButton>

          <a
            href={getPhantomAppStoreLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
          >
            <span>Download Phantom App</span>
            <ExternalLink size={16} className="ml-2" />
          </a>
        </div>

        {/* Debug section */}
        <div className="border-t border-white/10 pt-4">
          <button onClick={() => setShowDebug(!showDebug)} className="flex items-center text-white/60 hover:text-white">
            <Bug size={16} className="mr-2" />
            {showDebug ? "Hide Debug Info" : "Show Debug Info"}
          </button>

          {showDebug && (
            <div className="mt-4 bg-black/50 p-4 rounded-lg border border-white/10 font-mono text-xs">
              <div className="flex justify-between mb-2">
                <span className="text-white/80">Debug Information:</span>
                <button onClick={refreshDebugInfo} className="text-amber-400 hover:text-amber-300">
                  <RefreshCw size={14} />
                </button>
              </div>
              <pre className="text-white/70 overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </ModernCard>
  )
}
