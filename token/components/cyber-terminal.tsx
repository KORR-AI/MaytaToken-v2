"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface CyberTerminalProps {
  text?: string
  className?: string
  typingSpeed?: number
  blinkCursor?: boolean
  autoType?: boolean
  onComplete?: () => void
  prefix?: string
  height?: string
}

export default function CyberTerminal({
  text = "",
  className = "",
  typingSpeed = 50,
  blinkCursor = true,
  autoType = true,
  onComplete,
  prefix = ">",
  height = "h-64",
}: CyberTerminalProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isTyping, setIsTyping] = useState(autoType)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Auto-typing effect
  useEffect(() => {
    if (!isTyping) return

    let currentIndex = displayedText.length

    if (currentIndex >= text.length) {
      setIsTyping(false)
      onComplete?.()
      return
    }

    const typingInterval = setInterval(() => {
      if (currentIndex >= text.length) {
        clearInterval(typingInterval)
        setIsTyping(false)
        onComplete?.()
        return
      }

      setDisplayedText(text.substring(0, currentIndex + 1))
      currentIndex++

      // Scroll to bottom
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [text, displayedText, isTyping, typingSpeed, onComplete])

  // Blinking cursor effect
  useEffect(() => {
    if (!blinkCursor) return

    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [blinkCursor])

  // Handle manual typing
  const handleStartTyping = () => {
    if (!autoType && !isTyping) {
      setIsTyping(true)
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-cyan-500/30 bg-black/80 ${height} ${className}`}
      onClick={handleStartTyping}
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-900 to-black border-b border-cyan-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-cyan-400 font-mono">TERMINAL</div>
        <div className="text-xs text-gray-500 font-mono">v1.0.0</div>
      </div>

      {/* Terminal content */}
      <div ref={terminalRef} className="p-4 font-mono text-sm text-cyan-300 overflow-auto h-[calc(100%-2.5rem)]">
        {/* Prefix and text */}
        <div className="flex">
          <span className="text-green-400 mr-2">{prefix}</span>
          <span>{displayedText}</span>
          {/* Blinking cursor */}
          {cursorVisible && <span className="animate-pulse">▌</span>}
        </div>

        {/* Prompt user to click if not auto-typing */}
        {!autoType && !isTyping && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-cyan-400 font-mono text-center"
            >
              Click to start terminal sequence
            </motion.div>
          </div>
        )}
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute h-[1px] w-full bg-cyan-400/20"
          animate={{ top: ["-5%", "105%"] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "url('data:image/png;base64,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'",
        }}
      />
    </div>
  )
}
