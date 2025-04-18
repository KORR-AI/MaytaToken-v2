"use client"

import { useEffect, useState } from "react"

export default function DirectPhantomLink() {
  const [appUrl, setAppUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get the base URL of the app
      setAppUrl(window.location.origin)
    }
  }, [])

  const openPhantomBrowser = () => {
    if (!appUrl) return

    // Create a direct deep link to Phantom's browser
    const phantomUrl = `https://phantom.app/ul/browse/${encodeURIComponent(appUrl)}`

    // Open the URL
    window.location.href = phantomUrl
  }

  return (
    <div className="p-4 bg-black/50 border border-amber-500/30 rounded-lg mt-4">
      <h3 className="text-lg font-bold text-amber-400 mb-2">Direct Phantom Link</h3>
      <p className="text-white/80 mb-4">Click the button below to open this app directly in Phantom's browser:</p>

      <button
        onClick={openPhantomBrowser}
        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded"
      >
        Open in Phantom Browser
      </button>

      <div className="mt-4 text-sm text-white/60">
        <p className="font-bold">If that doesn't work, try these steps:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Open the Phantom app</li>
          <li>Tap the "Browse" icon at the bottom</li>
          <li>
            Enter this URL manually: <span className="text-amber-400">{appUrl}</span>
          </li>
        </ol>
      </div>
    </div>
  )
}
