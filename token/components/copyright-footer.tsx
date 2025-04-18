"use client"

import { useState, useEffect } from "react"

interface CopyrightFooterProps {
  companyName?: string
  className?: string
  showLegal?: boolean
}

export default function CopyrightFooter({
  companyName = "MaytaToken",
  className = "",
  showLegal = true,
}: CopyrightFooterProps) {
  const [currentYear, setCurrentYear] = useState<number>(2023)

  useEffect(() => {
    // Update the year when the component mounts
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className={`border-t border-white/5 py-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-white/60 text-sm">
              © {currentYear} {companyName}. All rights reserved.
            </p>
          </div>
          {showLegal && (
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-center md:text-left">
              <span className="text-white/60 text-xs">Protected by international copyright laws</span>
              <span className="text-white/60 text-xs">Unauthorized reproduction or distribution is prohibited</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
