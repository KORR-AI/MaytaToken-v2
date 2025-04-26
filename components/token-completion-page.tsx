"use client"
import { CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import ModernButton from "./modern-button"
import type React from "react"
import { useRouter } from "next/navigation"
import ModernCard from "./modern-card"
import ImageDisplay from "./image-display"
import Link from "next/link"
import { saveToken } from "@/lib/token-storage"
import { v4 as uuidv4 } from "uuid"

interface TokenCompletionPageProps {
  mintAddress: string
  tokenName: string
  tokenSymbol: string
  tokenImage?: string
  tokenSupply?: string
  tokenDecimals?: string
  onCreateAnother: () => void
}

const TokenCompletionPage: React.FC<TokenCompletionPageProps> = ({
  mintAddress,
  tokenName,
  tokenSymbol,
  tokenImage,
  tokenSupply = "1000000000",
  tokenDecimals = "9",
  onCreateAnother,
}) => {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  // Save token data to localStorage when component mounts
  useEffect(() => {
    if (mintAddress && tokenName && tokenSymbol) {
      saveToken({
        id: uuidv4(),
        name: tokenName,
        symbol: tokenSymbol,
        mintAddress: mintAddress,
        image: tokenImage,
        createdAt: new Date().toISOString(),
        supply: tokenSupply,
        decimals: tokenDecimals,
      })
    }
  }, [mintAddress, tokenName, tokenSymbol, tokenImage, tokenSupply, tokenDecimals])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mintAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const viewOnSolscan = () => {
    window.open(`https://solscan.io/token/${mintAddress}`, "_blank")
  }

  const openRaydiumLiquidity = () => {
    window.open(`https://raydium.io/liquidity/create-pool/`, "_blank")
  }

  const openRaydiumPortfolio = () => {
    window.open(`https://raydium.io/portfolio/?position_tab=standard`, "_blank")
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
      <ModernCard className="w-full p-6 text-center" variant="gradient">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Token Created Successfully!</h2>
        <p className="text-white/80 mb-6">
          Your token <span className="text-amber-400 font-semibold">{tokenName}</span> ({tokenSymbol}) has been created
          on the Solana blockchain.
        </p>

        {/* Display token image if available */}
        {tokenImage && (
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 overflow-hidden rounded-full border-4 border-amber-500/30 shadow-lg shadow-amber-500/20">
              <ImageDisplay
                src={tokenImage || "/placeholder.svg"}
                alt={`${tokenName} Token`}
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
          </div>
        )}

        <div className="bg-black/30 rounded-lg p-4 mb-6 border border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-3 sm:mb-0">
              <p className="text-sm text-white/60 mb-1">Token Address:</p>
              <p className="font-mono text-amber-400 text-sm break-all">{mintAddress}</p>
            </div>
            <div className="flex space-x-2">
              <ModernButton onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? "Copied!" : "Copy Address"}
              </ModernButton>
              <ModernButton onClick={viewOnSolscan} variant="outline" size="sm">
                View on Solscan
              </ModernButton>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Next Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
              <h4 className="font-medium text-amber-400 mb-2">Add to Wallet</h4>
              <p className="text-sm text-white/70 mb-3">
                Add your token to Phantom, Solflare, or other Solana wallets using the token address.
              </p>
            </div>
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
              <h4 className="font-medium text-amber-400 mb-2">Create Liquidity</h4>
              <p className="text-sm text-white/70 mb-3">Add liquidity on Raydium to make your token tradable.</p>
              <ModernButton onClick={openRaydiumLiquidity} size="sm" variant="outline" className="w-full">
                Raydium Liquidity
              </ModernButton>
            </div>
          </div>

          <div className="mt-4 bg-black/20 p-4 rounded-lg border border-white/10 w-full">
            <h4 className="font-medium text-amber-400 mb-2">Manage Your Positions</h4>
            <p className="text-sm text-white/70 mb-3">Track and manage your liquidity positions and token holdings.</p>
            <ModernButton onClick={openRaydiumPortfolio} size="sm" variant="outline" className="w-full">
              Raydium Portfolio
            </ModernButton>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <ModernButton onClick={onCreateAnother} size="lg">
            Create Another Token
          </ModernButton>
          <Link href="/completed-tokens">
            <ModernButton variant="outline" size="lg">
              View All My Tokens
            </ModernButton>
          </Link>
        </div>
      </ModernCard>
    </div>
  )
}

export default TokenCompletionPage
