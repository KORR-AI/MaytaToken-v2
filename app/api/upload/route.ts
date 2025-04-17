import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"
import { randomUUID } from "crypto"

// Function to save file locally (fallback when Pinata keys are not available)
async function saveFileLocally(file: File): Promise<string> {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public/uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (err) {
      console.log("Directory already exists or cannot be created")
    }

    // Generate a unique filename
    const uniqueFilename = `${randomUUID()}-${file.name}`
    const filePath = join(uploadsDir, uniqueFilename)

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Write file to disk
    await writeFile(filePath, buffer)

    // Return the public URL
    return `/uploads/${uniqueFilename}`
  } catch (error) {
    console.error("Error saving file locally:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check if Pinata API keys are available
    const pinataApiKey = process.env.PINATA_API_KEY
    const pinataSecretKey = process.env.PINATA_SECRET_KEY

    // If Pinata keys are available, try to use Pinata
    if (pinataApiKey && pinataSecretKey) {
      try {
        // Create a FormData object for Pinata
        const pinataFormData = new FormData()
        pinataFormData.append("file", file)

        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
          method: "POST",
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretKey,
          },
          body: pinataFormData,
        })

        if (!response.ok) {
          throw new Error(`Pinata API error: ${response.statusText}`)
        }

        const data = await response.json()
        return NextResponse.json({
          IpfsHash: data.IpfsHash,
          PinSize: data.PinSize,
          Timestamp: data.Timestamp,
          isDevelopmentFallback: false,
        })
      } catch (error) {
        console.error("Error uploading to Pinata:", error)
        // Fall back to local storage if Pinata upload fails
      }
    }

    // Use local storage fallback
    const localFilePath = await saveFileLocally(file)

    return NextResponse.json({
      IpfsHash: "local", // Indicate this is a local file
      PinSize: file.size,
      Timestamp: new Date().toISOString(),
      isDevelopmentFallback: true,
      localUrl: localFilePath,
    })
  } catch (error: any) {
    console.error("Error handling file upload:", error)
    return NextResponse.json({ error: `Error handling file upload: ${error.message}` }, { status: 500 })
  }
}
