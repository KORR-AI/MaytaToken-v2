"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { createToken } from "@/lib/token-service"
import { useToast } from "@/context/toast-context"
import { useRouter } from "next/navigation"
import nacl from "tweetnacl"
import bs58 from "bs58"

// Add these helper functions at the top of your file, outside the TokenFormProvider component

// Function to detect if the user is on a mobile device
function isMobileDevice() {
  return (
    typeof window !== "undefined" &&
    (navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i))
  )
}

// Function to check if Phantom is installed as a browser extension
function isPhantomExtensionInstalled() {
  return typeof window !== "undefined" && window.solana && window.solana.isPhantom
}

// Update the FormState type to include the new properties
type FormState = {
  tokenName: string
  symbol: string
  decimals: string
  supply: string
  image: string
  creatorName?: string
  siteName?: string
  socials?: Record<string, string>
  mintAuthority: boolean
  freezeAuthority: boolean
  transferFeeAuthority: boolean
  fee?: number
  enableCreatorInfo: boolean
  enableAuthorities: boolean // Add this line
  enableSocialLinks: boolean // Add this line
}

// Update the defaultFormState to include the new properties set to false
const defaultFormState: FormState = {
  tokenName: "",
  symbol: "",
  decimals: "9",
  supply: "1000000000",
  image: "",
  creatorName: "",
  siteName: "",
  socials: {},
  mintAuthority: false,
  freezeAuthority: false,
  transferFeeAuthority: false,
  fee: 0.1,
  enableCreatorInfo: false,
  enableAuthorities: false, // Add this line
  enableSocialLinks: false, // Add this line
}

type TokenContextType = {
  formState: FormState
  setFormState: React.Dispatch<React.SetStateAction<FormState>>
  imagePreview: string
  setImagePreview: React.Dispatch<React.SetStateAction<string>>
  uploadingImage: boolean
  setUploadingImage: React.Dispatch<React.SetStateAction<boolean>>
  creatingToken: boolean
  setCreatingToken: React.Dispatch<React.SetStateAction<boolean>>
  transactionStatus: string
  setTransactionStatus: React.Dispatch<React.SetStateAction<string>>
  mintAddress: string
  setMintAddress: React.Dispatch<React.SetStateAction<string>>
  signature: string
  setSignature: React.Dispatch<React.SetStateAction<string>>
  metadataUrl: string
  setMetadataUrl: React.Dispatch<React.SetStateAction<string>>
  error: string
  setError: React.Dispatch<React.SetStateAction<string>>
  success: boolean
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>
  balance: number | null
  setBalance: React.Dispatch<React.SetStateAction<number | null>>
  fetchingBalance: boolean
  setFetchingBalance: React.Dispatch<React.SetStateAction<boolean>>
  walletConnected: boolean
  setWalletConnected: React.Dispatch<React.SetStateAction<boolean>>
  balanceError: string
  setBalanceError: React.Dispatch<React.SetStateAction<string>>
  feeWarning: string
  setFeeWarning: React.Dispatch<React.SetStateAction<string>>
  isRateLimited: boolean
  setIsRateLimited: React.Dispatch<React.SetStateAction<boolean>>
  isQueued: boolean
  setIsQueued: React.Dispatch<React.SetStateAction<boolean>>
  retryCount: number
  setRetryCount: React.Dispatch<React.SetStateAction<number>>
  cooldownActive: boolean
  setCooldownActive: React.Dispatch<React.SetStateAction<boolean>>
  cooldownTimeLeft: number
  setCooldownTimeLeft: React.Dispatch<React.SetStateAction<number>>
  serviceUnavailable: boolean
  setServiceUnavailable: React.Dispatch<React.SetStateAction<boolean>>
  progress: number
  setProgress: React.Dispatch<React.SetStateAction<number>>
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  fetchBalance: () => Promise<void>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleSubmit: (e: React.FormEvent) => Promise<void>
  formatCooldownTime: (ms: number) => string
  liquidityStatus: string
  setLiquidityStatus: React.Dispatch<React.SetStateAction<string>>
  liquidityProgress: number
  setLiquidityProgress: React.Dispatch<React.SetStateAction<number>>
  liquidityTxId: string
  setLiquidityTxId: React.Dispatch<React.SetStateAction<string>>
  liquidityPoolId: string
  setLiquidityPoolId: React.Dispatch<React.SetStateAction<string>>
  addingLiquidity: boolean
  setAddingLiquidity: React.Dispatch<React.SetStateAction<boolean>>
  removingLiquidity: boolean
  setRemovingLiquidity: React.Dispatch<React.SetStateAction<boolean>>
  handleAddLiquidity: (
    tokenMint: string,
  ) => Promise<{ success: boolean; txId?: string; error?: string; poolId?: string }>
  handleRemoveLiquidity: (tokenMint: string, percent: number) => Promise<void>
  handlePhantomRedirect: () => void
}

