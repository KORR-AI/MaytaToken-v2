"use client"

import { motion } from "framer-motion"
import { Copy, ExternalLink, Check } from "lucide-react"
import { useState } from "react"
import ModernButton from "./modern-button"

interface TokenSuccessMessageProps {
  mintAddress: string
  tokenName: string
  tokenSymbol: string
}

export default function TokenSuccessMessage({ mintAddress, tokenName, tokenSymbol }: TokenSuccessMessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mintAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="bg-gradient-to-b from-black/80 to-gray-900/60 border border-amber-500/30 rounded-xl p-6 shadow-lg shadow-amber-500/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-2">
          Token Created Successfully!
        </h2>
        <p className="text-white/80">
          Your token <span className="text-amber-400 font-medium">{tokenName}</span> ({tokenSymbol}) has been created on
          the Solana blockchain.
        </p>
      </motion.div>

      {/* Token Address Section */}
      <motion.div
        className="bg-black/40 border border-amber-500/30 rounded-lg p-4 mb-6 relative overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-medium text-amber-400">Token Address</h3>
          <button
            onClick={copyToClipboard}
            className="flex items-center text-white/70 hover:text-white bg-black/30 hover:bg-black/50 px-3 py-1 rounded-md transition-all duration-300"
          >
            {copied ? <Check size={16} className="mr-1 text-green-400" /> : <Copy size={16} className="mr-1" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="font-mono text-sm break-all bg-black/30 p-3 rounded border border-white/10 text-white/90">
          {mintAddress}
        </div>

        {/* Animated scan line */}
        <motion.div
          className="absolute h-px w-full bg-amber-400/50 blur-[1px] left-0"
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </motion.div>

      {/* External Links Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <a
          href={`https://solscan.io/token/${mintAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 shadow-lg shadow-blue-700/20"
        >
          <span className="mr-2 font-medium">View on Solscan</span>
          <ExternalLink size={16} />
        </a>

        <a
          href={`https://dexscreener.com/solana/${mintAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 shadow-lg shadow-green-700/20"
        >
          <span className="mr-2 font-medium">View on DexScreener</span>
          <ExternalLink size={16} />
        </a>
      </motion.div>

      {/* Liquidity Management Section */}
      <motion.div
        className="bg-black/40 border border-amber-500/30 rounded-lg p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="text-xl font-medium text-amber-400 mb-4">Liquidity Management</h3>
        <p className="text-white/80 mb-4">To make your token tradable, you need to add liquidity on Raydium.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://raydium.io/liquidity/create-pool/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300 shadow-lg shadow-purple-700/20"
          >
            <span className="mr-2 font-medium">Create Liquidity Pool</span>
            <ExternalLink size={16} />
          </a>

          <a
            href="https://raydium.io/portfolio/?position_tab=standard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-lg transition-all duration-300 shadow-lg shadow-pink-700/20"
          >
            <span className="mr-2 font-medium">Manage Liquidity</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <ModernButton onClick={() => (window.location.href = "/create")} size="lg" className="px-8 py-3">
          Create Another Token
        </ModernButton>
      </motion.div>
    </motion.div>
  )
}
