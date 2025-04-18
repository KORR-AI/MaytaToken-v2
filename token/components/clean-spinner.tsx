"use client"

import { Loader2 } from "lucide-react"

interface CleanSpinnerProps {
  progress: number
  status: string
}

export default function CleanSpinner({ progress, status }: CleanSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400"
          style={{
            transform: "rotate(-90deg)",
            animation: "spin 1.5s linear infinite",
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-amber-400 animate-spin" />
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-mono tracking-wider text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] mb-2">
          {progress}%
        </div>
        <div className="text-white/70 max-w-md">{status}</div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(-90deg); }
          100% { transform: rotate(270deg); }
        }
      `}</style>
    </div>
  )
}
