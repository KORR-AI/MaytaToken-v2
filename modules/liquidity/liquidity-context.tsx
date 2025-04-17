"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { addLiquidity, removeLiquidity } from "./liquidity-service"
import { useToast } from "@/context/toast-context"
import type { LiquidityResult } from "./types"

interface LiquidityContextType {
  addingLiquidity: boolean
  removingLiquidity: boolean
  liquidityStatus: string
  liquidityProgress: number
  liquidityTxId: string
  liquidityPoolId: string
  error: string
  liquidityAdded: boolean
  handleAddLiquidity: (
    wallet: any,
    tokenMint: string,
    tokenAmount: number,
    solAmount?: number,
  ) => Promise<LiquidityResult>
  handleRemoveLiquidity: (wallet: any, tokenMint: string, percent: number) => Promise<LiquidityResult>
  resetLiquidityState: () => void
}

const LiquidityContext = createContext<LiquidityContextType | undefined>(undefined)

export function LiquidityProvider({ children }: { children: React.ReactNode }) {
  const [addingLiquidity, setAddingLiquidity] = useState<boolean>(false)
  const [removingLiquidity, setRemovingLiquidity] = useState<boolean>(false)
  const [liquidityStatus, setLiquidityStatus] = useState<string>("")
  const [liquidityProgress, setLiquidityProgress] = useState<number>(0)
  const [liquidityTxId, setLiquidityTxId] = useState<string>("")
  const [liquidityPoolId, setLiquidityPoolId] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [liquidityAdded, setLiquidityAdded] = useState<boolean>(false)

  const { addToast } = useToast()

  const resetLiquidityState = () => {
    setAddingLiquidity(false)
    setRemovingLiquidity(false)
    setLiquidityStatus("")
    setLiquidityProgress(0)
    setLiquidityTxId("")
    setError("")
  }

  const handleAddLiquidity = async (
    wallet: any,
    tokenMint: string,
    tokenAmount: number,
    solAmount = 0.5,
  ): Promise<LiquidityResult> => {
    if (!wallet || !wallet.publicKey) {
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
      const result = await addLiquidity(
        wallet,
        tokenMint,
        tokenAmount,
        solAmount,
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
        return result
      } else {
        throw new Error(result.error || "Failed to add liquidity")
      }
    } catch (error: any) {
      console.error("Error adding liquidity:", error)

      // Check for specific error messages
      let errorMessage = error.message || "Failed to add liquidity"

      // Check for program ID errors
      if (errorMessage.includes("incorrect program id")) {
        errorMessage =
          "Incorrect program ID error. This may be due to using an outdated Raydium program address. Please try again with a smaller amount of SOL."
      }

      setError(`Failed to add liquidity: ${errorMessage}`)
      addToast({
        title: "Liquidity Addition Failed",
        description: errorMessage,
        type: "error",
      })
      return { success: false, error: errorMessage }
    } finally {
      setAddingLiquidity(false)
    }
  }

  const handleRemoveLiquidity = async (wallet: any, tokenMint: string, percent: number): Promise<LiquidityResult> => {
    if (!wallet || !wallet.publicKey) {
      setError("Wallet not connected. Please connect your wallet first.")
      addToast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        type: "warning",
      })
      return { success: false, error: "Wallet not connected" }
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
      const result = await removeLiquidity(
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

        return result
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

      return { success: false, error: errorMessage }
    } finally {
      setRemovingLiquidity(false)
    }
  }

  return (
    <LiquidityContext.Provider
      value={{
        addingLiquidity,
        removingLiquidity,
        liquidityStatus,
        liquidityProgress,
        liquidityTxId,
        liquidityPoolId,
        error,
        liquidityAdded,
        handleAddLiquidity,
        handleRemoveLiquidity,
        resetLiquidityState,
      }}
    >
      {children}
    </LiquidityContext.Provider>
  )
}

export function useLiquidity() {
  const context = useContext(LiquidityContext)
  if (context === undefined) {
    throw new Error("useLiquidity must be used within a LiquidityProvider")
  }
  return context
}
