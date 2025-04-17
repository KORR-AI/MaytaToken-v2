"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SimpleConnectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the static HTML page
    window.location.href = "/connect.html"
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-amber-400 mb-4">Redirecting to Simple Connect Page...</h1>
        <p>
          If you are not redirected,{" "}
          <a href="/connect.html" className="text-amber-400 underline">
            click here
          </a>
          .
        </p>
      </div>
    </div>
  )
}
