import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"
import { randomUUID } from "crypto"
import { pinFileToIPFS } from "@/lib/pinata-client"

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

    // Log environment variables (without revealing full values)
    console.log("PINATA_API_KEY exists:", !!process.env.PINATA_API_KEY)
    console.log("PINATA_SECRET_KEY exists:", !!process.env.PINATA_SECRET_KEY)

    try {
      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer())

      // Try to upload to Pinata
      const pinataResponse = await pinFileToIPFS(buffer, file.name || "image.png")

      console.log("Pinata upload successful:", pinataResponse)

      return NextResponse.json({
        IpfsHash: pinataResponse.IpfsHash,
        PinSize: pinataResponse.PinSize,
        Timestamp: pinataResponse.Timestamp,
        isDevelopmentFallback: false,
      })
    } catch (error: any) {
      console.error("Error uploading to Pinata:", error.message)
      console.log("Falling back to local storage")

      // If there's an error with Pinata, fall back to local storage
      const localFilePath = await saveFileLocally(file)

      return NextResponse.json({
        IpfsHash: "local",
        PinSize: file.size,
        Timestamp: new Date().toISOString(),
        isDevelopmentFallback: true,
        localUrl: localFilePath,
      })
    }
  } catch (error: any) {
    console.error("Error handling file upload:", error)
    return NextResponse.json({ error: `Error handling file upload: ${error.message}` }, { status: 500 })
  }
}
