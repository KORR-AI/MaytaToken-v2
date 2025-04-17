"use client"

// Utility functions for interacting with Pinata IPFS

export async function uploadMetadataToPinata(metadata: any) {
  try {
    // Always use our server API route
    const response = await fetch("/api/metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to upload metadata: ${error}`)
    }

    const data = await response.json()

    // If this is a development fallback, use the local URL
    if (data.isDevelopmentFallback) {
      console.log("Using local storage for metadata")
      // Return a fully qualified URL including the domain
      const baseUrl = window.location.origin
      return `${baseUrl}${data.url}`
    }

    // Return the IPFS URL
    return data.url
  } catch (error) {
    console.error("Error uploading metadata:", error)
    throw error
  }
}

// Update the uploadImageToPinata function to handle local images properly
export async function uploadImageToPinata(imageUrl: string, name: string) {
  try {
    // If the image is already an IPFS URL, return it
    if (imageUrl.includes("ipfs://") || imageUrl.includes("gateway.pinata.cloud")) {
      return imageUrl
    }

    // If it's a local fallback URL from a previous upload, convert to full URL
    if (imageUrl.startsWith("/uploads/")) {
      const baseUrl = window.location.origin
      return `${baseUrl}${imageUrl}`
    }

    // If it's a data URL or a remote URL, we need to fetch it first
    let imageBlob: Blob

    try {
      // Try to fetch the image
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
      }
      imageBlob = await imageResponse.blob()
    } catch (error) {
      console.warn(`Failed to fetch image from URL: ${error}`)
      // Return the original URL if we can't fetch it
      return imageUrl
    }

    // Always use our server API route
    const formData = new FormData()
    formData.append("file", imageBlob, name)

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Failed to upload image: ${error}`)
    }

    const data = await res.json()

    // Check if this is a development fallback
    if (data.isDevelopmentFallback) {
      console.log("Using local storage for image")
      // Return a fully qualified URL including the domain
      const baseUrl = window.location.origin
      return `${baseUrl}${data.localUrl}`
    }

    // Return the IPFS URL
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
  } catch (error) {
    console.error("Error uploading image:", error)
    // If there's an error, return the original URL
    return imageUrl
  }
}
