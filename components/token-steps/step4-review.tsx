"use client"

import { useTokenForm } from "@/context/token-form-context"
import { useFormStep } from "@/context/form-step-context"
import ModernButton from "../modern-button"
import ModernCard from "../modern-card"
import ImageDisplay from "../image-display"
import { Check, AlertCircle, X } from "lucide-react"
// Import the GlowingBalance component
import GlowingBalance from "../glowing-balance"
// Add the import for FeeCalculator
import FeeCalculator from "../fee-calculator"
// Add imports at the top of the file
import TokenProcessingScreen from "../token-processing-screen"
import TokenCompletionPage from "../token-completion-page" // Import the new component

export default function Step4Review() {
  const {
    formState,
    handleSubmit,
    imagePreview,
    balance,
    walletConnected,
    creatingToken,
    error,
    cooldownActive,
    cooldownTimeLeft,
    serviceUnavailable,
    formatCooldownTime,
    isRateLimited,
    progress,
    transactionStatus,
    success,
    mintAddress,
  } = useTokenForm()
  const { prevStep } = useFormStep()

  // If token creation is successful, show the completion page
  if (success && mintAddress) {
    return (
      <TokenCompletionPage
        mintAddress={mintAddress}
        tokenName={formState.tokenName}
        tokenSymbol={formState.symbol}
        tokenImage={imagePreview}
        tokenSupply={formState.supply}
        tokenDecimals={formState.decimals}
        onCreateAnother={() => window.location.reload()}
      />
    )
  }

  // Find the section where we handle the creatingToken state
  // and add this code before the return statement:
  if (creatingToken) {
    return (
      <TokenProcessingScreen progress={progress} status={transactionStatus} onCancel={() => window.location.reload()} />
    )
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <ModernCard className="p-8" variant="gradient">
        <h2 className="text-2xl font-bold text-amber-400 mb-8 text-center">Review & Create Token</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-medium text-amber-400 mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-white/60">Token Name:</span>
                <p className="text-white font-medium">{formState.tokenName}</p>
              </div>
              <div>
                <span className="text-white/60">Symbol:</span>
                <p className="text-white font-medium">{formState.symbol}</p>
              </div>
              <div>
                <span className="text-white/60">Decimals:</span>
                <p className="text-white font-medium">{formState.decimals}</p>
              </div>
              <div>
                <span className="text-white/60">Total Supply:</span>
                <p className="text-white font-medium">{formState.supply}</p>
              </div>
            </div>

            <h3 className="text-xl font-medium text-amber-400 mt-6 mb-4">Authorities</h3>
            {formState.enableAuthorities ? (
              <div className="space-y-2">
                <div className="flex items-center">
                  {formState.mintAuthority ? (
                    <Check className="text-green-400 mr-2" size={18} />
                  ) : (
                    <X className="text-gray-400 mr-2" size={18} />
                  )}
                  <span className={formState.mintAuthority ? "text-white" : "text-white/60"}>Mint Authority</span>
                </div>
                <div className="flex items-center">
                  {formState.freezeAuthority ? (
                    <Check className="text-green-400 mr-2" size={18} />
                  ) : (
                    <X className="text-gray-400 mr-2" size={18} />
                  )}
                  <span className={formState.freezeAuthority ? "text-white" : "text-white/60"}>Freeze Authority</span>
                </div>
                <div className="flex items-center">
                  {formState.transferFeeAuthority ? (
                    <Check className="text-green-400 mr-2" size={18} />
                  ) : (
                    <X className="text-gray-400 mr-2" size={18} />
                  )}
                  <span className={formState.transferFeeAuthority ? "text-white" : "text-white/60"}>
                    Transfer Fee Authority
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-white/60">Authorities not enabled</p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-medium text-amber-400 mb-4">Token Image</h3>
            {imagePreview ? (
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40 overflow-hidden rounded-full border border-white/20">
                  <ImageDisplay
                    src={imagePreview || "/placeholder.svg"}
                    alt="Token Preview"
                    width={160}
                    height={160}
                    className="rounded-full max-h-40 mx-auto z-10 relative"
                  />
                </div>
              </div>
            ) : (
              <p className="text-white/60 mb-6">No image uploaded</p>
            )}

            <h3 className="text-xl font-medium text-amber-400 mb-4">Creator Information</h3>
            {formState.enableCreatorInfo ? (
              <div className="space-y-3">
                <div>
                  <span className="text-white/60">Creator Name:</span>
                  <p className="text-white font-medium">{formState.creatorName || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-white/60">Site Name:</span>
                  <p className="text-white font-medium">{formState.siteName || "Not specified"}</p>
                </div>
              </div>
            ) : (
              <p className="text-white/60">Creator information not enabled</p>
            )}

            <h3 className="text-xl font-medium text-amber-400 mt-6 mb-4">Social Links</h3>
            {formState.enableSocialLinks ? (
              <div className="space-y-2">
                <div>
                  <span className="text-white/60">Twitter:</span>
                  <p className="text-white font-medium">{formState.socials?.twitter || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-white/60">Discord:</span>
                  <p className="text-white font-medium">{formState.socials?.discord || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-white/60">Telegram:</span>
                  <p className="text-white font-medium">{formState.socials?.telegram || "Not specified"}</p>
                </div>
              </div>
            ) : (
              <p className="text-white/60">Social links not enabled</p>
            )}
          </div>
        </div>

        {/* Replace the fee information section with our new FeeCalculator */}
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-amber-400 mb-2">Fee Information</h3>
          <p className="text-white/80">
            Token creation requires a base fee of 0.1 SOL, with additional features charged at 0.1 SOL each.
          </p>

          <FeeCalculator className="mt-4" />

          <div className="text-white/80 mt-4">
            Your wallet balance:{" "}
            {balance !== null ? (
              <GlowingBalance balance={balance} size="sm" className="inline-flex" />
            ) : (
              <span className="text-white/60">Unknown</span>
            )}
          </div>
          {balance !== null && balance < 0.0025 && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-red-400" />
                <div>
                  <h3 className="font-bold mb-1">Insufficient Balance Warning</h3>
                  <p>
                    Your current balance of {balance.toFixed(5)} SOL is too low to complete this transaction. You need
                    at least 0.0025 SOL to create a token. Please add more SOL to your wallet before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-red-400" />
              <div className="text-red-200">{error}</div>
            </div>
          </div>
        )}
      </ModernCard>

      <div className="flex justify-between">
        <ModernButton onClick={prevStep} variant="outline" size="lg" className="px-10 py-4 text-lg">
          Previous
        </ModernButton>
        <ModernButton
          onClick={handleSubmit}
          size="lg"
          className="px-10 py-4 text-lg"
          disabled={creatingToken || !walletConnected || isRateLimited || cooldownActive || serviceUnavailable}
          loading={creatingToken}
        >
          {creatingToken
            ? "Creating Token..."
            : serviceUnavailable
              ? `Service Unavailable (${formatCooldownTime(cooldownTimeLeft)})`
              : cooldownActive
                ? `Cooldown Active (${formatCooldownTime(cooldownTimeLeft)})`
                : isRateLimited
                  ? "Rate Limited - Please Wait"
                  : walletConnected
                    ? "Create Token"
                    : "Connect Wallet to Create Token"}
        </ModernButton>
      </div>
    </div>
  )
}
