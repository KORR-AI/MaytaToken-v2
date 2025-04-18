"use client"

import { useState } from "react"
import ModernCard from "./modern-card"
import ModernButton from "./modern-button"
import { getQRCodeUrl, getPhantomAppStoreLink, isAndroid, isIOS } from "@/lib/mobile-wallet-connector"
import { ExternalLink, Smartphone, Info, ChevronDown, ChevronUp } from "lucide-react"

export default function MobileConnectionGuide() {
  const [showGuide, setShowGuide] = useState(false)
  const [showTroubleshooting, setShowTroubleshooting] = useState(false)

  const toggleGuide = () => setShowGuide(!showGuide)
  const toggleTroubleshooting = () => setShowTroubleshooting(!showTroubleshooting)

  const platformSpecificInstructions = () => {
    if (isAndroid()) {
      return (
        <div className="mt-4">
          <h4 className="font-bold text-amber-400 mb-2">Android-Specific Instructions:</h4>
          <ol className="list-decimal list-inside space-y-2 text-white/80">
            <li>Install Phantom from the Google Play Store</li>
            <li>Open the Phantom app</li>
            <li>Tap the "Browse" icon at the bottom of the screen</li>
            <li>
              Enter this URL in the address bar:{" "}
              <span className="text-amber-400 break-all text-xs">{window.location.href}</span>
            </li>
            <li>Once the page loads in Phantom's browser, tap "Connect Wallet"</li>
            <li>Approve the connection when prompted</li>
          </ol>
        </div>
      )
    } else if (isIOS()) {
      return (
        <div className="mt-4">
          <h4 className="font-bold text-amber-400 mb-2">iOS-Specific Instructions:</h4>
          <ol className="list-decimal list-inside space-y-2 text-white/80">
            <li>Install Phantom from the App Store</li>
            <li>Open the Phantom app</li>
            <li>Tap the "Browse" icon at the bottom of the screen</li>
            <li>
              Enter this URL in the address bar:{" "}
              <span className="text-amber-400 break-all text-xs">{window.location.href}</span>
            </li>
            <li>Once the page loads in Phantom's browser, tap "Connect Wallet"</li>
            <li>Approve the connection when prompted</li>
          </ol>
        </div>
      )
    }

    return (
      <div className="mt-4">
        <h4 className="font-bold text-amber-400 mb-2">General Instructions:</h4>
        <ol className="list-decimal list-inside space-y-2 text-white/80">
          <li>Install Phantom on your mobile device</li>
          <li>Open the Phantom app</li>
          <li>Use the "Browse" feature in Phantom to navigate to this page</li>
          <li>Connect your wallet when prompted</li>
        </ol>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <ModernButton onClick={toggleGuide} variant={showGuide ? "primary" : "outline"} size="sm" className="w-full">
        <Info className="mr-2" size={16} />
        {showGuide ? "Hide Connection Guide" : "Need help connecting on mobile?"}
      </ModernButton>

      {showGuide && (
        <ModernCard className="mt-4 p-6 border border-amber-500/30" variant="gradient">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Mobile Connection Guide</h3>

          <div className="space-y-6">
            <div className="bg-black/30 p-4 rounded-lg border border-amber-500/20">
              <p className="text-white/90">
                <strong className="text-amber-400">Best Method:</strong> Use Phantom's built-in browser to access this
                app directly.
              </p>
            </div>

            {platformSpecificInstructions()}

            <div className="flex flex-col items-center mt-4">
              <img
                src={getQRCodeUrl() || "/placeholder.svg"}
                alt="QR Code to this page"
                className="w-48 h-48 mb-2 bg-white p-2 rounded-lg"
              />
              <p className="text-sm text-white/80 text-center">
                Scan this QR code with your phone camera to open this page
              </p>
            </div>

            <div className="flex flex-col space-y-3">
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

              <a
                href="https://phantom.app/ul/browse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all duration-300"
              >
                <span>Open Phantom Browser</span>
                <ExternalLink size={16} className="ml-2" />
              </a>
            </div>

            <div>
              <button onClick={toggleTroubleshooting} className="flex items-center text-amber-400 hover:text-amber-300">
                {showTroubleshooting ? (
                  <ChevronUp className="mr-1" size={16} />
                ) : (
                  <ChevronDown className="mr-1" size={16} />
                )}
                {showTroubleshooting ? "Hide Troubleshooting" : "Show Troubleshooting Tips"}
              </button>

              {showTroubleshooting && (
                <div className="mt-4 bg-black/30 p-4 rounded-lg border border-amber-500/20">
                  <h4 className="font-bold text-amber-400 mb-2">Troubleshooting Tips:</h4>
                  <ul className="list-disc list-inside space-y-2 text-white/80">
                    <li>Make sure you have the latest version of Phantom installed</li>
                    <li>Try clearing your browser cache and cookies</li>
                    <li>Ensure you're using Phantom's built-in browser for the most reliable experience</li>
                    <li>If using deep links, make sure your device allows opening links in apps</li>
                    <li>Try scanning the QR code with another device</li>
                    <li>If all else fails, try accessing the app from a desktop browser</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  )
}
