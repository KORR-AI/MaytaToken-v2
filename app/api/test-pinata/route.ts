import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { apiKey, apiSecret } = await request.json()

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "API Key and Secret Key are required",
        },
        { status: 400 },
      )
    }

    // Test the Pinata connection
    const response = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      method: "GET",
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    })

    if (response.ok) {
      return NextResponse.json({ success: true })
    } else {
      const errorData = await response.json()
      return NextResponse.json({
        success: false,
        error: errorData.error?.reason || "Authentication failed",
      })
    }
  } catch (error: any) {
    console.error("Error testing Pinata connection:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred",
      },
      { status: 500 },
    )
  }
}
