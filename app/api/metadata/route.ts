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

    // Generate a unique filename
    const uniqueFilename = `${randomUUID()}-metadata.json`
    const filePath = join(uploadsDir, uniqueFilename)

    // Write metadata to disk
    await writeFile(filePath, JSON.stringify(metadata, null, 2))

    // Return the public URL
    return `/uploads/${uniqueFilename}`
  } catch (error) {
    console.error("Error saving metadata locally:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the JSON data from the request
    const metadata = await request.json()

    // Always use local storage fallback for development
    // This bypasses Pinata completely to avoid API key issues
    const localFilePath = await saveMetadataLocally(metadata)

    // Get the base URL from environment or use a default
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

    return NextResponse.json({
      url: `${baseUrl}${localFilePath}`,
      ipfsHash: "local",
      isDevelopmentFallback: true,
    })
  } catch (error: any) {
    console.error("Error handling metadata:", error)
    return NextResponse.json({ error: `Error handling metadata: ${error.message}` }, { status: 500 })
  }
}
