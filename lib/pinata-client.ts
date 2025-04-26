import axios from "axios"
import FormData from "form-data"
import { Readable } from "stream"

// Create a dedicated Pinata client with the API keys
export async function pinFileToIPFS(fileBuffer: Buffer, fileName: string) {
  try {
    // Get API keys from environment variables
    const apiKey = process.env.PINATA_API_KEY
    const apiSecret = process.env.PINATA_SECRET_KEY

    if (!apiKey || !apiSecret) {
      throw new Error("Pinata API keys not found in environment variables")
    }

    // Create a proper Node.js FormData instance
    const formData = new FormData()

    // Convert buffer to stream and append to form data
    const stream = Readable.from(fileBuffer)
    formData.append("file", stream, {
      filename: fileName,
      contentType: "application/octet-stream",
    })

    // Make request to Pinata API
    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: Number.POSITIVE_INFINITY,
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    })

    return res.data
  } catch (error) {
    console.error("Error pinning file to IPFS:", error)
    throw error
  }
}

export async function pinJSONToIPFS(jsonData: any) {
  try {
    // Get API keys from environment variables
    const apiKey = process.env.PINATA_API_KEY
    const apiSecret = process.env.PINATA_SECRET_KEY

    if (!apiKey || !apiSecret) {
      throw new Error("Pinata API keys not found in environment variables")
    }

    // Make request to Pinata API
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", jsonData, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    })

    return res.data
  } catch (error) {
    console.error("Error pinning JSON to IPFS:", error)
    throw error
  }
}
