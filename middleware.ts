import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Only run this middleware for the root path to initialize uploads directory
  if (request.nextUrl.pathname === "/") {
    try {
      // Try to initialize the uploads directory
      await fetch(`${request.nextUrl.origin}/api/init-uploads`)
    } catch (error) {
      console.error("Failed to initialize uploads directory:", error)
    }
  }

  return NextResponse.next()
}

// Update the matcher to only run for the root path
export const config = {
  matcher: ["/"],
}
