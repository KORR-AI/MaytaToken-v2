"use client"

// Utility functions for interacting with Pinata IPFS

// Function to get Pinata API keys from localStorage
export function getPinataKeys() {
  if (typeof window === "undefined") return null

  // Check for both naming conventions to ensure compatibility
  const apiKey = localStorage.getItem("pinataApiKey") || localStorage.getItem("pinata_api_key")
  const apiSecret = localStorage.getItem("pinataApiSecret") || localStorage.getItem("pinata_secret_key")

  if (!apiKey || !apiSecret || apiKey.length < 10 || apiSecret.length < 10) return null

  return { apiKey, apiSecret }
}

// Function to upload metadata to Pinata
export async function uploadMetadataToPinata(metadata: any) {
  try {
    console.log("Preparing to upload metadata to IPFS...")

    // Try to get client-side Pinata keys first
    const clientKeys = getPinataKeys()

    if (clientKeys) {
      console.log("Found Pinata API keys in localStorage, attempting direct upload")

      try {
        // Test the keys first to avoid unnecessary attempts
        const testResponse = await fetch("https://api.pinata.cloud/data/testAuthentication", {
          method: "GET",
          headers: {
            pinata_api_key: clientKeys.apiKey,
            pinata_secret_api_key: clientKeys.apiSecret,
          },
        })

        if (testResponse.ok) {
          console.log("Pinata API keys are valid, proceeding with direct upload")

          // Direct upload to Pinata using client keys
          const directResponse = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              pinata_api_key: clientKeys.apiKey,
              pinata_secret_api_key: clientKeys.apiSecret,
            },
            body: JSON.stringify(metadata),
          })

          if (directResponse.ok) {
            const data = await directResponse.json()
            console.log("✅ Direct Pinata upload successful:", data.IpfsHash)
            return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
          } else {
            const errorText = await directResponse.text()
            console.error("❌ Direct Pinata upload failed:", errorText)
            // Continue to server-side upload
          }
        } else {
          console.warn("Pinata API keys are invalid, falling back to server-side upload")
        }
      } catch (directError) {
        console.error("Error with direct Pinata upload:", directError)
        // Continue to server-side upload
      }
    } else {
      console.log("No valid Pinata API keys found in localStorage")
    }

    // Fall back to server-side upload
    console.log("Attempting server-side metadata upload...")

    // Try server-side upload with client keys if available
    const body: any = { metadata }
    if (clientKeys) {
      body.pinataApiKey = clientKeys.apiKey
      body.pinataApiSecret = clientKeys.apiSecret
    }

    const response = await fetch("/api/metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error uploading to Pinata via server:", errorText)
      throw new Error(`Pinata API error: ${errorText}`)
    }

    const data = await response.json()

    if (data.error) {
      console.error("Error from metadata API:", data.error)
      throw new Error(`Error uploading to Pinata: ${data.error}`)
    }

    console.log("Metadata uploaded successfully:", data.url)
    return data.url
  } catch (error: any) {
    console.error("Error in uploadMetadataToPinata:", error)

    // Create a local fallback URL for metadata
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2)
    const fileName = `${uniqueId}-metadata.json`

    // Try to save metadata locally
    try {
      console.log("Attempting to save metadata locally as fallback...")

      const localResponse = await fetch("/api/local-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: JSON.stringify(metadata, null, 2),
          fileName,
          contentType: "application/json",
        }),
      })

      if (localResponse.ok) {
        const localData = await localResponse.json()
        console.log("Metadata saved locally:", localData.localUrl)
        return localData.localUrl
      }
    } catch (localError) {
      console.error("Error saving metadata locally:", localError)
    }

    // If all else fails, return a client-side generated URL
    console.log("Using emergency fallback for metadata URL")
    const fallbackUrl = `/uploads/${fileName}`
    return fallbackUrl
  }
}

// Function to upload image to Pinata
export async function uploadImageToPinata(imageFile: File | Blob, fileName: string): Promise<string> {
  try {
    console.log("Preparing to upload image to IPFS...")

    // Try to get client-side Pinata keys first
    const clientKeys = getPinataKeys()

    if (!clientKeys) {
      throw new Error("No Pinata API keys found")
    }

    console.log("Found Pinata API keys in localStorage, attempting direct image upload")

    // Test the keys first
    const testResponse = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      method: "GET",
      headers: {
        pinata_api_key: clientKeys.apiKey,
        pinata_secret_api_key: clientKeys.apiSecret,
      },
    })

    if (!testResponse.ok) {
      throw new Error("Pinata API keys are invalid")
    }

    console.log("Pinata API keys are valid, proceeding with direct image upload")

    // Create a FormData object for the image
    const formData = new FormData()
    formData.append("file", imageFile, fileName)

    // Add the pinata metadata
    const metadata = JSON.stringify({
      name: fileName,
    })
    formData.append("pinataMetadata", metadata)

    // Add the pinata options
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append("pinataOptions", options)

    // Upload to Pinata
    const directResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: clientKeys.apiKey,
        pinata_secret_api_key: clientKeys.apiSecret,
      },
      body: formData,
    })

    if (!directResponse.ok) {
      const errorText = await directResponse.text()
      console.error("❌ Direct Pinata image upload failed:", errorText)
      throw new Error(`Pinata upload failed: ${errorText}`)
    }

    const data = await directResponse.json()
    console.log("✅ Direct Pinata image upload successful:", data.IpfsHash)
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
  } catch (error: any) {
    console.error("Error in uploadImageToPinata:", error)
    throw error
  }
}

// Function to test Pinata API keys
export async function testPinataConnection(apiKey: string, apiSecret: string) {
  try {
    console.log("Testing Pinata API connection...")

    const response = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      method: "GET",
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    })

    if (response.ok) {
      console.log("Pinata API connection test successful")
      return { success: true }
    } else {
      const errorData = await response.json()
      console.error("Pinata API connection test failed:", errorData)
      return {
        success: false,
        error: errorData.error?.reason || "Authentication failed",
      }
    }
  } catch (error: any) {
    console.error("Error testing Pinata connection:", error)
    return {
      success: false,
      error: error.message || "Connection failed",
    }
  }
}
