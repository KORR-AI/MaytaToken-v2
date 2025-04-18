"use client"

import { useState, useEffect } from "react"
import SiteLayout from "@/components/site-layout"
import ModernCard from "@/components/modern-card"
import ModernButton from "@/components/modern-button"
import ImageDisplay from "@/components/image-display"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Copy, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { getAllTokens, type StoredToken } from "@/lib/token-storage"

export default function CompletedTokensPage() {
  const [currentView, setCurrentView] = useState<"carousel" | "ledger">("carousel")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [tokens, setTokens] = useState<StoredToken[]>([])
  const [loading, setLoading] = useState(true)

  // Load tokens from localStorage when component mounts
  useEffect(() => {
    setLoading(true)
    const storedTokens = getAllTokens()
    setTokens(storedTokens)
    setLoading(false)
  }, [])

  // Function to copy token address to clipboard
  const copyToClipboard = async (address: string, id: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  // Function to view token on Solscan
  const viewOnSolscan = (address: string) => {
    window.open(`https://solscan.io/token/${address}`, "_blank")
  }

  // Function to navigate carousel
  const navigateCarousel = (direction: "next" | "prev") => {
    if (tokens.length === 0) return

    if (direction === "next") {
      setCurrentIndex((prev) => (prev === tokens.length - 1 ? 0 : prev + 1))
    } else {
      setCurrentIndex((prev) => (prev === 0 ? tokens.length - 1 : prev - 1))
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format large numbers with commas
  const formatNumber = (numStr: string) => {
    try {
      return Number(numStr).toLocaleString()
    } catch (e) {
      return numStr
    }
  }

  return (
    <SiteLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/create">
            <ModernButton variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Token Creator
            </ModernButton>
          </Link>
          <div className="flex gap-2">
            <ModernButton
              variant={currentView === "carousel" ? "primary" : "outline"}
              size="sm"
              onClick={() => setCurrentView("carousel")}
            >
              Carousel View
            </ModernButton>
            <ModernButton
              variant={currentView === "ledger" ? "primary" : "outline"}
              size="sm"
              onClick={() => setCurrentView("ledger")}
            >
              Ledger View
            </ModernButton>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Your Created Tokens</h1>
          <p className="text-white/80 mt-2 text-xl">View and manage all your created tokens</p>
        </div>

        {loading ? (
          <ModernCard className="p-6 text-center" variant="gradient">
            <div className="py-12">
              <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white/80">Loading your tokens...</p>
            </div>
          </ModernCard>
        ) : tokens.length === 0 ? (
          <ModernCard className="p-6 text-center" variant="gradient">
            <div className="py-12 flex flex-col items-center">
              <AlertCircle className="w-16 h-16 text-amber-500/50 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No Tokens Found</h2>
              <p className="text-white/80 mb-6">You haven't created any tokens yet.</p>
              <Link href="/create">
                <ModernButton size="lg">Create Your First Token</ModernButton>
              </Link>
            </div>
          </ModernCard>
        ) : currentView === "carousel" ? (
          <div className="relative">
            <ModernCard className="p-6" variant="gradient">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => navigateCarousel("prev")}
                  className="bg-black/30 hover:bg-black/50 p-2 rounded-full text-white/80 hover:text-white transition-all"
                  disabled={tokens.length <= 1}
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="text-center">
                  <span className="text-amber-400">
                    {tokens.length > 0 ? `${currentIndex + 1} of ${tokens.length}` : "No tokens"}
                  </span>
                </div>
                <button
                  onClick={() => navigateCarousel("next")}
                  className="bg-black/30 hover:bg-black/50 p-2 rounded-full text-white/80 hover:text-white transition-all"
                  disabled={tokens.length <= 1}
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {tokens.length > 0 && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col md:flex-row gap-8 items-center"
                >
                  <div className="w-40 h-40 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
                    <ImageDisplay
                      src={tokens[currentIndex].image || "/placeholder.svg"}
                      alt={tokens[currentIndex].name}
                      width={160}
                      height={160}
                      className="rounded-full border-4 border-amber-500/30"
                    />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-white">
                        {tokens[currentIndex].name}{" "}
                        <span className="text-amber-400">({tokens[currentIndex].symbol})</span>
                      </h2>
                      <p className="text-white/60 text-sm">Created on {formatDate(tokens[currentIndex].createdAt)}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-white/60 text-sm">Token Address:</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-amber-400 text-sm break-all">
                            {tokens[currentIndex].mintAddress}
                          </p>
                          <button
                            onClick={() => copyToClipboard(tokens[currentIndex].mintAddress, tokens[currentIndex].id)}
                            className="text-white/60 hover:text-white"
                          >
                            {copied === tokens[currentIndex].id ? (
                              <span className="text-green-400 text-xs">Copied!</span>
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-white/60 text-sm">Total Supply:</p>
                        <p className="text-white font-medium">{formatNumber(tokens[currentIndex].supply)}</p>
                      </div>

                      <div>
                        <p className="text-white/60 text-sm">Decimals:</p>
                        <p className="text-white font-medium">{tokens[currentIndex].decimals}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <ModernButton
                        onClick={() => viewOnSolscan(tokens[currentIndex].mintAddress)}
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        View on Solscan <ExternalLink size={14} />
                      </ModernButton>
                      <ModernButton
                        onClick={() => window.open(`https://raydium.io/liquidity/create-pool/`, "_blank")}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        Add Liquidity <ExternalLink size={14} />
                      </ModernButton>
                      <ModernButton
                        onClick={() =>
                          window.open(`https://dexscreener.com/solana/${tokens[currentIndex].mintAddress}`, "_blank")
                        }
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        DexScreener <ExternalLink size={14} />
                      </ModernButton>
                    </div>
                  </div>
                </motion.div>
              )}
            </ModernCard>
          </div>
        ) : (
          <div className="space-y-4">
            {tokens.map((token) => (
              <ModernCard key={token.id} className="p-4" variant="gradient">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20">
                    <ImageDisplay
                      src={token.image || "/placeholder.svg"}
                      alt={token.name}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-amber-500/30"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold text-white">
                      {token.name} <span className="text-amber-400">({token.symbol})</span>
                    </h3>
                    <p className="text-white/60 text-xs">Created on {formatDate(token.createdAt)}</p>
                    <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                      <p className="font-mono text-amber-400 text-xs">
                        {token.mintAddress.slice(0, 8)}...{token.mintAddress.slice(-8)}
                      </p>
                      <button
                        onClick={() => copyToClipboard(token.mintAddress, token.id)}
                        className="text-white/60 hover:text-white"
                      >
                        {copied === token.id ? (
                          <span className="text-green-400 text-xs">Copied!</span>
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                    <ModernButton
                      onClick={() => viewOnSolscan(token.mintAddress)}
                      size="sm"
                      variant="outline"
                      className="text-xs px-2 py-1 h-8"
                    >
                      Solscan
                    </ModernButton>
                    <ModernButton
                      onClick={() => window.open(`https://raydium.io/liquidity/create-pool/`, "_blank")}
                      size="sm"
                      variant="outline"
                      className="text-xs px-2 py-1 h-8"
                    >
                      Liquidity
                    </ModernButton>
                    <ModernButton
                      onClick={() => window.open(`https://dexscreener.com/solana/${token.mintAddress}`, "_blank")}
                      size="sm"
                      variant="outline"
                      className="text-xs px-2 py-1 h-8"
                    >
                      DexScreener
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-white/60 mb-4">Want to create more tokens?</p>
          <Link href="/create">
            <ModernButton size="lg">Create New Token</ModernButton>
          </Link>
        </div>
      </div>
    </SiteLayout>
  )
}
