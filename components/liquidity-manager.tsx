"use client"

import React, { useState, useEffect } from "react"
import { useTokenForm } from "@/context/token-form-context"
import { useToast } from "@/context/toast-context"
import { addLiquiditySimplified, removeLiquiditySimplified } from "@/lib/simplified-raydium"
import { Button } from "@/components/ui/button"
import DigitalSpinner from "./digital-spinner"
import { ExternalLink, Check } from "lucide-react"
// Add import for GlitchTextEffect
import GlitchTextEffect from "./glitch-text-effect"

interface LiquidityManagerProps {
  tokenMint: string
  tokenName: string
  tokenSymbol: string
}

export default function LiquidityManager({ tokenMint, tokenName, tokenSymbol }: LiquidityManagerProps) {
  const { walletConnected } = useTokenForm()
  const { addToast } = useToast()

  // Add loading state
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const [addingLiquidity, setAddingLiquidity] = useState<boolean>(false)
  const [removingLiquidity, setRemovingLiquidity] = useState<boolean>(false)
  const [liquidityStatus, setLiquidityStatus] = useState<string>("")
  const [liquidityProgress, setLiquidityProgress] = useState<number>(0)
  const [liquidityTxId, setLiquidityTxId] = useState<string>("")
  const [liquidityPoolId, setLiquidityPoolId] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [liquidityAdded, setLiquidityAdded] = useState<boolean>(false)

  const [tokenAmount, setTokenAmount] = useState<string>("900000000")
  const [solAmount, setSolAmount] = useState<string>("0.5")
  const [showAddLiquidity, setShowAddLiquidity] = useState<boolean>(false)
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState<boolean>(false)
  const [verifiedOnDex, setVerifiedOnDex] = useState<boolean>(false)
  const [redirectedToDex, setRedirectedToDex] = useState<boolean>(false)

  // Function to handle adding liquidity
  const handleAddLiquidity = async () => {
    if (!walletConnected) {
      setError("Wallet not connected. Please connect your wallet first.")
      addToast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        type: "warning",
      })
      return { success: false, error: "Wallet not connected" }
    }

    setAddingLiquidity(true)
    setLiquidityStatus("Preparing to add liquidity...")
    setLiquidityProgress(0)
    setError("")

    try {
      // Get the wallet object
      // @ts-ignore
      const wallet = window.solana

      if (!wallet || !wallet.publicKey) {
        throw new Error("Wallet not connected or public key not available")
      }

      // Parse the token amount
      const tokenAmountNum = Number.parseFloat(tokenAmount)
      const solAmountNum = Number.parseFloat(solAmount)

      // Use the simplified implementation
      const result = await addLiquiditySimplified(
        wallet,
        tokenMint,
        tokenAmountNum,
        solAmountNum,
        (status) => {
          console.log("Liquidity status:", status)
          setLiquidityStatus(status)
        },
        (progress) => setLiquidityProgress(progress),
      )

      if (result.success) {
        setLiquidityTxId(result.txId || "")

        // Store the pool ID if it was returned
        if (result.poolId) {
          setLiquidityPoolId(result.poolId)
        }

        addToast({
          title: "Liquidity Added Successfully",
          description: "Your token now has liquidity on Raydium.",
          type: "success",
        })

        setLiquidityAdded(true)
        return { success: true, txId: result.txId, poolId: result.poolId }
      } else {
        throw new Error(result.error || "Failed to add liquidity")
      }
    } catch (error: any) {
      console.error("Error adding liquidity:", error)
      setError(`Failed to add liquidity: ${error.message}`)
      addToast({
        title: "Liquidity Addition Failed",
        description: error.message,
        type: "error",
      })
      return { success: false, error: error.message }
    } finally {
      setAddingLiquidity(false)
    }
  }

  // Function to handle removing liquidity
  const handleRemoveLiquidity = async (percent: number) => {
    if (!walletConnected) {
      setError("Wallet not connected. Please connect your wallet first.")
      addToast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        type: "warning",
      })
      return
    }

    setRemovingLiquidity(true)
    setLiquidityStatus("Preparing to remove liquidity...")
    setLiquidityProgress(0)
    setError("")

    addToast({
      title: "Removing Liquidity",
      description: `Starting to remove ${percent}% of your liquidity...`,
      type: "info",
    })

    try {
      // Get the wallet object
      // @ts-ignore
      const wallet = window.solana

      if (!wallet || !wallet.publicKey) {
        throw new Error("Wallet not connected or public key not available")
      }

      // Use the simplified implementation
      const result = await removeLiquiditySimplified(
        wallet,
        tokenMint,
        percent,
        (status) => {
          console.log("Liquidity status:", status)
          setLiquidityStatus(status)

          // Add toast notifications for key status updates
          if (status.includes("Found pool")) {
            addToast({
              title: "Pool Found",
              description: "Located your liquidity pool on Raydium",
              type: "info",
            })
          } else if (status.includes("Found") && status.includes("LP tokens")) {
            addToast({
              title: "LP Tokens Found",
              description: "Found your LP tokens for this pool",
              type: "info",
            })
          }
        },
        (progress) => setLiquidityProgress(progress),
      )

      if (result.success) {
        setLiquidityTxId(result.txId || "")

        // Store the pool ID if it was returned
        if (result.poolId) {
          setLiquidityPoolId(result.poolId)
          console.log("Successfully stored pool ID:", result.poolId)
        }

        addToast({
          title: "Liquidity Removed Successfully",
          description: `${percent}% of your liquidity has been removed.`,
          type: "success",
          duration: 8000, // Show for longer
        })
      } else {
        throw new Error(result.error || "Failed to remove liquidity")
      }
    } catch (error: any) {
      console.error("Error removing liquidity:", error)
      setError(`Failed to remove liquidity: ${error.message}`)

      // Provide more specific error messages based on common issues
      let errorMessage = error.message
      if (error.message.includes("LP tokens")) {
        errorMessage = "You don't have any LP tokens for this pool. You may have already removed all liquidity."
      } else if (error.message.includes("pool not found")) {
        errorMessage = "Liquidity pool not found. The token may not have been paired with SOL yet."
      }

      addToast({
        title: "Liquidity Removal Failed",
        description: errorMessage,
        type: "error",
        duration: 10000, // Show longer for errors
      })
    } finally {
      setRemovingLiquidity(false)
    }
  }

  // Effect to handle redirection after liquidity is added
  useEffect(() => {
    if (liquidityAdded && liquidityTxId && !redirectedToDex) {
      // Set a timeout to allow the user to see the success message before redirecting
      const redirectTimer = setTimeout(() => {
        window.open(`https://dexscreener.com/solana/${tokenMint}`, "_blank")
        setRedirectedToDex(true)
      }, 3000)

      return () => clearTimeout(redirectTimer)
    }
  }, [liquidityAdded, liquidityTxId, redirectedToDex, tokenMint])

  // Effect to update liquidityAdded state when liquidityTxId changes
  useEffect(() => {
    if (liquidityTxId) {
      setLiquidityAdded(true)
    }
  }, [liquidityTxId])

  const handleAddLiquidityClick = async () => {
    // Parse the token and SOL amounts
    const tokenAmountNum = Number.parseFloat(tokenAmount)
    const solAmountNum = Number.parseFloat(solAmount)

    // Validate the amounts
    if (isNaN(tokenAmountNum) || tokenAmountNum <= 0) {
      alert("Please enter a valid token amount")
      return
    }

    if (isNaN(solAmountNum) || solAmountNum <= 0) {
      alert("Please enter a valid SOL amount")
      return
    }

    const result = await handleAddLiquidity()
    if (result && result.success) {
      setLiquidityAdded(true)
    }
  }

  const handleRemoveLiquidityClick = async (percent: number) => {
    if (!verifiedOnDex) {
      alert("Please verify your token is trading on DexScreener or Photon before removing liquidity.")
      return
    }

    // Show a confirmation dialog
    if (window.confirm(`Are you sure you want to remove ${percent}% of your liquidity?`)) {
      await handleRemoveLiquidity(percent)
    }
  }

  const handleVerifyOnDex = () => {
    setVerifiedOnDex(true)
  }

  // Update the openDexScreener function to use the new URL
  const openDexScreener = () => {
    window.open(`https://dexscreener.com/?rankBy=pairAge&order=asc`, "_blank")
  }

  // Add new functions to open Raydium links
  const openRaydiumCreatePool = () => {
    window.open(`https://raydium.io/liquidity/create-pool/`, "_blank")
  }

  const openRaydiumPortfolio = () => {
    window.open(`https://raydium.io/portfolio/?position_tab=standard`, "_blank")
  }

  const openSolscan = (tokenMint: string) => {
    window.open(`https://solscan.io/token/${tokenMint}`, "_blank")
  }

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-br from-black/90 to-gray-900/80 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 rounded-lg backdrop-blur-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-cyan-900/30 rounded w-3/4"></div>
          <div className="h-32 bg-gray-800/50 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-blue-900/30 rounded"></div>
            <div className="h-12 bg-purple-900/30 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (addingLiquidity || removingLiquidity) {
    return (
      <div className="mt-6 p-6 bg-gradient-to-br from-black/90 to-gray-900/80 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 rounded-lg backdrop-blur-sm">
        <DigitalSpinner progress={liquidityProgress} status={liquidityStatus} />
        {liquidityTxId && (
          <div className="mt-4 text-center">
            <p className="text-cyan-300 mb-2">Transaction ID:</p>
            <a
              href={`https://solscan.io/tx/${liquidityTxId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 break-all"
            >
              {liquidityTxId}
            </a>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-black/90 to-gray-900/80 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 rounded-lg backdrop-blur-sm">
      {/* Update the main heading */}
      <GlitchTextEffect
        text={`Liquidity Management for ${tokenName} (${tokenSymbol})`}
        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-4 drop-shadow-sm"
        glitchIntensity="medium"
        color="mixed"
      />

      {!liquidityAdded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Liquidity Section */}
          <div>
            <Button
              onClick={() => setShowAddLiquidity(!showAddLiquidity)}
              className="w-full mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden before:absolute before:inset-0 before:bg-white/10 before:translate-x-[-100%] hover:before:animate-[shimmer_1.5s_infinite] before:skew-x-[-15deg]"
              disabled={!walletConnected}
            >
              {showAddLiquidity ? "Hide Add Liquidity" : "Add Liquidity"}
            </Button>

            {showAddLiquidity && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label htmlFor="tokenAmount" className="block text-sm font-medium text-cyan-300">
                    Token Amount
                  </label>
                  <input
                    type="text"
                    id="tokenAmount"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    className="mt-1 p-2 w-full rounded-lg bg-black/30 text-white border border-cyan-500/30 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label htmlFor="solAmount" className="block text-sm font-medium text-cyan-300">
                    SOL Amount (Fixed)
                  </label>
                  <input
                    type="text"
                    id="solAmount"
                    value={solAmount}
                    readOnly
                    className="mt-1 p-2 w-full rounded-lg bg-black/40 text-white border border-cyan-500/30 focus:border-cyan-500 focus:ring-cyan-500 cursor-not-allowed"
                  />
                </div>

                <div className="text-xs text-yellow-400 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                  <p className="font-bold">IMPORTANT: Raydium charges a 0.2 SOL creation fee for new pools.</p>
                  <p className="mt-1">
                    This fee is required by Raydium and is in addition to the 0.5 SOL liquidity amount.
                  </p>
                  <p className="mt-1">You need at least 0.7 SOL in your wallet to create a liquidity pool.</p>
                </div>

                <Button
                  onClick={openRaydiumCreatePool}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!walletConnected}
                >
                  Add Liquidity on Raydium
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center p-4 bg-black/30 border border-cyan-500/20 rounded-lg">
              <p className="text-cyan-300">Add liquidity to enable trading for your token</p>
              <p className="text-sm text-gray-400 mt-2">
                Pairing your token with SOL creates a trading pair that allows others to buy and sell your token
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Liquidity Added Success Message */}
          <div className="p-4 bg-amber-900/30 border border-amber-500/30 rounded-lg relative overflow-hidden before:absolute before:inset-0 before:bg-amber-500/5 before:animate-pulse">
            {/* Update the Liquidity Added Success Message heading */}
            <div className="flex items-center">
              <Check className="text-amber-400 mr-2" size={20} />
              <GlitchTextEffect
                text="Liquidity Successfully Added!"
                className="text-amber-400 font-medium"
                glitchIntensity="low"
                color="cyan"
              />
            </div>
            <p className="mt-2 text-gray-300">Your token is now paired with SOL and can be traded.</p>

            {liquidityTxId && (
              <div className="mt-2">
                <a
                  href={`https://solscan.io/tx/${liquidityTxId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center"
                >
                  View Transaction <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            )}
          </div>

          {/* Verification Section */}
          <div className="p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            {/* Update the Verification Section heading */}
            <GlitchTextEffect
              text="Verify Your Token on DexScreener"
              className="text-blue-400 font-medium flex items-center"
              glitchIntensity="low"
              color="cyan"
            />
            <p className="mt-2 text-gray-300">
              Before removing liquidity, you must verify your token is visible on DexScreener or Photon.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={openDexScreener} className="bg-blue-600 hover:bg-blue-700 inline-flex items-center">
                View on DexScreener <ExternalLink size={14} className="ml-1" />
              </Button>
              <Button
                onClick={() => openSolscan(tokenMint)}
                className="bg-purple-600 hover:bg-purple-700 inline-flex items-center"
              >
                View on Solscan <ExternalLink size={14} className="ml-1" />
              </Button>
              <Button
                onClick={handleVerifyOnDex}
                variant={verifiedOnDex ? "default" : "outline"}
                className={verifiedOnDex ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {verifiedOnDex ? "Verified ✓" : "I've Verified My Token"}
              </Button>
            </div>
          </div>

          {/* Remove Liquidity Section */}
          <div
            className={`p-4 ${verifiedOnDex ? "bg-purple-900/30 border border-purple-500/30" : "bg-gray-800/30 border border-gray-700/30"} rounded-lg`}
          >
            <Button
              onClick={openRaydiumPortfolio}
              className="w-full mb-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              Manage Liquidity on Raydium Portfolio
            </Button>
            {/* Update the Remove Liquidity heading */}
            <GlitchTextEffect
              className={`${verifiedOnDex ? "text-purple-400" : "text-gray-500"} font-medium`}
              text="Remove Liquidity"
              glitchIntensity="low"
              color={verifiedOnDex ? "purple" : "mixed"}
            />
            <p className={`mt-2 ${verifiedOnDex ? "text-gray-300" : "text-gray-500"}`}>
              {verifiedOnDex
                ? "Choose how much liquidity you want to remove from the pool."
                : "You must verify your token is trading before removing liquidity."}
            </p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={() => handleRemoveLiquidityClick(25)}
                disabled={!verifiedOnDex}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700"
              >
                Remove 25%
              </Button>
              <Button
                onClick={() => handleRemoveLiquidityClick(50)}
                disabled={!verifiedOnDex}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700"
              >
                Remove 50%
              </Button>
              <Button
                onClick={() => handleRemoveLiquidityClick(75)}
                disabled={!verifiedOnDex}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700"
              >
                Remove 75%
              </Button>
              <Button
                onClick={() => handleRemoveLiquidityClick(100)}
                disabled={!verifiedOnDex}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700"
              >
                Remove 100%
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-md">{error}</div>}

      {liquidityPoolId && !liquidityAdded && (
        <div className="mt-4 p-3 bg-green-900/50 border border-green-500 text-green-200 rounded-md">
          {/* Update the Liquidity Pool Information heading */}
          <GlitchTextEffect
            text="Liquidity Pool Information"
            className="font-medium"
            glitchIntensity="low"
            color="cyan"
          />
          <p className="text-sm mt-1">
            Pool ID (AMM): <span className="font-mono text-xs break-all">{liquidityPoolId}</span>
          </p>
          <div className="flex space-x-2 mt-2">
            <a
              href={`https://raydium.io/liquidity/?ammId=${liquidityPoolId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center"
            >
              View on Raydium <ExternalLink size={12} className="ml-1" />
            </a>
            <a
              href={`https://solscan.io/account/${liquidityPoolId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center"
            >
              View on Solscan <ExternalLink size={12} className="ml-1" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(LiquidityManager)
