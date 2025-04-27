import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    const { metadata, pinataApiKey, pinataApiSecret } = await request.json()

    // Check if we have Pinata API keys (either from environment or client)
    const apiKey = pinataApiKey || process.env.PINATA_API_KEY
    const apiSecret = pinataApiSecret || process.env.PINATA_SECRET_KEY

    // Log key availability (not the actual keys)
    console.log("Pinata API key available:", !!apiKey)
    console.log("Pinata API secret available:", !!apiSecret)

    // If we have valid Pinata credentials, try to upload to IPFS
    if (apiKey && apiSecret && apiKey !== "your_pinata_api_key" && apiSecret !== "your_pinata_secret_key") {
      try {
        console.log("Attempting to upload to Pinata IPFS...")

        const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: apiKey,
            pinata_secret_api_key: apiSecret,
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
        return NextResponse.json({ success: true, url: ipfsUrl })
      } catch (pinataError) {
        console.error("Error uploading to Pinata:", pinataError)
        // Fall through to local storage
      }
    } else {
      console.log("Pinata API keys not configured, using local storage")
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
    return NextResponse.json({ success: true, url: localUrl })
  } catch (error: any) {
    console.error("Error in metadata API route:", error)
    return NextResponse.json({ success: false, error: error.message || "An error occurred" }, { status: 500 })
  }
}
