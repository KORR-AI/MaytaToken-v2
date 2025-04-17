"use client"

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js"
import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token"
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
  pack,
  type TokenMetadata,
} from "@solana/spl-token-metadata"
import { uploadMetadataToPinata } from "./pinata-service"

// Circuit breaker to track rate limit status
const circuitBreaker = {
  isOpen: false,
  failureCount: 0,
  lastFailureTime: 0,
  resetTimeout: 10 * 60 * 1000, // 10 minutes
  failureThreshold: 3,

  // Record a failure
  recordFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.failureCount >= this.failureThreshold) {
      this.isOpen = true
      console.log("Circuit breaker opened due to multiple failures")

      // Schedule auto-reset
      setTimeout(() => {
        this.reset()
      }, this.resetTimeout)
    }
  },

  // Reset the circuit breaker
  reset() {
    this.isOpen = false
    this.failureCount = 0
    console.log("Circuit breaker reset")
  },

  // Check if circuit is open
  isCircuitOpen() {
    // If it's been open for more than the reset timeout, auto-reset
    if (this.isOpen && Date.now() - this.lastFailureTime > this.resetTimeout) {
      this.reset()
    }
    return this.isOpen
  },
}

// Function to validate RPC URL format
function isValidRpcUrl(url: string | undefined): boolean {
  if (!url) return false
  return url.startsWith("http://") || url.startsWith("https://")
}

// Update the getValidRpcUrl function to use the QuickNode endpoint as primary

// Get a valid RPC URL, with fallback options
export function getValidRpcUrl(useFallback = false): string {
  // If circuit breaker is open or fallback is requested, use public RPC
  if (circuitBreaker.isCircuitOpen() || useFallback) {
    console.log(`Using public Solana RPC endpoint due to rate limits on primary endpoint`)
    return clusterApiUrl("mainnet-beta")
  }

  // For mainnet, use the existing logic
  const quickNodeUrl =
    "https://patient-maximum-morning.solana-mainnet.quiknode.pro/eae6e88ab89efa0fa9b863886ac8712a0c400141/"

  // Try to get the RPC URL from environment variables as fallback
  const envRpcUrl = process.env.NEXT_PUBLIC_RPC_URL

  // Use QuickNode endpoint first, then environment variable if available
  if (quickNodeUrl) {
    return quickNodeUrl
  } else if (isValidRpcUrl(envRpcUrl)) {
    return envRpcUrl as string
  }

  // Final fallback to hardcoded Alchemy URL
  const fallbackUrl = "https://solana-mainnet.g.alchemy.com/v2/5hFqSwkAoE9n4n0cb733mEY9qhwyvGJj"

  console.warn("Using fallback RPC URL. Please set a valid NEXT_PUBLIC_RPC_URL environment variable.")
  return fallbackUrl
}

// Function to validate Solana address format (base58)
function isValidSolanaAddress(address: string | undefined): boolean {
  if (!address) return false

  // Basic check for base58 characters (a-z, A-Z, 0-9 excluding 0, O, I, l)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/

  // Check length (Solana addresses are 32-44 characters)
  if (address.length < 32 || address.length > 44) {
    return false
  }

  return base58Regex.test(address)
}

// Sleep function for delays
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type TokenCreationParams = {
  tokenName: string
  symbol: string
  decimals: string
  supply: string
  image: string
  creatorName?: string
  siteName?: string
  socials?: Record<string, string>
  authorities: {
    mintAuthority: boolean
    freezeAuthority: boolean
    transferFeeAuthority: boolean
  }
  fee?: number
}

// Improved wallet connection check
const checkWalletConnection = (wallet: any): boolean => {
  if (!wallet) {
    console.error("Wallet object is undefined or null")
    return false
  }

  if (!wallet.isConnected) {
    console.error("Wallet is not connected")
    return false
  }

  if (!wallet.publicKey) {
    console.error("Wallet public key is not available")
    return false
  }

  return true
}

// Create a connection to Solana with retry logic and fallback
const createConnection = async (onStatus?: (status: string) => void): Promise<Connection> => {
  // Check if circuit breaker is open
  const usePublicRPC = circuitBreaker.isCircuitOpen()

  if (usePublicRPC) {
    onStatus?.(`Using public Solana RPC endpoint due to rate limits on primary endpoint...`)
  } else {
    onStatus?.(`Connecting to Solana...`)
  }

  // Get a valid RPC URL with fallback if needed
  const rpcUrl = getValidRpcUrl(usePublicRPC)
  console.log(`Using RPC URL:`, rpcUrl)

  // Use a longer timeout and disable automatic retries
  const connection = new Connection(rpcUrl, {
    commitment: "confirmed",
    disableRetryOnRateLimit: true, // We'll handle retries ourselves
    confirmTransactionInitialTimeout: 120000, // Increase timeout to 120 seconds
  })

  return connection
}

