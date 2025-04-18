"use client"

import { useTokenForm } from "@/context/token-form-context"
import ModernButton from "./modern-button"
import GlowingBalance from "./glowing-balance"
import { useEffect, useState } from "react"
import { isMobileDevice, isPhantomInstalled } from "@/lib/phantom-mobile-connector"
import MobileWalletConnect from "./mobile-wallet-connect"
import Link from "next/link"

export default function WalletStatus() {
  const { walletConnected, connectWallet, disconnectWallet, balance, fetchingBalance, fetchBalance } = useTokenForm()
  const [isMobile, setIsMobile] = useState(false)
  const [isPhantomAvailable, setIsPhantomAvailable] = useState(false)

  useEffect(() => {
    // Check if we're on mobile
    setIsMobile(isMobileDevice())
    // Check if Phantom extension is available
    setIsPhantomAvailable(isPhantomInstalled())
  }, [])

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center space-x-4 w-full">
        {walletConnected ? (
          <>
            <div className="bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2 flex items-center">
              <div className="mr-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-white/80 text-sm">Connected</span>
                </div>
                {balance !== null && <GlowingBalance balance={balance} size="md" />}
              </div>
              <ModernButton onClick={disconnectWallet} variant="outline" size="sm">
                Disconnect
              </ModernButton>
            </div>
            <button
              onClick={fetchBalance}
              className="text-xs bg-black/30 hover:bg-black/50 text-white py-1 px-2 h-auto rounded-md border border-white/10"
              disabled={fetchingBalance}
            >
              {fetchingBalance ? "..." : "↻"}
            </button>
          </>
        ) : (
          <div className="flex flex-col w-full">
            {isMobile ? (
              <>
                <MobileWalletConnect onConnect={connectWallet} />
                <div className="mt-2 text-center space-y-2">
                  <Link href="/phantom-help" className="text-sm text-amber-400 hover:text-amber-300 block">
                    Having trouble connecting? View help page
                  </Link>
                  <a href="/minimal-connect.html" className="text-sm text-green-400 hover:text-green-300 block">
                    Try ultra-simple connection page
                  </a>
                </div>
              </>
            ) : (
              <ModernButton onClick={connectWallet} size="lg" className="w-full">
                Connect Wallet
              </ModernButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
