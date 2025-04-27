import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.PINATA_API_KEY
    const apiSecret = process.env.PINATA_SECRET_KEY

    if (!apiKey || !apiSecret) {
      return NextResponse.json({
        success: false,
        message: "Pinata API keys not found in environment variables",
      })
    }

    // Test the Pinata API keys with a simple request
    const response = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        success: true,
        message: "Pinata API keys are valid",
        data,
      })
    } else {
      const errorText = await response.text()
      return NextResponse.json({
        success: false,
        message: "Pinata API keys are invalid",
        error: errorText,
        status: response.status,
      })
    }
  } catch (error: any) {
    console.error("Error testing Pinata API keys:", error)

    return NextResponse.json({
      success: false,
      message: "Error testing Pinata API keys",
      error: error.message,
    })
  }
}
