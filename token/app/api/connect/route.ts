import { NextResponse } from "next/server"

export async function GET() {
  // Redirect to the static HTML page
  return NextResponse.redirect(new URL("/connect.html", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
}