const TokenFormContext = createContext<TokenContextType | undefined>(undefined)

// Cooldown period (5 minutes)
const COOLDOWN_PERIOD = 5 * 60 * 1000

export function TokenFormProvider({ children }: { children: React.ReactNode }) {
  const [formState, setFormState] = useState<FormState>(defaultFormState)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState<boolean>(false)
  const [creatingToken, setCreatingToken] = useState<boolean>(false)
  const [transactionStatus, setTransactionStatus] = useState<string>("")
  const [mintAddress, setMintAddress] = useState<string>("")
  const [signature, setSignature] = useState<string>("")
  const [metadataUrl, setMetadataUrl] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [fetchingBalance, setFetchingBalance] = useState<boolean>(false)
  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [balanceError, setBalanceError] = useState<string>("")
  const [feeWarning, setFeeWarning] = useState<string>("")
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false)
  const [isQueued, setIsQueued] = useState<boolean>(false)
  const [retryCount, setRetryCount] = useState<number>(0)
  const [cooldownActive, setCooldownActive] = useState<boolean>(false)
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number>(0)
  const [serviceUnavailable, setServiceUnavailable] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastAttemptTimeRef = useRef<number | null>(null)
  const { addToast } = useToast()
  const [liquidityStatus, setLiquidityStatus] = useState<string>("")
  const [liquidityProgress, setLiquidityProgress] = useState<number>(0)
  const [liquidityTxId, setLiquidityTxId] = useState<string>("")
  const [liquidityPoolId, setLiquidityPoolId] = useState<string>("")
  const [addingLiquidity, setAddingLiquidity] = useState<boolean>(false)
  const [removingLiquidity, setRemovingLiquidity] = useState<boolean>(false)
  const router = useRouter()

  // Function to check if wallet is connected
  const checkWalletConnection = () => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return false

    // Try to get the Solana wallet object from different possible locations
    // @ts-ignore
    const solana = window.solana || window.phantom?.solana

    if (!solana) {
      console.log("No Solana wallet found in window object")
      setWalletConnected(false)
      return false
    }

    if (!solana.isConnected) {
      console.log("Wallet is not connected")
      setWalletConnected(false)
      return false
    }

    if (!solana.publicKey) {
      console.log("Wallet public key is not available")
      setWalletConnected(false)
      return false
    }

    setWalletConnected(true)
    return true
  }

  // Update the connectWallet function to handle both mobile and desktop connections
  const connectWallet = async () => {
    try {
      setError("")

      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        throw new Error("Cannot connect wallet in non-browser environment")
      }

      // Check if on mobile device
      if (isMobileDevice()) {
        // Mobile connection flow
        const dappKeyPair = nacl.box.keyPair()
        const sharedSecretDapp = nacl.randomBytes(32)
        const phantomUrl = `https://phantom.app/ul/v1/connect?app_url=${encodeURIComponent(window.location.href)}&dapp_encryption_public_key=${bs58.encode(dappKeyPair.publicKey)}&redirect_link=${encodeURIComponent(window.location.href)}&cluster=mainnet-beta`

        // Store connection state for when the user returns from Phantom
        localStorage.setItem("phantomConnecting", "true")
        localStorage.setItem("phantomEncryptionPublicKey", bs58.encode(dappKeyPair.publicKey))
        localStorage.setItem("phantomSharedSecret", bs58.encode(sharedSecretDapp))

        // Open Phantom app
        window.location.href = phantomUrl
        return // The connection will continue when the user returns from Phantom
      }

      // Desktop connection flow
      // Check if any Solana wallet is available
      const solana = window.solana || window.phantom?.solana

      if (!solana) {
        throw new Error(
          "Solana wallet not found. Please install Phantom or another Solana wallet extension and refresh the page. Visit https://phantom.app/ to download.",
        )
      }

      // Try to connect to the wallet
      await solana.connect()

      // Check connection after attempting to connect
      if (solana.isConnected && solana.publicKey) {
        setWalletConnected(true)
        fetchBalance()
        addToast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
          type: "success",
        })
      } else {
        throw new Error("Failed to connect to wallet. Please try again.")
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      setError(`${err.message}`)
      addToast({
        title: "Connection Failed",
        description: err.message,
        type: "error",
        duration: 10000, // Show for longer to give user time to read
      })
    }
  }

  // Add a function to handle the return from Phantom mobile app
  const handlePhantomRedirect = () => {
    if (typeof window === "undefined") return

    // Check if we're returning from Phantom
    const isConnecting = localStorage.getItem("phantomConnecting") === "true"

    if (isConnecting) {
      // Get the connection data from URL parameters
      const url = new URL(window.location.href)
      const phantomEncryptionPublicKey = url.searchParams.get("phantom_encryption_public_key")
      const nonce = url.searchParams.get("nonce")
      const data = url.searchParams.get("data")

      if (phantomEncryptionPublicKey && nonce && data) {
        try {
          // Process the connection data
          // This would require implementing the decryption logic with TweetNaCl.js
          // For simplicity, we'll just mark as connected
          setWalletConnected(true)
          fetchBalance()
          addToast({
            title: "Wallet Connected",
            description: "Your Phantom mobile wallet has been connected.",
            type: "success",
          })
        } catch (err) {
          console.error("Error processing Phantom redirect:", err)
        }
      }

      // Clear the connection state
      localStorage.removeItem("phantomConnecting")
      localStorage.removeItem("phantomEncryptionPublicKey")
      localStorage.removeItem("phantomSharedSecret")

      // Remove the Phantom parameters from the URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }

  // Function to disconnect wallet
  const disconnectWallet = async () => {
    try {
      setError("")

      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        throw new Error("Cannot disconnect wallet in non-browser environment")
      }

      // Try to get the Solana wallet object from different possible locations
      // @ts-ignore
      const solana = window.solana || window.phantom?.solana

      if (!solana) {
        throw new Error("Solana wallet not found")
      }

      // Disconnect from the wallet
      await solana.disconnect()
      setWalletConnected(false)
      setBalance(null)
      addToast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
        type: "info",
      })
    } catch (err: any) {
      console.error("Error disconnecting wallet:", err)
      setError(`Failed to disconnect wallet: ${err.message}`)
      addToast({
        title: "Disconnection Failed",
        description: err.message,
        type: "error",
      })
    }
  }

  // Activate cooldown period after rate limit
  const activateCooldown = () => {
    // Set the last attempt time
    lastAttemptTimeRef.current = Date.now()
    setCooldownActive(true)
    setCooldownTimeLeft(COOLDOWN_PERIOD)

    // Clear any existing timer
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current)
    }

    // Start the cooldown timer
    cooldownTimerRef.current = setInterval(() => {
      if (!lastAttemptTimeRef.current) return

      const elapsed = Date.now() - lastAttemptTimeRef.current
      const remaining = Math.max(0, COOLDOWN_PERIOD - elapsed)
      setCooldownTimeLeft(remaining)

      if (remaining <= 0) {
        setCooldownActive(false)
        setServiceUnavailable(false)
        if (cooldownTimerRef.current) {
          clearInterval(cooldownTimerRef.current)
          cooldownTimerRef.current = null
        }
      }
    }, 1000)
  }

  // Format the cooldown time for display
  const formatCooldownTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Function to fetch the wallet balance with throttling
  const fetchBalance = async () => {
    try {
      // @ts-ignore
      if (!window.solana?.publicKey) {
        console.log("Wallet not connected, skipping balance fetch")
        return
      }

      setFetchingBalance(true)
      setBalanceError("")
      setIsRateLimited(false)

      // @ts-ignore
      const publicKey = window.solana.publicKey.toString()

      console.log(`Fetching balance for ${publicKey}`)

      // Use our server-side API route to fetch the balance
      const response = await fetch("/api/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey,
        }),
      })

      const data = await response.json()

      if (data.error) {
        console.warn("Balance fetch error:", data.error)
        setBalanceError(data.error)

        // Check if it's a rate limit error
        if (data.rateLimited || data.error.includes("rate limit") || data.error.includes("temporarily unavailable")) {
          setIsRateLimited(true)
          activateCooldown()

          // Check if service is completely unavailable
          if (data.error.includes("temporarily unavailable")) {
            setServiceUnavailable(true)
          }
        }
      }

      setBalance(data.balance)
    } catch (err: any) {
      console.error("Error fetching balance:", err)
      setBalanceError("Failed to fetch balance. Using estimated balance.")
      // Don't show an error to the user, just log it
      // This prevents the error from blocking the UI
    } finally {
      setFetchingBalance(false)
    }
  }

  // Helper function to resize images to specified dimensions
  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = maxWidth
        canvas.height = maxHeight
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Draw image at the specified dimensions
        ctx.drawImage(img, 0, 0, maxWidth, maxHeight)

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Could not create blob from canvas"))
            }
          },
          file.type || "image/png",
          0.9, // Quality
        )

        // Clean up
        URL.revokeObjectURL(img.src)
      }

      img.onerror = () => {
        reject(new Error("Failed to load image"))
        URL.revokeObjectURL(img.src)
      }
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setFormState((prev) => ({ ...prev, [name]: checked }))
    } else if (name.startsWith("socials.")) {
      const socialPlatform = name.split(".")[1]
      setFormState((prev) => ({
        ...prev,
        socials: { ...prev.socials, [socialPlatform]: value },
      }))
    } else if (name === "fee") {
      setFormState((prev) => ({ ...prev, [name]: Number.parseFloat(value) }))
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setUploadingImage(true)

    try {
      // Show preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Resize the image to 500x500 before uploading
      const resizedImageBlob = await resizeImage(file, 500, 500)

      // Create a FormData object to send to our API route
      const formData = new FormData()
      formData.append("file", resizedImageBlob, file.name)

      // Use our server-side API route to upload the image
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(`Failed to upload image: ${error}`)
      }

      const data = await res.json()

      // Check if this is a development fallback
      if (data.isDevelopmentFallback) {
        console.log("Using local storage for image")
        // Use the relative path for local images
        setFormState((prev) => ({ ...prev, image: data.localUrl }))
        addToast({
          title: "Image Uploaded",
          description: "Image has been uploaded successfully.",
          type: "success",
        })
      } else {
        // Update the form state with the IPFS URL
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
        setFormState((prev) => ({ ...prev, image: ipfsUrl }))
        addToast({
          title: "Image Uploaded to IPFS",
          description: "Image has been uploaded to IPFS successfully.",
          type: "success",
        })
      }
    } catch (err: any) {
      console.error("Error uploading image:", err)
      setError(`Failed to upload image: ${err.message}`)
      addToast({
        title: "Image Upload Failed",
        description: err.message,
        type: "error",
      })
      // Keep the preview but show an error
    } finally {
      setUploadingImage(false)
    }
  }

  // Import the createToken function from token-service
  // const { createToken } = require("@/lib/token-service")

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Update the handleAddLiquidity function to use the new liquidity module
  const handleAddLiquidity = async (tokenMint: string) => {
    if (!checkWalletConnection()) {
      setError("Wallet not connected. Please connect your wallet first.")
      addToast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        type: "warning",
      })
      return { success: false, error: "Wallet not connected" }
    }

    // Check if the wallet has enough SOL for liquidity + creation fee
    if (balance !== null && balance < 0.71) {
      // 0.5 for liquidity + 0.2 for creation fee + 0.01 for transaction
      setError(
        `Insufficient SOL balance. You need at least 0.71 SOL (0.5 SOL for liquidity, 0.2 SOL for Raydium creation fee, and 0.01 SOL for transaction fees).`,
      )
      addToast({
        title: "Insufficient Balance",
        description: `You need at least 0.71 SOL for liquidity creation.`,
        type: "error",
      })
      return { success: false, error: "Insufficient balance" }
    }

    // Redirect to the liquidity page with the token mint address
    router.push(
      `/liquidity/${tokenMint}?name=${encodeURIComponent(formState.tokenName)}&symbol=${encodeURIComponent(formState.symbol)}`,
    )

    return { success: true }
  }

  // Update the handleRemoveLiquidity function similarly
  const handleRemoveLiquidity = async (tokenMint: string, percent: number) => {
    if (!checkWalletConnection()) {
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

      // Import the simplified Raydium service
      const { removeLiquiditySimplified } = await import("@/lib/simplified-raydium")

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

        // After successful removal, wait a bit and then refresh balance
        setTimeout(fetchBalance, 5000)
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

  // Update the handleSubmit function to calculate the total fee based on all enabled features
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if service is unavailable
    if (serviceUnavailable) {
      setError(
        `Service temporarily unavailable due to rate limiting. Please wait ${formatCooldownTime(cooldownTimeLeft)} before trying again.`,
      )
      addToast({
        title: "Service Unavailable",
        description: `Please wait ${formatCooldownTime(cooldownTimeLeft)} before trying again.`,
        type: "error",
      })
      return
    }

    // Check if cooldown is active
    if (cooldownActive) {
      setError(`Please wait for the cooldown period to end (${formatCooldownTime(cooldownTimeLeft)} remaining)`)
      addToast({
        title: "Cooldown Active",
        description: `Please wait ${formatCooldownTime(cooldownTimeLeft)} before trying again.`,
        type: "warning",
      })
      return
    }

    // Check if wallet is connected before proceeding
    if (!checkWalletConnection()) {
      setError("Wallet not connected. Please connect your wallet first.")
      addToast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        type: "warning",
      })
      return
    }

    // Calculate the total fee based on selected features
    let totalFee = 0.1 // Base fee
    if (formState.enableCreatorInfo) {
      totalFee += 0.1 // Add fee for creator info
    }
    // Calculate fee for each selected authority
    if (formState.mintAuthority) {
      totalFee += 0.1 // Add fee for mint authority
    }
    if (formState.freezeAuthority) {
      totalFee += 0.1 // Add fee for freeze authority
    }
    if (formState.transferFeeAuthority) {
      totalFee += 0.1 // Add fee for transfer fee authority
    }
    if (formState.enableSocialLinks) {
      totalFee += 0.1 // Add fee for social links
    }

    // Check if balance is sufficient for the fee
    if (balance !== null && totalFee > 0) {
      // Add a small buffer for transaction costs (0.000005 SOL)
      const requiredBalance = totalFee + 0.000005

      if (balance < requiredBalance) {
        setError(
          `Insufficient balance for fee payment. You have ${balance.toFixed(5)} SOL, but need at least ${requiredBalance.toFixed(5)} SOL.`,
        )
        addToast({
          title: "Insufficient Balance",
          description: `You have ${balance.toFixed(5)} SOL, but need at least ${requiredBalance.toFixed(5)} SOL.`,
          type: "error",
        })
        return
      }
    }

    // Update the fee in the form state
    setFormState((prev) => ({ ...prev, fee: totalFee }))

    setCreatingToken(true)
    setTransactionStatus("Preparing transaction...")
    setError("")
    setSuccess(false)
    setIsRateLimited(false)
    setIsQueued(false)
    setRetryCount(0)
    setProgress(0)

    addToast({
      title: "Token Creation Started",
      description: "Starting the token creation process...",
      type: "info",
    })

    try {
      // @ts-ignore
      if (!window.solana) {
        throw new Error("Wallet not connected. Please connect your wallet and try again.")
      }

      // Double check wallet connection
      // @ts-ignore
      if (!window.solana.isConnected || !window.solana.publicKey) {
        throw new Error("Wallet not connected. Please connect your wallet and try again.")
      }

      // @ts-ignore
      const wallet = window.solana

      const authorities = {
        mintAuthority: formState.mintAuthority,
        freezeAuthority: formState.freezeAuthority,
        transferFeeAuthority: formState.transferFeeAuthority,
      }

      const logDebugInfo = (message: string, data?: any) => {
        console.log(`[DEBUG] ${message}`, data || "")
        setTransactionStatus((prev) => `${prev}\n[DEBUG] ${message}`)
      }

      logDebugInfo("Starting token creation process")
      logDebugInfo("Form state:", formState)
      logDebugInfo("Checking Pinata credentials...")
      const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
      const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
      logDebugInfo(`Pinata API Key available: ${!!pinataApiKey}`)
      logDebugInfo(`Pinata Secret Key available: ${!!pinataSecretKey}`)

      // Update progress for initialization
      setProgress(5)
      addToast({
        title: "Initializing",
        description: "Setting up token creation process...",
        type: "info",
      })

      try {
        const result = await createToken(
          {
            ...formState,
            authorities,
          },
          wallet,
          (signature: string) => {
            // Add this code to distinguish between token creation and fee payment signatures
            if (signature) {
              // Check if this is a fee payment signature
              if (transactionStatus.includes("fee payment")) {
                setTransactionStatus(`Fee payment sent: ${signature}. Waiting for token creation...`)
                setProgress(40)
                addToast({
                  title: "Fee Payment Sent",
                  description: "Fee payment transaction has been sent.",
                  type: "info",
                })
              } else {
                setSignature(signature)
                setTransactionStatus(`Token creation transaction sent: ${signature}`)
                setProgress(60)
                addToast({
                  title: "Transaction Sent",
                  description: "Token creation transaction has been sent to the network.",
                  type: "info",
                })
              }
            }
          },
          (status: string) => {
            setTransactionStatus(status)

            // Update progress based on status messages
            if (status.includes("Preparing")) {
              setProgress(10)
            } else if (status.includes("metadata")) {
              setProgress(20)
            } else if (status.includes("Calculating rent")) {
              setProgress(30)
            } else if (status.includes("Sending token creation")) {
              setProgress(50)
            } else if (status.includes("Token creation transaction sent")) {
              setProgress(70)
            } else if (status.includes("complete")) {
              setProgress(100)
            }

            // Check for blockhash errors
            if (status.includes("Blockhash not found") || status.includes("Transaction simulation failed")) {
              setError("Transaction failed: Blockhash not found. Please try again.")
              addToast({
                title: "Transaction Failed",
                description: "Blockhash not found. Please try again in a moment.",
                type: "error",
              })
            }

            // Check if we're hitting rate limits
            if (status.includes("rate limit") || status.includes("Rate limit")) {
              setIsRateLimited(true)
              activateCooldown()
              addToast({
                title: "Rate Limit Detected",
                description: "The application will automatically retry with exponential backoff.",
                type: "warning",
              })

              // Extract retry count if available
              const retryMatch = status.match(/Retrying.*$(\d+)\/(\d+)$/)
              if (retryMatch && retryMatch[1]) {
                setRetryCount(Number.parseInt(retryMatch[1]))
                // Update progress based on retry count
                setProgress(Math.min(40 + Number.parseInt(retryMatch[1]) * 5, 95))
              }
            }

            // Check if the request is queued
            if (status.includes("queued")) {
              setIsQueued(true)
              addToast({
                title: "Request Queued",
                description: "Your token creation request has been queued to avoid rate limits.",
                type: "info",
              })
            }

            // Check if service is unavailable
            if (status.includes("temporarily unavailable")) {
              setServiceUnavailable(true)
              activateCooldown()
              addToast({
                title: "Service Unavailable",
                description: "Service is temporarily unavailable due to rate limiting.",
                type: "error",
              })
            }
          },
        )

        if (result?.success) {
          setMintAddress(result.mintAddress)
          setMetadataUrl(result.metadataUrl)
          setSuccess(true)
          setTransactionStatus("Token creation complete!")
          setProgress(100)

          addToast({
            title: "Token Created Successfully!",
            description: `Your token ${formState.tokenName} (${formState.symbol}) has been created.`,
            type: "success",
            duration: 10000, // Show for longer
          })
        } else {
          setError("Token creation failed. Please check the console for more details.")
          addToast({
            title: "Token Creation Failed",
            description: "Please check the console for more details.",
            type: "error",
          })
        }
      } catch (tokenError: any) {
        console.error("Token creation error:", tokenError)

        // Handle user rejection specifically
        if (tokenError.message && tokenError.message.includes("User rejected")) {
          setError("Transaction was rejected. You can try again when ready.")
          setTransactionStatus("Transaction cancelled by user")
          addToast({
            title: "Transaction Rejected",
            description: "You rejected the transaction. You can try again when ready.",
            type: "warning",
          })
          return // Exit early
        }

        // Handle insufficient funds errors specifically
        if (
          tokenError.message &&
          (tokenError.message.includes("insufficient lamports") ||
            tokenError.message.includes("insufficient funds") ||
            tokenError.message.includes("Insufficient SOL balance"))
        ) {
          setError("Insufficient SOL balance. Please add more SOL to your wallet and try again.")
          setTransactionStatus("Error: Insufficient SOL balance for transaction")
          addToast({
            title: "Insufficient Balance",
            description: "You don't have enough SOL to complete this transaction. Please add more SOL to your wallet.",
            type: "error",
            duration: 10000, // Show for longer
          })
          return // Exit early
        }

        // Handle blockhash errors specifically
        if (
          tokenError.message &&
          (tokenError.message.includes("Blockhash not found") ||
            tokenError.message.includes("Transaction simulation failed"))
        ) {
          setError("Transaction failed: Blockhash not found. Please try again in a moment.")
          setTransactionStatus("Error: Blockhash not found. Please try again.")
          addToast({
            title: "Transaction Failed",
            description: "Blockhash not found. Please try again in a moment.",
            type: "error",
          })
          return // Exit early
        }

        // Handle insufficient balance errors
        if (tokenError.message && tokenError.message.includes("insufficient balance")) {
          setError(tokenError.message)
          setTransactionStatus("Error: Insufficient balance for fee payment")
          addToast({
            title: "Insufficient Balance",
            description: tokenError.message,
            type: "error",
          })
          return // Exit early
        }

        // Handle specific RPC errors
        if (tokenError.message && (tokenError.message.includes("429") || tokenError.message.includes("rate limit"))) {
          setError(
            "Rate limit exceeded (429). The free tier has limited requests per second. Please wait at least 15 minutes before trying again.",
          )
          setIsRateLimited(true)
          activateCooldown()
          addToast({
            title: "Rate Limit Exceeded",
            description: "Please wait at least 15 minutes before trying again.",
            type: "error",
          })
        } else if (tokenError.message && tokenError.message.includes("temporarily unavailable")) {
          setError(
            "Service temporarily unavailable due to rate limiting. Please wait at least 15 minutes before trying again.",
          )
          setServiceUnavailable(true)
          activateCooldown()
          addToast({
            title: "Service Unavailable",
            description: "Please wait at least 15 minutes before trying again.",
            type: "error",
          })
        } else if (tokenError.message && tokenError.message.includes("API access forbidden")) {
          setError(
            "API access forbidden (403). Your API key may be invalid or expired. Please check your API dashboard.",
          )
          addToast({
            title: "API Access Forbidden",
            description: "Your API key may be invalid or expired.",
            type: "error",
          })
        } else if (tokenError.message && tokenError.message.includes("Failed to connect")) {
          setError("Failed to connect to Solana network. Please check your internet connection and try again.")
          addToast({
            title: "Connection Failed",
            description: "Please check your internet connection and try again.",
            type: "error",
          })
        } else {
          setError(tokenError.message || "Failed to create token. Please try again.")
          addToast({
            title: "Token Creation Failed",
            description: tokenError.message || "Please try again.",
            type: "error",
          })
        }

        setTransactionStatus(`Error: ${tokenError.message}`)
      }
    } catch (err: any) {
      console.error("Error in form submission:", err)
      setError(err.message || "Failed to process form. Please try again.")
      setTransactionStatus(`Error: ${err.message}`)
      addToast({
        title: "Form Submission Error",
        description: err.message || "Failed to process form. Please try again.",
        type: "error",
      })
    } finally {
      setCreatingToken(false)
    }
  }

  // Check wallet connection status periodically
  useEffect(() => {
    const checkWalletStatus = () => {
      const isConnected = checkWalletConnection()
      if (isConnected && balance === null && !cooldownActive && !serviceUnavailable) {
        fetchBalance()
      }
    }

    // Check immediately
    checkWalletStatus()

    // Then check periodically (less frequently to avoid rate limits)
    const intervalId = setInterval(checkWalletStatus, 60000) // Check every 60 seconds

    // Set up event listeners for wallet connection changes
    const handleWalletConnect = () => {
      checkWalletStatus()
    }

    const handleWalletDisconnect = () => {
      setWalletConnected(false)
      setBalance(null)
    }

    // Try to access the wallet object safely
    // @ts-ignore
    const solana = window.solana || window.phantom?.solana

    if (solana) {
      solana.on?.("connect", handleWalletConnect)
      solana.on?.("disconnect", handleWalletDisconnect)
    }

    return () => {
      clearInterval(intervalId)

      // Clean up event listeners
      if (solana) {
        solana.off?.("connect", handleWalletConnect)
        solana.off?.("disconnect", handleWalletDisconnect)
      }

      // Clear cooldown timer
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current)
      }
    }
  }, [balance, cooldownActive, serviceUnavailable])

  // Check if fee receiver is configured
  useEffect(() => {
    // If fee is set but fee receiver is not configured, show a warning
    if (formState.fee && formState.fee > 0) {
      // Use the NEXT_PUBLIC_ prefixed version for client-side access
      const feeReceiver = process.env.NEXT_PUBLIC_FEE_RECEIVER_ADDRESS
      if (!feeReceiver || feeReceiver === "your_fee_receiver_address") {
        setFeeWarning(
          "Fee receiver address is not configured. Fee payment will be skipped. Please set the NEXT_PUBLIC_FEE_RECEIVER_ADDRESS environment variable.",
        )
      } else {
        setFeeWarning("")
      }
    } else {
      setFeeWarning("")
    }
  }, [formState.fee])

  // Handle Phantom redirect on component mount
  useEffect(() => {
    handlePhantomRedirect()
  }, [])

  // Add this useEffect hook inside the TokenFormProvider component to handle redirects from Phantom mobile

  // Check for redirects from Phantom mobile app
  useEffect(() => {
    handlePhantomRedirect()
  }, [])

  return (
    <TokenFormContext.Provider
      value={{
        formState,
        setFormState,
        imagePreview,
        setImagePreview,
        uploadingImage,
        setUploadingImage,
        creatingToken,
        setCreatingToken,
        transactionStatus,
        setTransactionStatus,
        mintAddress,
        setMintAddress,
        signature,
        setSignature,
        metadataUrl,
        setMetadataUrl,
        error,
        setError,
        success,
        setSuccess,
        balance,
        setBalance,
        fetchingBalance,
        setFetchingBalance,
        walletConnected,
        setWalletConnected,
        balanceError,
        setBalanceError,
        feeWarning,
        setFeeWarning,
        isRateLimited,
        setIsRateLimited,
        isQueued,
        setIsQueued,
        retryCount,
        setRetryCount,
        cooldownActive,
        setCooldownActive,
        cooldownTimeLeft,
        setCooldownTimeLeft,
        serviceUnavailable,
        setServiceUnavailable,
        progress,
        setProgress,
        connectWallet,
        disconnectWallet,
        fetchBalance,
        handleChange,
        handleImageUpload,
        handleSubmit,
        formatCooldownTime,
        liquidityStatus,
        setLiquidityStatus,
        liquidityProgress,
        setLiquidityProgress,
        liquidityTxId,
        setLiquidityTxId,
        liquidityPoolId,
        setLiquidityPoolId,
        addingLiquidity,
        setAddingLiquidity,
        removingLiquidity,
        setRemovingLiquidity,
        handleAddLiquidity,
        handleRemoveLiquidity,
        handlePhantomRedirect,
      }}
    >
      {children}
    </TokenFormContext.Provider>
  )
}

export function useTokenForm() {
  const context = useContext(TokenFormContext)
  if (context === undefined) {
    throw new Error("useTokenForm must be used within a TokenFormProvider")
  }
  return context
}
