"use client"

import { useState } from "react"
import PinataSettings from "./pinata-settings"

export default function PinataConfigLink() {
  const [showSettings, setShowSettings] = useState(false)

  if (showSettings) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="relative w-full max-w-md">
          <button
            onClick={() => setShowSettings(false)}
            className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-1"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <PinataSettings onClose={() => setShowSettings(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2">
      <button onClick={() => setShowSettings(true)} className="text-blue-400 hover:underline text-sm flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        Configure IPFS Settings (Pinata)
      </button>
    </div>
  )
}
