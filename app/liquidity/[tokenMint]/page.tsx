"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import SiteLayout from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useTokenForm } from "@/context/token-form-context"

export default function LiquidityPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const tokenMint = params.tokenMint as string
  const tokenName = searchParams.get("name") || "Token"
  const tokenSymbol = searchParams.get("symbol") || "TKN"
  const { walletConnected } = useTokenForm()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simple validation to check if the tokenMint looks like a valid Solana address
    if (tokenMint && tokenMint.length >= 32 && tokenMint.length <= 44) {
      setIsLoading(false)
    }
  }, [tokenMint])

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Loading Liquidity Manager...</h2>
            <p className="text-gray-700 dark:text-gray-300">Please wait while we load your token information.</p>
          </div>
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout>
      <div className="mb-6">
        <Link href="/create">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Token Creator
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">Liquidity Manager</h1>
        <p className="text-gray-700 dark:text-gray-300 mt-2 text-xl font-medium">
          Manage liquidity for your {tokenName} ({tokenSymbol}) token
        </p>
      </div>

      <div className="mt-8 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">External Liquidity Management</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          You can manage your token's liquidity directly on Raydium's official interfaces:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={`https://raydium.io/liquidity/create-pool/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
          >
            <span className="mr-2">Create Liquidity Pool on Raydium</span>
            <ExternalLink size={16} />
          </a>

          <a
            href={`https://raydium.io/portfolio/?position_tab=standard`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
          >
            <span className="mr-2">Manage Liquidity on Raydium Portfolio</span>
            <ExternalLink size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <a
            href={`https://dexscreener.com/?rankBy=pairAge&order=asc`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
          >
            <span className="mr-2">View New Pairs on DexScreener</span>
            <ExternalLink size={16} />
          </a>

          <a
            href={`https://solscan.io/token/${tokenMint}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300"
          >
            <span className="mr-2">View Token on Solscan</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Token Information</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Token Name:</p>
            <p className="text-gray-900 dark:text-white font-medium">{tokenName}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Token Symbol:</p>
            <p className="text-gray-900 dark:text-white font-medium">{tokenSymbol}</p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Token Address:</p>
            <p className="text-gray-900 dark:text-white font-mono text-sm break-all">{tokenMint}</p>
          </div>
          <div className="pt-4">
            <a
              href={`https://dexscreener.com/solana/${tokenMint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span className="mr-2">View your token on DexScreener</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
