"use client"

import { useTokenForm } from "@/context/token-form-context"
import { motion } from "framer-motion"

interface FeeCalculatorProps {
  className?: string
}

export default function FeeCalculator({ className = "" }: FeeCalculatorProps) {
  const { formState } = useTokenForm()

  // Calculate fees for each component
  const baseFee = 0.1
  const creatorInfoFee = formState.enableCreatorInfo ? 0.1 : 0

  // Calculate authority fees - 0.1 SOL for each selected authority
  const mintAuthorityFee = formState.mintAuthority ? 0.1 : 0
  const freezeAuthorityFee = formState.freezeAuthority ? 0.1 : 0
  const transferFeeAuthorityFee = formState.transferFeeAuthority ? 0.1 : 0

  const socialLinksFee = formState.enableSocialLinks ? 0.1 : 0

  // Calculate total fee
  const totalFee =
    baseFee + creatorInfoFee + mintAuthorityFee + freezeAuthorityFee + transferFeeAuthorityFee + socialLinksFee

  // Transaction fee is negligible but we'll show it for transparency
  const transactionFee = 0.000005

  return (
    <div className={`bg-gray-900/60 border border-amber-500/30 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium text-amber-400 mb-3">Fee Calculator</h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">Base token creation:</span>
          <span className="text-white font-mono">0.1 SOL</span>
        </div>

        {formState.enableCreatorInfo && (
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Creator information:</span>
            <span className="text-white font-mono">+0.1 SOL</span>
          </div>
        )}

        {formState.mintAuthority && (
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Mint authority:</span>
            <span className="text-white font-mono">+0.1 SOL</span>
          </div>
        )}

        {formState.freezeAuthority && (
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Freeze authority:</span>
            <span className="text-white font-mono">+0.1 SOL</span>
          </div>
        )}

        {formState.transferFeeAuthority && (
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Transfer fee authority:</span>
            <span className="text-white font-mono">+0.1 SOL</span>
          </div>
        )}

        {formState.enableSocialLinks && (
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Social links:</span>
            <span className="text-white font-mono">+0.1 SOL</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-white/70">Transaction fee:</span>
          <span className="text-white font-mono">~0.000005 SOL</span>
        </div>

        <div className="border-t border-amber-500/30 pt-2 mt-2">
          <div className="flex justify-between font-medium">
            <span className="text-white">Total fee:</span>
            <motion.span
              className="text-amber-400 font-mono"
              key={totalFee}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {totalFee.toFixed(6)} SOL
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  )
}
