import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"
import { randomUUID } from "crypto"

// Function to save metadata locally (fallback when Pinata keys are not available)
async function saveMetadataLocally(metadata: any): Promise<string> {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public/uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (err) {
      console.log("Directory already exists or cannot be created")
    }

    // Generate a unique filename with UUID
    const uniqueId = randomUUID()
    const uniqueFilename = `${uniqueId}-metadata.json`
    const filePath = join(uploadsDir, uniqueFilename)

    // Write metadata to disk with proper formatting
    await writeFile(filePath, JSON.stringify(metadata, null, 2))

    // Return the unique ID for reference
    return uniqueId
  } catch (error) {
    console.error("Error saving metadata locally:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the JSON data from the request
    const metadata = await request.json()

    if (!metadata) {
      return NextResponse.json({ error: "No metadata provided" }, { status: 400 })
    }

    // Validate metadata structure
    if (!metadata.name || !metadata.symbol) {
      return NextResponse.json({ error: "Invalid metadata: missing required fields" }, { status: 400 })
    }

    // Try to use Pinata if API keys are available
    const pinataApiKey = process.env.PINATA_API_KEY
    const pinataSecretKey = process.env.PINATA_SECRET_KEY

    if (pinataApiKey && pinataSecretKey) {
      try {
        // Prepare headers for Pinata
        const headers = {
          "Content-Type": "application/json",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretKey,
        }

        // Make request to Pinata API
        const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
          method: "POST",
          headers,
          body: JSON.stringify(metadata),
        })

        // Check if the response is OK
        if (!response.ok) {
          const errorText = await response.text()
          console.error("Pinata API error response:", errorText)
          throw new Error(`Pinata API error: ${errorText}`)
        }

        // Parse the response
        const data = await response.json()

        // Return the IPFS hash
        return NextResponse.json({
          url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
          ipfsHash: data.IpfsHash,
          isDevelopmentFallback: false,
        })
      } catch (error: any) {
        console.error("Error uploading to Pinata:", error)
        // Fall back to local storage
        console.log("Falling back to local storage...")
      }
    }

    // Use local storage as fallback
    const uniqueId = await saveMetadataLocally(metadata)
    console.log("Metadata saved locally with ID:", uniqueId)

    // Get the base URL from environment or use a default
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""
    const localUrl = `/uploads/${uniqueId}-metadata.json`

    return NextResponse.json({
      url: `${baseUrl}${localUrl}`,
      ipfsHash: `local://${uniqueId}`,
      isDevelopmentFallback: true,
    })
  } catch (error: any) {
    console.error("Error handling metadata:", error)
    return NextResponse.json(
      {
        error: `Error handling metadata upload: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
