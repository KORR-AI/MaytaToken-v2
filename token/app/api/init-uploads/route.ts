import { NextResponse } from "next/server"
import { mkdir } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public/uploads")
    await mkdir(uploadsDir, { recursive: true })

    return NextResponse.json({ success: true, message: "Uploads directory initialized" })
  } catch (error: any) {
    console.error("Error initializing uploads directory:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
