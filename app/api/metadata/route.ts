import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const metadata = body.metadata || body
    const pinataApiKey = body.pinataApiKey || process.env.PINATA_API_KEY
    const pinataApiSecret = body.pinataApiSecret || process.env.PINATA_SECRET_KEY

    // Validate metadata
    if (!metadata) {
      return NextResponse.json({ success: false, error: "No metadata provided" }, { status: 400 })
    }

    // Log key availability (not the actual keys)
    console.log("Pinata API key available:", !!pinataApiKey)
    console.log("Pinata API secret available:", !!pinataApiSecret)

    // Check if we have valid Pinata credentials
    const hasValidKeys =
      pinataApiKey &&
      pinataApiSecret &&
      pinataApiKey !== "your_pinata_api_key" &&
      pinataApiSecret !== "your_pinata_secret_key" &&
      pinataApiKey.length > 10 &&
      pinataApiSecret.length > 10

    if (hasValidKeys) {
      try {
        console.log("Attempting to upload to Pinata IPFS...")

        // Test the keys first
        const testResponse = await fetch("https://api.pinata.cloud/data/testAuthentication", {
          method: "GET",
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataApiSecret,
          },
        })

        if (!testResponse.ok) {
          console.warn("Pinata API keys are invalid:", await testResponse.text())
          throw new Error("Invalid Pinata API keys")
        }

        // Upload to Pinata
        const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataApiSecret,
          },
          body: JSON.stringify(metadata),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Pinata API error response:", errorText)
          throw new Error(`Pinata API error: ${errorText}`)
        }

        const data = await response.json()
        const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`

        console.log("Successfully uploaded to IPFS:", ipfsUrl)
        return NextResponse.json({
          success: true,
          url: ipfsUrl,
          ipfsHash: data.IpfsHash,
          provider: "pinata",
        })
      } catch (pinataError) {
        console.error("Error uploading to Pinata:", pinataError)
        // Fall through to local storage
      }
    } else {
      console.log("No valid Pinata API keys provided, using local storage")
    }

    // Fallback to local storage
    const metadataId = uuidv4()
    const fileName = `${metadataId}-metadata.json`
    const uploadsDir = path.join(process.cwd(), "public", "uploads")

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const filePath = path.join(uploadsDir, fileName)
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2))

    console.log("Metadata saved locally with ID:", metadataId)

    // Return the URL to the locally stored metadata
    const localUrl = `/uploads/${fileName}`
    return NextResponse.json({
      success: true,
      url: localUrl,
      localId: metadataId,
      provider: "local",
    })
  } catch (error: any) {
    console.error("Error in metadata API route:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred",
      },
      { status: 500 },
    )
  }
}
