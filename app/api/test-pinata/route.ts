import { NextResponse } from "next/server"
import { testPinataConnection } from "@/lib/pinata-service"

export async function POST(request: Request) {
  try {
    const { apiKey, apiSecret } = await request.json()

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: "API Key and Secret Key are required" }, { status: 400 })
    }

    const result = await testPinataConnection(apiKey, apiSecret)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to connect to Pinata" },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Error testing Pinata connection:", error)
    return NextResponse.json({ success: false, error: error.message || "An error occurred" }, { status: 500 })
  }
}
