"use client"

import { motion } from "framer-motion"
import { Copy, ExternalLink, Check, Share2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import ModernButton from "./modern-button"

interface TokenCompletionPageProps {
  mintAddress: string
  tokenName: string
  tokenSymbol: string
  onCreateAnother?: () => void
}

export default function TokenCompletionPage({
  mintAddress,
  tokenName,
  tokenSymbol,
  onCreateAnother,
}: TokenCompletionPageProps) {
  const [copied, setCopied] = useState(false)

  // Add animation for entrance
  useEffect(() => {
    // Clean up confetti after 5 seconds
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mintAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Achievement Banner */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-r from-amber-900/80 via-amber-800/80 to-amber-900/80 rounded-xl border border-amber-500/50 shadow-lg shadow-amber-500/20 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: "url('/digital-flow.png')",
              backgroundSize: "cover",
            }}
          />

          {/* Animated light rays */}
          <div className="absolute inset-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-full w-[30px] bg-gradient-to-b from-amber-500/0 via-amber-400/10 to-amber-500/0"
                style={{ left: `${i * 20}%` }}
                animate={{ x: ["-100%", "400%"] }}
                transition={{
                  duration: 7,
                  delay: i * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 px-8 py-12 text-center">
          {/* Success Icon */}
          <motion.div
            className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Token Created Successfully!
          </motion.h1>

          <motion.div
            className="text-xl text-white/90 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Your token <span className="font-bold text-amber-300">{tokenName}</span> (
            <span className="text-amber-300">{tokenSymbol}</span>) is now live on the Solana blockchain
          </motion.div>

          {/* Token Address */}
          <motion.div
            className="bg-black/30 rounded-lg border border-amber-500/30 p-4 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-amber-300 font-medium">Token Address:</span>
              <button
                onClick={copyToClipboard}
                className="flex items-center text-white/80 hover:text-white bg-amber-800/50 hover:bg-amber-700/50 px-3 py-1 rounded-md transition-all duration-300"
              >
                {copied ? <Check size={16} className="mr-1 text-green-400" /> : <Copy size={16} className="mr-1" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="font-mono text-sm break-all bg-black/40 p-3 rounded text-amber-100 border border-amber-500/20">
              {mintAddress}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Explore */}
        <motion.div
          className="bg-gradient-to-b from-amber-900/60 to-black/60 rounded-xl border border-amber-500/30 p-6 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center">
            <ExternalLink className="mr-2" size={20} />
            Explore Your Token
          </h2>

          <div className="space-y-4">
            <p className="text-white/80 mb-4">View your token on these blockchain explorers:</p>

            <div className="space-y-3">
              <a
                href={`https://solscan.io/token/${mintAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/40 to-amber-800/40 hover:from-amber-800/40 hover:to-amber-700/40 border border-amber-500/30 rounded-lg transition-all duration-300 group"
              >
                <div>
                  <span className="font-medium text-amber-300 group-hover:text-amber-200">Solscan</span>
                  <p className="text-xs text-white/60">Detailed token information and transactions</p>
                </div>
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <ExternalLink size={16} className="text-amber-300" />
                </div>
              </a>

              <a
                href={`https://explorer.solana.com/address/${mintAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/40 to-amber-800/40 hover:from-amber-800/40 hover:to-amber-700/40 border border-amber-500/30 rounded-lg transition-all duration-300 group"
              >
                <div>
                  <span className="font-medium text-amber-300 group-hover:text-amber-200">Solana Explorer</span>
                  <p className="text-xs text-white/60">Official Solana blockchain explorer</p>
                </div>
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <ExternalLink size={16} className="text-amber-300" />
                </div>
              </a>

              <a
                href={`https://dexscreener.com/solana/${mintAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/40 to-amber-800/40 hover:from-amber-800/40 hover:to-amber-700/40 border border-amber-500/30 rounded-lg transition-all duration-300 group"
              >
                <div>
                  <span className="font-medium text-amber-300 group-hover:text-amber-200">DexScreener</span>
                  <p className="text-xs text-white/60">Track price and trading activity</p>
                </div>
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <ExternalLink size={16} className="text-amber-300" />
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Next Steps */}
        <motion.div
          className="bg-gradient-to-b from-amber-900/60 to-black/60 rounded-xl border border-amber-500/30 p-6 shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-amber-400 mb-4">Next Steps</h2>

          <div className="space-y-4">
            <p className="text-white/80 mb-4">Make your token tradable by adding liquidity:</p>

            <div className="space-y-3">
              <a
                href="https://raydium.io/liquidity/create-pool/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/40 to-amber-800/40 hover:from-amber-800/40 hover:to-amber-700/40 border border-amber-500/30 rounded-lg transition-all duration-300 group"
              >
                <div>
                  <span className="font-medium text-amber-300 group-hover:text-amber-200">Create Liquidity Pool</span>
                  <p className="text-xs text-white/60">Pair your token with SOL to enable trading</p>
                </div>
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <ExternalLink size={16} className="text-amber-300" />
                </div>
              </a>

              <a
                href="https://raydium.io/portfolio/?position_tab=standard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/40 to-amber-800/40 hover:from-amber-800/40 hover:to-amber-700/40 border border-amber-500/30 rounded-lg transition-all duration-300 group"
              >
                <div>
                  <span className="font-medium text-amber-300 group-hover:text-amber-200">Manage Liquidity</span>
                  <p className="text-xs text-white/60">View and manage your liquidity positions</p>
                </div>
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <ExternalLink size={16} className="text-amber-300" />
                </div>
              </a>

              <button
                onClick={() => {
                  // Create a shareable URL
                  const shareText = `Check out my new Solana token: ${tokenName} (${tokenSymbol})! ${window.location.origin}/token/${mintAddress}`

                  // Try to use the Web Share API if available
                  if (navigator.share) {
                    navigator
                      .share({
                        title: `${tokenName} Token`,
                        text: shareText,
                        url: `${window.location.origin}/token/${mintAddress}`,
                      })
                      .catch((err) => {
                        console.error("Error sharing:", err)
                      })
                  } else {
                    // Fallback to copying to clipboard
                    navigator.clipboard.writeText(shareText)
                    alert("Share text copied to clipboard!")
                  }
                }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-900/40 to-amber-800/40 hover:from-amber-800/40 hover:to-amber-700/40 border border-amber-500/30 rounded-lg transition-all duration-300 group"
              >
                <div>
                  <span className="font-medium text-amber-300 group-hover:text-amber-200">Share Your Token</span>
                  <p className="text-xs text-white/60">Let others know about your new token</p>
                </div>
                <div className="bg-amber-500/20 p-2 rounded-full">
                  <Share2 size={16} className="text-amber-300" />
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Actions */}
      <motion.div
        className="mt-8 flex flex-col md:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <ModernButton
          onClick={onCreateAnother}
          size="lg"
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
        >
          Create Another Token
        </ModernButton>

        <Link href="/home">
          <ModernButton
            variant="outline"
            size="lg"
            className="px-8 py-4 border-amber-500 text-amber-400 hover:bg-amber-500/10"
          >
            Back to Home
          </ModernButton>
        </Link>
      </motion.div>
    </div>
  )
}
