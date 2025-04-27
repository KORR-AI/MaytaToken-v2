import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"
import { randomUUID } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public/uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (err) {
      console.log("Directory already exists or cannot be created")
    }

    // Generate a unique filename
    const uniqueId = randomUUID()
    const originalName = file.name
    const fileExtension = originalName.split(".").pop() || "png"
    const uniqueFilename = `${uniqueId}.${fileExtension}`
    const filePath = join(uploadsDir, uniqueFilename)

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Write file to disk
    await writeFile(filePath, buffer)

    // Return the local URL
    return NextResponse.json({
      success: true,
      localUrl: `/uploads/${uniqueFilename}`,
      filename: uniqueFilename,
    })
  } catch (error: any) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      {
        error: `Error uploading file: ${error.message}`,
      },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
