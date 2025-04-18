// Utility functions for storing and retrieving token data

export interface StoredToken {
  id: string
  name: string
  symbol: string
  mintAddress: string
  image?: string
  createdAt: string
  supply: string
  decimals: string
}

// Save a token to localStorage
export function saveToken(token: StoredToken): void {
  if (typeof window === "undefined") return

  try {
    // Get existing tokens
    const existingTokensJson = localStorage.getItem("createdTokens")
    const existingTokens: StoredToken[] = existingTokensJson ? JSON.parse(existingTokensJson) : []

    // Check if token with this mintAddress already exists
    const tokenExists = existingTokens.some((t) => t.mintAddress === token.mintAddress)

    if (!tokenExists) {
      // Add new token to the array
      const updatedTokens = [token, ...existingTokens]

      // Save back to localStorage
      localStorage.setItem("createdTokens", JSON.stringify(updatedTokens))
    }
  } catch (error) {
    console.error("Error saving token to localStorage:", error)
  }
}

// Get all tokens from localStorage
export function getAllTokens(): StoredToken[] {
  if (typeof window === "undefined") return []

  try {
    const tokensJson = localStorage.getItem("createdTokens")
    return tokensJson ? JSON.parse(tokensJson) : []
  } catch (error) {
    console.error("Error retrieving tokens from localStorage:", error)
    return []
  }
}

// Clear all tokens (for testing)
export function clearAllTokens(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem("createdTokens")
  } catch (error) {
    console.error("Error clearing tokens from localStorage:", error)
  }
}

// Get a token by mintAddress
export function getTokenByMintAddress(mintAddress: string): StoredToken | null {
  if (typeof window === "undefined") return null

  try {
    const tokens = getAllTokens()
    return tokens.find((token) => token.mintAddress === mintAddress) || null
  } catch (error) {
    console.error("Error retrieving token by mintAddress:", error)
    return null
  }
}
