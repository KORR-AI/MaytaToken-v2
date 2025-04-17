"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import LanternEffect from "./lantern-effect"
import { Mail } from "lucide-react"

interface SiteLayoutProps {
  children: React.ReactNode
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <LanternEffect />

      {/* Simplified Navigation */}
      <header className="border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              MaytaToken
            </Link>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/home"
                  className={`text-sm font-medium transition-all duration-300 ${
                    pathname === "/home" ? "text-amber-400" : "text-white/80 hover:text-white"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/create"
                  className={`text-sm font-medium transition-all duration-300 ${
                    pathname === "/create" ? "text-amber-400" : "text-white/80 hover:text-white"
                  }`}
                >
                  Create Token
                </Link>
                <Link
                  href="/technology/metadata"
                  className={`text-sm font-medium transition-all duration-300 ${
                    pathname === "/technology/metadata" ? "text-amber-400" : "text-white/80 hover:text-white"
                  }`}
                >
                  Our Technology
                </Link>
                <a
                  href="https://raydium.io/liquidity/create-pool/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white/80 hover:text-white transition-all duration-300"
                >
                  Add Liquidity
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Copyright Footer with subtle disclaimer link */}
      <footer className="border-t border-white/5 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-white/60 text-sm">© {new Date().getFullYear()} MaytaToken. All rights reserved.</p>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-center md:text-left">
              <span className="text-white/60 text-xs">Protected by international copyright laws</span>
              {/* Subtle disclaimer link that looks like regular text */}
              <span className="text-white/40 text-xs hover:text-white/60 transition-colors duration-300">
                <Link href="/legal/disclaimer">Terms of use</Link>
              </span>
              {/* Contact email */}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=maytatoken@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 text-xs hover:text-white/60 transition-colors duration-300 flex items-center justify-center md:justify-start"
              >
                <Mail className="h-3 w-3 mr-1" />
                maytatoken@gmail.com
              </a>
            </div>
          </div>

          {/* Extra subtle disclaimer link in a sea of dots */}
          <div className="mt-6 text-center">
            <p className="text-white/20 text-[10px] tracking-widest">
              ····················{" "}
              <Link href="/legal/disclaimer" className="hover:text-white/40 transition-colors duration-300">
                Disclaimer
              </Link>{" "}
              ····················
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
