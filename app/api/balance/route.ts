import { type NextRequest, NextResponse } from "next/server"
import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"

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
function getValidRpcUrl(useFallback = false): string {
  // If circuit breaker is open or fallback is requested, use public RPC
  if (circuitBreaker.isCircuitOpen() || useFallback) {
    console.log("Using public Solana RPC endpoint due to rate limits on primary endpoint")
    return clusterApiUrl("mainnet-beta")
  }

  // Use the QuickNode endpoint as primary
  const quickNodeUrl =
    "https://patient-maximum-morning.solana-mainnet.quiknode.pro/eae6e88ab89efa0fa9b863886ac8712a0c400141/"

  // Try to get the RPC URL from environment variables as fallback
  const envRpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL

  // Use QuickNode endpoint first, then environment variable if available
  if (quickNodeUrl) {
    return quickNodeUrl
  } else if (isValidRpcUrl(envRpcUrl)) {
    return envRpcUrl as string
  }

  // Final fallback to hardcoded Alchemy URL
  const fallbackUrl = "https://solana-mainnet.g.alchemy.com/v2/5hFqSwkAoE9n4n0cb733mEY9qhwyvGJj"

  console.warn("Using fallback RPC URL. Please set a valid RPC_URL environment variable.")
  return fallbackUrl
}

// Sleep function for delays
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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

// Function to execute with retry logic for rate limit errors
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 12, // Increased from 10 to 12
  baseDelay = 8000, // Increased from 5000 to 8000
  maxDelay = 180000, // 3 minutes max delay (increased from 120000)
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

      // Try to parse the Alchemy error
      const alchemyError = parseAlchemyError(error)

      // Check if it's a rate limit error (429)
      const isRateLimit =
        alchemyError.code === 429 ||
        error.message.includes("429") ||
        error.message.includes("rate-limited") ||
        error.message.includes("Too many requests")

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
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
      const jitter = Math.random() * 5000 // Add up to 5 seconds of jitter (increased from 3000)
      const totalDelay = delay + jitter

      console.log(
        `Rate limit hit. Retrying (${attempt}/${maxRetries}) after ${Math.round(totalDelay / 1000)}s delay...`,
      )

      // Wait before retrying
      await sleep(totalDelay)
    }
  }
}

// Queue system to prevent multiple balance requests at once
let balanceRequestInProgress = false
const balanceRequestQueue: (() => void)[] = []

// Process the next item in the queue
const processNextInQueue = () => {
  if (balanceRequestQueue.length > 0 && !balanceRequestInProgress) {
    const nextItem = balanceRequestQueue.shift()
    if (nextItem) nextItem()
  }
}

// Update the POST function to add more delays and use circuit breaker
export async function POST(request: NextRequest) {
  // Check if circuit breaker is open
  if (circuitBreaker.isCircuitOpen()) {
    return NextResponse.json(
      {
        error: "Service temporarily unavailable due to rate limiting. Please try again in 10 minutes.",
        balance: 0,
        lamports: 0,
        rateLimited: true,
        network: "mainnet",
      },
      { status: 200 }, // Return 200 so the UI can handle it gracefully
    )
  }

  // If a balance request is already in progress, add this request to the queue
  if (balanceRequestInProgress) {
    console.log("Another balance request is in progress. Queuing this request.")

    return new Promise<Response>((resolve) => {
      balanceRequestQueue.push(async () => {
        const response = await POST(request)
        resolve(response)
      })
    })
  }

  balanceRequestInProgress = true
  const useFallback = false

  try {
    // Add a small delay before processing to avoid rate limits
    await sleep(3000) // Increased from 2000 to 3000

    // Get the request body
    const body = await request.json()
    const { publicKey } = body

    if (!publicKey) {
      balanceRequestInProgress = false
      setTimeout(processNextInQueue, 5000) // Increased from 3000 to 5000
      return NextResponse.json({ error: "Public key is required" }, { status: 400 })
    }

    // Get a valid RPC URL
    const rpcUrl = getValidRpcUrl(useFallback)
    console.log("Using RPC URL for balance check:", rpcUrl)

    try {
      // Create a connection to the Solana cluster with timeout
      const connection = new Connection(rpcUrl, {
        commitment: "confirmed",
        disableRetryOnRateLimit: true, // We'll handle retries ourselves
        confirmTransactionInitialTimeout: 60000, // Longer timeout
      })

      // Convert the public key string to a PublicKey object
      const pubKey = new PublicKey(publicKey)

      // Get the balance with retry logic
      const balance = await withRetry(
        () => connection.getBalance(pubKey),
        12, // Max 12 retries (increased from 10)
        8000, // Start with 8 second delay (increased from 5000)
        180000, // Max 3 minute delay (increased from 120000)
      )

      // Return the balance in SOL
      balanceRequestInProgress = false
      setTimeout(processNextInQueue, 8000) // Wait 8 seconds before processing the next request (increased from 5000)

      return NextResponse.json({
        balance: balance / LAMPORTS_PER_SOL,
        lamports: balance,
        network: "mainnet", // Always mainnet
      })
    } catch (error: any) {
      console.error("Error fetching balance:", error)

      // Try to parse the Alchemy error
      const alchemyError = parseAlchemyError(error)

      // Check for rate limit errors
      if (alchemyError.code === 429 || error.message.includes("429")) {
        circuitBreaker.recordFailure() // Record the failure in the circuit breaker

        balanceRequestInProgress = false
        setTimeout(processNextInQueue, 20000) // Wait 20 seconds before processing the next request (increased from 15000)

        return NextResponse.json(
          {
            error: `Rate limit exceeded. Please try again in a moment. Details: ${alchemyError.message}`,
            balance: 0,
            lamports: 0,
            rateLimited: true,
            network: "mainnet",
          },
          { status: 200 }, // Return 200 so the UI can handle it gracefully
        )
      }

      // Return a more user-friendly error message
      balanceRequestInProgress = false
      setTimeout(processNextInQueue, 8000) // Wait 8 seconds before processing the next request (increased from 5000)

      return NextResponse.json(
        {
          error: `Error fetching balance: ${error.message}`,
          // Return a default balance of 0 so the UI can still function
          balance: 0,
          lamports: 0,
          fallback: true,
          network: "mainnet", // Always mainnet
        },
        { status: 200 }, // Return 200 even on error so the UI can handle it gracefully
      )
    }
  } catch (error: any) {
    console.error("Error processing balance request:", error)

    balanceRequestInProgress = false
    setTimeout(processNextInQueue, 8000) // Increased from 5000 to 8000

    return NextResponse.json(
      {
        error: `Error processing request: ${error.message}`,
        balance: 0,
        lamports: 0,
        fallback: true,
        network: "mainnet",
      },
      { status: 200 },
    )
  }
}