// Update the withRetry function to use even more aggressive backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 15, // Increased from 12 to 15
  onRetry?: (attempt: number, delay: number) => void,
  initialDelay = 8000, // Increased from 5000 to 8000
  maxDelay = 600000, // Increased from 300000 to 600000 (10 minutes)
): Promise<T> {
  let attempt = 0
  let useFallback = false

  while (true) {
    try {
      // Add a small delay before each attempt to avoid hitting rate limits
      if (attempt > 0) {
        await sleep(3000) // Increased from 2000 to 3000
      }

      return await fn()
    } catch (error: any) {
      attempt++

      // Check if it's a rate limit error (429)
      const isRateLimit =
        error.message &&
        (error.message.includes("429") ||
          error.message.includes("rate-limited") ||
          error.message.includes("Too many requests"))

      // If we've exceeded max retries or it's not a rate limit error, throw
      if (attempt >= maxRetries || !isRateLimit) {
        throw error
      }

      // Record the failure in the circuit breaker
      if (isRateLimit) {
        circuitBreaker.recordFailure()

        // Switch to fallback RPC after 3 attempts
        if (attempt >= 3 && !useFallback) {
          useFallback = true
          console.log("Switching to fallback RPC endpoint after multiple rate limit errors")
        }
      }

      // Calculate exponential backoff delay (with jitter)
      // More aggressive backoff: start with 8s, max out at 10 minutes
      const baseDelay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay)
      const jitter = Math.random() * 10000 // Add up to 10 seconds of jitter (increased from 5000)
      const delay = baseDelay + jitter

      console.log(`Rate limit hit. Retrying (${attempt}/${maxRetries}) after ${Math.round(delay / 1000)}s delay...`)

      if (onRetry) {
        onRetry(attempt, delay)
      }

      // Wait before retrying
      await sleep(delay)
    }
  }
}

// Parse and extract error details from Alchemy error responses
function parseAlchemyError(error: any): { code: number; message: string } {
  try {
    // Check if the error message contains a JSON string
    if (typeof error.message === "string") {
      // Try to find a JSON object in the error message
      const match = error.message.match(/\{.*\}/s)
      if (match) {
        const jsonStr = match[0]
        const parsedError = JSON.parse(jsonStr)

        if (parsedError.error && parsedError.error.code && parsedError.error.message) {
          return {
            code: parsedError.error.code,
            message: parsedError.error.message,
          }
        }
      }
    }

    // If we couldn't parse the error, return a default
    return {
      code: error.code || 0,
      message: error.message || "Unknown error",
    }
  } catch (e) {
    // If parsing fails, return the original error message
    return {
      code: 0,
      message: error.message || "Unknown error",
    }
  }
}

