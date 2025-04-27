// Function to get Pinata API keys from localStorage
export function getPinataKeys() {
  if (typeof window === "undefined") return null

  const apiKey = localStorage.getItem("pinataApiKey")
  const apiSecret = localStorage.getItem("pinataApiSecret")

  if (!apiKey || !apiSecret) return null

  return { apiKey, apiSecret }
}

// Function to upload metadata to Pinata
export async function uploadMetadataToPinata(metadata: any) {
  try {
    console.log("Uploading metadata...")

    // Try to get client-side Pinata keys first
    const clientKeys = getPinataKeys()

    if (clientKeys) {
      console.log("Using client-side Pinata keys")

      // Try direct upload to Pinata using client keys
      try {
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
          console.log("Direct Pinata upload successful:", data)
          return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
        } else {
          console.error("Direct Pinata upload failed:", await directResponse.text())
          throw new Error("Direct Pinata upload failed")
        }
      } catch (directError) {
        console.error("Error with direct Pinata upload:", directError)
        // Fall through to server-side upload
      }
    }

    // Fall back to server-side upload
    console.log("Falling back to server-side upload")

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
      console.error("Error uploading to Pinata:", errorText)
      throw new Error(`Pinata API error: ${errorText}`)
    }

    const data = await response.json()

    if (data.error) {
      console.error("Error uploading to Pinata:", data.error)
      throw new Error(`Error uploading to Pinata: ${data.error}`)
    }

    console.log("Metadata uploaded to IPFS:", data.url)
    return data.url
  } catch (error: any) {
    console.error("Error uploading metadata:", error)

    // Create a local fallback URL for metadata
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2)
    const localUrl = `/uploads/${uniqueId}-metadata.json`

    // Store metadata locally
    try {
      const localResponse = await fetch("/api/local-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: JSON.stringify(metadata, null, 2),
          fileName: `${uniqueId}-metadata.json`,
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
    // This will be used as a fallback in the token creation process
    console.log("Using emergency fallback for metadata URL")
    const fallbackUrl = `/uploads/${uniqueId}-metadata.json`
    return fallbackUrl
  }
}

// Function to test Pinata API keys
export async function testPinataConnection(apiKey: string, apiSecret: string) {
  try {
    const response = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      method: "GET",
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    })

    if (response.ok) {
      return { success: true }
    } else {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error?.reason || "Authentication failed",
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Connection failed",
    }
  }
}
