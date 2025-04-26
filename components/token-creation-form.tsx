"use client"

import React from "react"
import { useRouter } from "next/navigation"

import { useTokenForm } from "@/context/token-form-context"
import ImageDisplay from "./image-display"
import { AlertCircle, Clock, RefreshCw } from "lucide-react"
import ModernButton from "./modern-button"
import ModernCard from "./modern-card"
import { useEffect } from "react"

// Import the GlowingBalance component
import GlowingBalance from "./glowing-balance"
import StyledFileInput from "./styled-file-input"
// Add the import for FeeCalculator
import FeeCalculator from "./fee-calculator"

// Add the imports at the top of the file
import TokenProcessingScreen from "./token-processing-screen"
import TokenCompletionPage from "./token-completion-page" // Import the new component

const TokenCreationForm = () => {
  const {
    formState,
    imagePreview,
    uploadingImage,
    creatingToken,
    transactionStatus,
    mintAddress,
    signature,
    metadataUrl,
    error,
    success,
    balance,
    fetchingBalance,
    walletConnected,
    balanceError,
    feeWarning,
    isRateLimited,
    isQueued,
    retryCount,
    cooldownActive,
    cooldownTimeLeft,
    serviceUnavailable,
    progress,
    connectWallet,
    disconnectWallet,
    fetchBalance,
    handleChange,
    handleImageUpload,
    handleSubmit,
    formatCooldownTime,
    setSuccess,
    setFormState,
    setImagePreview,
    setMintAddress,
    setSignature,
    setMetadataUrl,
    setError,
    setTransactionStatus,
    setProgress,
  } = useTokenForm()

  const router = useRouter()

  // Removed the confetti effect useEffect hook completely

  // Add back the useEffect hook for metadata functionality but without the confetti
  useEffect(() => {
    if (success && mintAddress) {
      // The confetti effect was here, but we've removed it
      // Keep any metadata-related functionality that might have been here
      // If there was any metadata functionality in the original useEffect,
      // it would be preserved here
    }
  }, [success, mintAddress])

  // If token creation is successful, show the completion page
  if (success && mintAddress) {
    return (
      <TokenCompletionPage
        mintAddress={mintAddress}
        tokenName={formState.tokenName}
        tokenSymbol={formState.symbol}
        tokenImage={imagePreview} // Pass the imagePreview as tokenImage
        onCreateAnother={() => window.location.reload()}
      />
    )
  }

  return (
    <>
      {error && (
        <ModernCard className="mb-6 border border-red-500/50 bg-red-900/20">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-red-400" />
            <div className="text-red-200">{error}</div>
          </div>
        </ModernCard>
      )}

      {serviceUnavailable && (
        <ModernCard className="mb-6 border border-red-500/50 bg-red-900/20">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-red-400" />
            <div>
              <h3 className="font-bold mb-1 text-red-200">Service Temporarily Unavailable</h3>
              <p className="text-red-200/80">
                Due to high traffic and rate limiting, the service is temporarily unavailable. Please wait{" "}
                {formatCooldownTime(cooldownTimeLeft)} before trying again.
              </p>
              <p className="mt-2 text-red-200/80">
                <strong>Note:</strong> This is a limitation of the free tier RPC provider.
              </p>
            </div>
          </div>
        </ModernCard>
      )}

      {cooldownActive && !serviceUnavailable && (
        <ModernCard className="mb-6 border border-orange-500/50 bg-orange-900/20">
          <div className="flex items-start">
            <Clock className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-orange-400" />
            <div>
              <h3 className="font-bold mb-1 text-orange-200">Cooldown Period Active</h3>
              <p className="text-orange-200/80">
                Due to rate limiting, token creation is temporarily disabled. Please wait{" "}
                {formatCooldownTime(cooldownTimeLeft)} before trying again.
              </p>
            </div>
          </div>
        </ModernCard>
      )}

      {isRateLimited && !serviceUnavailable && !cooldownActive && (
        <ModernCard className="mb-6 border border-yellow-500/50 bg-yellow-900/20">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-yellow-400" />
            <div>
              <h3 className="font-bold mb-1 text-yellow-200">Rate Limit Detected</h3>
              <p className="text-yellow-200/80">
                The free tier has limited requests per second. The application will automatically retry with exponential
                backoff (up to 10 minutes between retries).
              </p>
              {retryCount > 0 && (
                <p className="mt-2 text-yellow-200/80">
                  Currently on retry {retryCount}. Please be patient or try again later when there is less traffic.
                </p>
              )}
              <p className="mt-2 text-yellow-200/80">
                <strong>Recommendation:</strong> Wait at least 15 minutes before trying again if the operation fails.
              </p>
            </div>
          </div>
        </ModernCard>
      )}

      {isQueued && (
        <ModernCard className="mb-6 border border-blue-500/50 bg-blue-900/20">
          <div className="flex items-start">
            <RefreshCw className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 animate-spin text-blue-400" />
            <div>
              <h3 className="font-bold mb-1 text-blue-200">Request Queued</h3>
              <p className="text-blue-200/80">
                Your token creation request has been queued to avoid rate limits. It will be processed as soon as the
                current operation completes. Please be patient and do not refresh the page.
              </p>
            </div>
          </div>
        </ModernCard>
      )}

      {creatingToken && (
        <TokenProcessingScreen
          progress={progress}
          status={transactionStatus}
          onCancel={() => window.location.reload()}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          {/* Wallet Connection Status */}
          <ModernCard className="p-4" variant="gradient">
            <h3 className="text-lg font-medium text-amber-400 mb-3">Wallet Status</h3>
            {walletConnected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <p className="text-green-400">Connected</p>
                </div>
                <ModernButton onClick={disconnectWallet} variant="outline" size="sm">
                  Disconnect
                </ModernButton>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <p className="text-red-400">Not Connected</p>
                </div>
                <ModernButton
                  onClick={connectWallet}
                  size="md"
                  disabled={cooldownActive || serviceUnavailable}
                  className="mb-3"
                >
                  Connect Wallet
                </ModernButton>

                {/* Wallet Installation Guide */}
                <div className="text-xs text-white/80 p-3 bg-black/30 border border-white/10 rounded-lg mt-2">
                  <p className="font-bold text-amber-400">No wallet detected?</p>
                  <p className="mt-1">
                    You need a Solana wallet extension to use this app. We recommend Phantom Wallet.
                  </p>
                  <a
                    href="https://phantom.app/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-400 hover:text-blue-300 underline"
                  >
                    Download Phantom Wallet
                  </a>
                  <p className="mt-2 text-white/60">After installing, refresh this page and try connecting again.</p>
                </div>
              </div>
            )}
          </ModernCard>

          {/* Wallet Balance Display */}
          <ModernCard className="p-4" variant="gradient">
            <h3 className="text-lg font-medium text-amber-400 mb-3">Wallet Balance</h3>
            {balance !== null ? (
              <div>
                <div className="flex items-baseline">
                  <GlowingBalance balance={balance} size="lg" className="mr-2" />
                  <button
                    onClick={fetchBalance}
                    className="ml-3 text-xs bg-black/30 hover:bg-black/50 text-white py-1 px-2 h-auto rounded-md border border-white/10"
                    disabled={fetchingBalance || isRateLimited || cooldownActive || serviceUnavailable}
                  >
                    {fetchingBalance ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
                {balanceError && <p className="text-yellow-400 text-sm mt-1">Note: {balanceError}</p>}
              </div>
            ) : (
              <p
                className={`${fetchingBalance ? "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse" : "text-white/60"}`}
                style={
                  fetchingBalance
                    ? {
                        textShadow: "0 0 5px rgba(74,222,128,0.8), 0 0 10px rgba(74,222,128,0.6)",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }
                    : {}
                }
              >
                {fetchingBalance ? "Fetching balance..." : "Connect your wallet to see balance"}
              </p>
            )}
          </ModernCard>

          {/* Token Image Upload */}
          <ModernCard className="p-4" variant="gradient">
            <label htmlFor="image" className="block text-lg font-medium text-amber-400 mb-3">
              Token Image
            </label>
            <StyledFileInput
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={creatingToken || cooldownActive || serviceUnavailable}
              className="mt-1"
            />
            <p className="text-xs text-white/60 mt-1">
              Images will be resized to 500x500 pixels for wallet compatibility
            </p>
            {uploadingImage && <p className="text-yellow-400">Uploading image...</p>}
            {imagePreview && (
              <div className="mt-4 flex justify-center">
                <div className="relative w-40 h-40 overflow-hidden rounded-lg border border-white/20">
                  <ImageDisplay
                    src={imagePreview || "/placeholder.svg"}
                    alt="Token Preview"
                    width={160}
                    height={160}
                    className="rounded-lg max-h-40 mx-auto z-10 relative"
                  />
                </div>
              </div>
            )}
          </ModernCard>

          {/* Authorities */}
          <ModernCard className="p-4" variant="gradient">
            <label className="block text-lg font-medium text-amber-400 mb-3">Authorities</label>
            <div className="space-y-2 mt-2">
              <div>
                <label htmlFor="mintAuthority" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="mintAuthority"
                    name="mintAuthority"
                    checked={formState.mintAuthority}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 rounded bg-black/30 text-amber-500 border border-white/20 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200"
                    disabled={creatingToken || cooldownActive || serviceUnavailable}
                  />
                  <span className="text-white/80">Mint Authority</span>
                </label>
              </div>
              <div>
                <label htmlFor="freezeAuthority" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="freezeAuthority"
                    name="freezeAuthority"
                    checked={formState.freezeAuthority}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 rounded bg-black/30 text-amber-500 border border-white/20 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200"
                    disabled={creatingToken || cooldownActive || serviceUnavailable}
                  />
                  <span className="text-white/80">Freeze Authority</span>
                </label>
              </div>
              <div>
                <label htmlFor="transferFeeAuthority" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="transferFeeAuthority"
                    name="transferFeeAuthority"
                    checked={formState.transferFeeAuthority}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 rounded bg-black/30 text-amber-500 border border-white/20 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200"
                    disabled={creatingToken || cooldownActive || serviceUnavailable}
                  />
                  <span className="text-white/80">Transfer Fee Authority</span>
                </label>
              </div>
            </div>
          </ModernCard>

          {/* Replace the token fee information card with our new FeeCalculator */}
          <ModernCard className="p-4 border border-yellow-500/30 bg-yellow-900/10">
            <h3 className="text-lg font-medium text-amber-400 mb-3">TOKEN CREATION FEE INFORMATION</h3>
            <p className="text-white/80">
              Token creation requires a base fee of 0.1 SOL, with additional features available at 0.1 SOL each.
            </p>

            <FeeCalculator className="mt-4" />

            <div className="mt-3 pt-3 border-t border-yellow-500/30">
              <p className="font-bold text-amber-400">LIQUIDITY POOL FEES:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-white/80">
                <li>Raydium Pool Creation: 0.2 SOL</li>
                <li>Minimum Liquidity: 0.5 SOL + Token Amount</li>
              </ul>
            </div>

            <div className="mt-3 pt-3 border-t border-yellow-500/30">
              <p className="text-center italic text-white/60">
                For more information, visit the
                <a
                  href="https://spl.solana.com/token"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline ml-1 hover:text-amber-400"
                >
                  Solana Program Library
                </a>
              </p>
            </div>
          </ModernCard>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ModernCard className="p-4" variant="gradient">
              <div className="mb-4">
                <label htmlFor="tokenName" className="block text-lg font-medium text-amber-400 mb-2">
                  Token Name
                </label>
                <input
                  type="text"
                  id="tokenName"
                  name="tokenName"
                  value={formState.tokenName}
                  onChange={handleChange}
                  className="mt-1 p-3 md:p-4 w-full rounded-lg bg-gray-800/50 text-white border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                  required
                  disabled={creatingToken || cooldownActive || serviceUnavailable}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="symbol" className="block text-lg font-medium text-amber-400 mb-2">
                  Symbol
                </label>
                <input
                  type="text"
                  id="symbol"
                  name="symbol"
                  value={formState.symbol}
                  onChange={handleChange}
                  className="mt-1 p-3 md:p-4 w-full rounded-lg bg-gray-800/50 text-white border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                  required
                  disabled={creatingToken || cooldownActive || serviceUnavailable}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="decimals" className="block text-lg font-medium text-amber-400 mb-2">
                    Decimals
                  </label>
                  <input
                    type="number"
                    id="decimals"
                    name="decimals"
                    value={formState.decimals}
                    onChange={handleChange}
                    className="mt-1 p-3 md:p-4 w-full rounded-lg bg-gray-800/50 text-white border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                    required
                    disabled={creatingToken || cooldownActive || serviceUnavailable}
                  />
                </div>

                <div>
                  <label htmlFor="supply" className="block text-lg font-medium text-amber-400 mb-2">
                    Total Supply
                  </label>
                  <input
                    type="number"
                    id="supply"
                    name="supply"
                    value={formState.supply}
                    onChange={handleChange}
                    className="mt-1 p-3 md:p-4 w-full rounded-lg bg-gray-800/50 text-white border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                    required
                    disabled={creatingToken || cooldownActive || serviceUnavailable}
                  />
                </div>
              </div>
            </ModernCard>

            <ModernCard className="p-4" variant="gradient">
              <div className="mb-4">
                <label htmlFor="creatorName" className="block text-lg font-medium text-amber-400 mb-2">
                  Creator Name
                </label>
                <input
                  type="text"
                  id="creatorName"
                  name="creatorName"
                  value={formState.creatorName || ""}
                  onChange={handleChange}
                  className="mt-1 p-3 md:p-4 w-full rounded-lg bg-gray-800/50 text-white border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                  disabled={creatingToken || cooldownActive || serviceUnavailable}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="siteName" className="block text-lg font-medium text-amber-400 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={formState.siteName || ""}
                  onChange={handleChange}
                  className="mt-1 p-3 md:p-4 w-full rounded-lg bg-gray-800/50 text-white border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                  disabled={creatingToken || cooldownActive || serviceUnavailable}
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="fee" className="block text-lg font-medium text-amber-400 mb-2">
                    Fee (SOL)
                  </label>
                  <div className="group relative">
                    <span className="text-xs text-amber-400 cursor-help">What's this?</span>
                    <div className="absolute bottom-full right-0 mb-2 w-64 bg-black/90 border border-white/10 p-2 rounded text-xs text-white/80 hidden group-hover:block z-50">
                      This is the required fee for token creation. The base fee is 0.2 SOL with additional features
                      available in 0.1 SOL increments.
                    </div>
                  </div>
                </div>
                <input
                  type="number"
                  id="fee"
                  name="fee"
                  value={formState.fee || 0.1}
                  onChange={handleChange}
                  className="mt-1 p-3 md:p-4 w-full rounded-lg bg-gray-800/50 text-white border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                  disabled={creatingToken || cooldownActive || serviceUnavailable}
                />
                {feeWarning && <p className="text-yellow-400 text-sm mt-1">{feeWarning}</p>}
                <p className="text-xs text-white/60 mt-1">
                  A fee of 0.1 SOL is required for token creation. Additional features are available in 0.05 SOL
                  increments.
                </p>
              </div>
            </ModernCard>

            <ModernCard className="p-4" variant="gradient">
              <label className="block text-lg font-medium text-amber-400 mb-3">Social Links</label>
              <div className="space-y-2">
                <div>
                  <label htmlFor="socials.twitter" className="block text-xs font-medium text-white/60">
                    Twitter
                  </label>
                  <input
                    type="text"
                    id="socials.twitter"
                    name="socials.twitter"
                    value={formState.socials?.twitter || ""}
                    onChange={handleChange}
                    className="mt-1 p-3 md:p-4 w-full rounded-lg bg-gray-800/50 text-white border border-white/10 focus:border-amber-500 focus:ring-amber-500 text-xs transition-all duration-300 hover:border-white/30 outline-none"
                    disabled={creatingToken || cooldownActive || serviceUnavailable}
                  />
                </div>
                <div>
                  <label htmlFor="socials.discord" className="block text-xs font-medium text-white/60">
                    Discord
                  </label>
                  <input
                    type="text"
                    id="socials.discord"
                    name="socials.discord"
                    value={formState.socials?.discord || ""}
                    onChange={handleChange}
                    className="mt-1 p-3 md:p-4 w-full rounded-lg bg-gray-800/50 text-white border border-white/10 focus:border-amber-500 focus:ring-amber-500 text-xs transition-all duration-300 hover:border-white/30 outline-none"
                    disabled={creatingToken || cooldownActive || serviceUnavailable}
                  />
                </div>
                <div>
                  <label htmlFor="socials.telegram" className="block text-xs font-medium text-white/60">
                    Telegram
                  </label>
                  <input
                    type="text"
                    id="socials.telegram"
                    name="socials.telegram"
                    value={formState.socials?.telegram || ""}
                    onChange={handleChange}
                    className="mt-1 p-3 md:p-4 w-full rounded-lg bg-gray-800/50 text-white border border-white/10 focus:border-amber-500 focus:ring-amber-500 text-xs transition-all duration-300 hover:border-white/30 outline-none"
                    disabled={creatingToken || cooldownActive || serviceUnavailable}
                  />
                </div>
              </div>
            </ModernCard>

            <div className="text-xs text-yellow-400 p-3 bg-yellow-900/10 border border-yellow-500/30 rounded-lg">
              <p className="font-bold">IMPORTANT: Raydium charges a 0.2 SOL creation fee for new pools.</p>
            </div>

            {creatingToken && <div className="text-center my-4">Creating token... This may take a moment</div>}

            <div>
              <ModernButton
                type="submit"
                disabled={creatingToken || !walletConnected || isRateLimited || cooldownActive || serviceUnavailable}
                fullWidth
                size="lg"
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
          </form>
        </div>
      </div>

      <ModernCard className="mt-6 p-4" variant="gradient">
        <h3 className="text-lg font-medium text-amber-400 mb-3">Transaction Status</h3>
        <p className="text-white/80 whitespace-pre-line">{transactionStatus}</p>
      </ModernCard>
    </>
  )
}

export default React.memo(TokenCreationForm)