// Update the sendTransaction function to handle blockhash errors better
const sendTransaction = async (
  connection: Connection,
  transaction: Transaction,
  wallet: any,
  signers: Keypair[] = [],
  onSignature?: (signature: string) => void,
  onRetry?: (attempt: number, delay: number) => void,
  transactionName?: string,
): Promise<string> => {
  return withRetry(
    async () => {
      try {
        // Check wallet connection first
        if (!checkWalletConnection(wallet)) {
          throw new Error("Wallet not connected or public key not available")
        }

        // IMPORTANT: Get a fresh blockhash right before signing
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed")

        // Set the blockhash on the transaction
        transaction.recentBlockhash = blockhash
        transaction.lastValidBlockHeight = lastValidBlockHeight
        transaction.feePayer = wallet.publicKey

        // If we have additional signers, sign with them first
        if (signers.length > 0) {
          transaction.partialSign(...signers)
        }

        // Try to set a friendly name for the transaction if the wallet supports it
        try {
          if (transactionName && wallet.signAndSendTransaction) {
            // Some wallets like Phantom support this method with a description
            const signedTx = await wallet.signAndSendTransaction({
              transaction,
              description: transactionName,
              signers,
            })

            if (onSignature && signedTx.signature) {
              onSignature(signedTx.signature)
            }

            return signedTx.signature
          }
        } catch (nameError) {
          console.log("Wallet doesn't support named transactions, falling back to standard method")
        }

        // Use the proper signTransaction method
        const signedTransaction = await wallet.signTransaction(transaction)

        // Add a small delay before sending to avoid rate limits
        await sleep(5000) // Increased from 3000 to 5000

        // Send the transaction with specific commitment and preflight options
        const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
          skipPreflight: false,
          preflightCommitment: "confirmed",
          maxRetries: 3, // Add retries at the RPC level
        })

        console.log(`Transaction sent: ${signature}`)

        // Notify about the signature
        if (onSignature) {
          onSignature(signature)
        }

        // Wait for transaction confirmation to ensure it's processed
        try {
          await connection.confirmTransaction(
            {
              signature,
              blockhash,
              lastValidBlockHeight,
            },
            "confirmed",
          )
          console.log(`Transaction confirmed: ${signature}`)
        } catch (confirmError) {
          console.warn(`Transaction may not be confirmed: ${confirmError.message}`)
          // Continue anyway since the transaction might still be processing
        }

        return signature
      } catch (error: any) {
        console.error("Error sending transaction:", error)

        // Check for blockhash errors specifically
        if (
          error.message &&
          (error.message.includes("Blockhash not found") ||
            error.message.includes("block height exceeded") ||
            error.message.includes("invalid blockhash"))
        ) {
          console.log("Blockhash error detected, will retry with fresh blockhash")
          throw new Error(`Blockhash error: ${error.message}. Will retry with fresh blockhash.`)
        }

        // Try to parse the Alchemy error
        const alchemyError = parseAlchemyError(error)

        // Check if it's a rate limit error and format it nicely
        if (alchemyError.code === 429 || error.message.includes("429")) {
          throw new Error(`Rate limit exceeded (429). ${alchemyError.message}`)
        }

        throw error
      }
    },
    15, // More retries (15) with longer initial delay
    onRetry,
    8000, // Initial delay (8s)
    600000, // Max delay (10 min)
  )
}

// Queue system to prevent multiple token creation requests at once
let tokenCreationInProgress = false
const tokenCreationQueue: (() => void)[] = []

// Process the next item in the queue
const processNextInQueue = () => {
  if (tokenCreationQueue.length > 0 && !tokenCreationInProgress) {
    const nextItem = tokenCreationQueue.shift()
    if (nextItem) nextItem()
  }
}

// Update the createToken function to reduce metadata fields and add more delays
export const createToken = async (
  params: TokenCreationParams,
  wallet: any,
  onSignature?: (signature: string) => void,
  onStatus?: (status: string) => void,
): Promise<any> => {
  // Check if circuit breaker is open
  if (circuitBreaker.isCircuitOpen()) {
    throw new Error("Service temporarily unavailable due to rate limiting. Please try again in 10 minutes.")
  }

  // If a token creation is already in progress, add this request to the queue
  if (tokenCreationInProgress) {
    onStatus?.("Another token creation is in progress. Your request has been queued.")

    return new Promise((resolve, reject) => {
      tokenCreationQueue.push(() => {
        createToken(params, wallet, onSignature, onStatus).then(resolve).catch(reject)
      })
    })
  }

  tokenCreationInProgress = true

  try {
    // Enhanced wallet connection check
    if (!wallet) {
      throw new Error("Wallet not provided")
    }

    if (!wallet.isConnected) {
      throw new Error("Wallet not connected")
    }

    if (!wallet.publicKey) {
      throw new Error("Wallet public key not available")
    }

    console.log("Wallet connection verified:", wallet.isConnected)
    console.log("Wallet public key available:", !!wallet.publicKey)

    // Create connection to Solana
    onStatus?.(`Connecting to Solana...`)
    const connection = await createConnection(onStatus)

    const userPublicKey = wallet.publicKey
    console.log("Wallet public key:", userPublicKey.toString())

    const decimals = Number.parseInt(params.decimals)
    const totalSupply = Number.parseFloat(params.supply)

    // Add a delay before starting any operations
    await sleep(8000) // Increased from 5000 to 8000

    // Step 1: Upload metadata to Pinata
    onStatus?.("Preparing token metadata...")
    console.log("Preparing token metadata...")

    // Prepare additional metadata fields - keep it minimal
    const additionalMetadata: [string, string][] = []

    // Add creator name if provided (only include one field to minimize transaction size)
    if (params.creatorName) {
      additionalMetadata.push(["creator_name", params.creatorName])
    }

    // Create metadata JSON
    let imageUrl = params.image

    // Ensure image URL is fully qualified
    if (imageUrl.startsWith("/uploads/")) {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      imageUrl = `${baseUrl}${imageUrl}`
    }

    const metadata = {
      name: params.tokenName,
      symbol: params.symbol,
      description: `${params.tokenName} token created with MaytaToken Creator`,
      image: imageUrl,
      tokenStandard: "Fungible",
      attributes: [],
      properties: {
        files: [
          {
            uri: imageUrl,
            type: "image/png",
          },
        ],
        creators: [
          {
            address: userPublicKey.toString(),
            share: 100,
          },
        ],
      },
    }

    // Upload metadata to Pinata
    onStatus?.("Uploading metadata to IPFS...")
    console.log("Uploading metadata to IPFS...")
    let metadataUrl
    try {
      // Use our server-side API for metadata upload
      metadataUrl = await uploadMetadataToPinata(metadata)
      console.log("Metadata uploaded to IPFS:", metadataUrl)
    } catch (error) {
      console.warn("Failed to upload metadata to IPFS:", error)
      // Continue without metadata if upload fails
      metadataUrl = ""
    }

    // Add a longer delay after metadata upload to avoid rate limits
    await sleep(10000) // Increased from 8000 to 10000

    // Step 2: Create a single transaction for all operations
    onStatus?.("Preparing token creation transaction...")
    console.log("Preparing token creation transaction...")

    // Generate new keypair for Mint Account
    const mintKeypair = Keypair.generate()
    const mint = mintKeypair.publicKey

    // Metadata to store in Mint Account - keep it minimal
    const tokenMetadata: TokenMetadata = {
      updateAuthority: userPublicKey,
      mint: mint,
      name: params.tokenName,
      symbol: params.symbol,
      uri: metadataUrl || "",
      additionalMetadata: additionalMetadata,
    }

    // Size of MetadataExtension 2 bytes for type, 2 bytes for length
    const metadataExtension = TYPE_SIZE + LENGTH_SIZE
    // Size of metadata
    const metadataLen = pack(tokenMetadata).length

    // Size of Mint Account with extension
    const mintLen = getMintLen([ExtensionType.MetadataPointer])

    try {
      // Minimum lamports required for Mint Account
      onStatus?.("Calculating rent exemption (this may take a moment)...")
      const lamports = await withRetry(
        () => connection.getMinimumBalanceForRentExemption(mintLen + metadataExtension + metadataLen),
        5, // More retries for this operation
        (attempt, delay) => {
          onStatus?.(`Rate limit hit. Retrying rent calculation (${attempt}/5) after ${Math.round(delay / 1000)}s...`)
        },
        8000, // Longer initial delay (increased from 5000 to 8000)
        120000, // Max delay 2 minutes
      )

      // Add a delay after rent calculation
      await sleep(8000) // Increased from 5000 to 8000

      // Create a single transaction for all operations
      const transaction = new Transaction()

      // Add fee instruction if needed
      if (params.fee && params.fee > 0) {
        try {
          onStatus?.(`Including fee payment (${params.fee.toFixed(3)} SOL) in transaction...`)

          // Get fee receiver address from environment variable
          const feeReceiverAddress = process.env.NEXT_PUBLIC_FEE_RECEIVER_ADDRESS || process.env.FEE_RECEIVER_ADDRESS

          // Validate fee receiver address
          if (
            feeReceiverAddress &&
            isValidSolanaAddress(feeReceiverAddress) &&
            feeReceiverAddress !== "your_fee_receiver_address"
          ) {
            try {
              // Create a PublicKey from the address
              const feeReceiverPublicKey = new PublicKey(feeReceiverAddress)
              const lamports = Math.floor(params.fee * LAMPORTS_PER_SOL)

              // Create the fee instruction to be included in the main transaction
              const feeInstruction = SystemProgram.transfer({
                fromPubkey: userPublicKey,
                toPubkey: feeReceiverPublicKey,
                lamports,
              })

              // Add fee instruction first
              transaction.add(feeInstruction)
            } catch (error) {
              console.error("Error creating fee instruction:", error)
            }
          } else {
            console.warn("Invalid fee receiver address. Fee payment will be skipped.")
          }
        } catch (error) {
          console.warn("Error preparing fee payment:", error)
        }
      }

      // 1. Create mint account instruction
      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: userPublicKey,
        newAccountPubkey: mint,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      })
      transaction.add(createAccountInstruction)

      // 2. Initialize metadata pointer instruction
      const initializeMetadataPointerInstruction = createInitializeMetadataPointerInstruction(
        mint,
        userPublicKey,
        mint,
        TOKEN_2022_PROGRAM_ID,
      )
      transaction.add(initializeMetadataPointerInstruction)

      // 3. Initialize mint instruction
      const initializeMintInstruction = createInitializeMintInstruction(
        mint,
        decimals,
        userPublicKey,
        params.authorities.freezeAuthority ? userPublicKey : null,
        TOKEN_2022_PROGRAM_ID,
      )
      transaction.add(initializeMintInstruction)

      // 4. Initialize metadata instruction
      const initializeMetadataInstruction = createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        metadata: mint,
        updateAuthority: userPublicKey,
        mint: mint,
        mintAuthority: userPublicKey,
        name: tokenMetadata.name,
        symbol: tokenMetadata.symbol,
        uri: tokenMetadata.uri,
      })
      transaction.add(initializeMetadataInstruction)

      // 5. Add metadata fields instructions - limit to just 1 field
      const maxMetadataFields = 1 // Reduced from 2 to 1
      const trimmedMetadata = tokenMetadata.additionalMetadata.slice(0, maxMetadataFields)

      trimmedMetadata.forEach(([key, value]) => {
        const updateFieldInstruction = createUpdateFieldInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          metadata: mint,
          updateAuthority: userPublicKey,
          field: key,
          value: value,
        })
        transaction.add(updateFieldInstruction)
      })

      // 6. Get the associated token address
      const associatedTokenAddress = await getAssociatedTokenAddress(mint, userPublicKey, false, TOKEN_2022_PROGRAM_ID)

      // 7. Create associated token account instruction
      const createAssociatedTokenAccountIx = createAssociatedTokenAccountInstruction(
        userPublicKey,
        associatedTokenAddress,
        userPublicKey,
        mint,
        TOKEN_2022_PROGRAM_ID,
      )
      transaction.add(createAssociatedTokenAccountIx)

      // 8. Mint tokens instruction
      const mintAmount = totalSupply * Math.pow(10, decimals)
      const mintToIx = createMintToInstruction(
        mint,
        associatedTokenAddress,
        userPublicKey,
        BigInt(mintAmount),
        [],
        TOKEN_2022_PROGRAM_ID,
      )
      transaction.add(mintToIx)

      // Send the transaction with all instructions
      onStatus?.("Sending token creation transaction...")
      console.log("Sending token creation transaction with all operations...")

      // Create a descriptive name for the transaction that includes token supply
      const transactionName = `Create ${params.tokenName} (${params.symbol}) with ${params.supply} supply`

      // Send the transaction with the mint keypair as a signer
      const signature = await sendTransaction(
        connection,
        transaction,
        wallet,
        [mintKeypair],
        onSignature,
        (attempt, delay) => {
          onStatus?.(`Rate limit hit. Retrying transaction (${attempt}/15) after ${Math.round(delay / 1000)}s...`)
        },
        transactionName,
      )

      console.log("Token created with signature:", signature)

      onStatus?.("Token creation complete!")
      return {
        success: true,
        mintAddress: mint.toString(),
        signature: signature,
        metadataUrl: metadataUrl,
      }
    } catch (error: any) {
      // Try to parse the Alchemy error
      const alchemyError = parseAlchemyError(error)

      // Check for RPC-specific errors
      if (alchemyError.code === 429 || error.message.includes("429")) {
        console.error(`Rate limit exceeded (429): ${alchemyError.message}`)
        circuitBreaker.recordFailure() // Record the failure in the circuit breaker
        throw new Error(`Rate limit exceeded. Please try again in a few minutes. Details: ${alchemyError.message}`)
      } else if (alchemyError.code === 403 || error.message.includes("403")) {
        console.error(`RPC access forbidden (403): ${alchemyError.message}`)
        throw new Error(`API access forbidden. Please check your API key or try again later.`)
      } else if (error.message && error.message.includes("Blockhash not found")) {
        console.error("Blockhash not found error:", error)
        throw new Error("Transaction failed: Blockhash not found. Please try again in a moment.")
      } else if (error.message && error.message.includes("Transaction simulation failed")) {
        console.error("Transaction simulation failed:", error)
        throw new Error(`Transaction simulation failed: ${error.message}. Please try again.`)
      }

      throw error
    }
  } catch (error: any) {
    console.error("Error creating token:", error)
    throw new Error(error.message || "Failed to create token")
  } finally {
    // Mark token creation as no longer in progress
    tokenCreationInProgress = false

    // Process the next item in the queue if any
    setTimeout(processNextInQueue, 20000) // Wait 20 seconds before processing the next request (increased from 15000)
  }
}
