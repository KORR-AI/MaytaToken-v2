"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"

interface StyledFileInputProps {
  id: string
  name: string
  accept?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  className?: string
}

export default function StyledFileInput({
  id,
  name,
  accept,
  onChange,
  disabled = false,
  className = "",
}: StyledFileInputProps) {
  const [fileName, setFileName] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setFileName(files[0].name)
    } else {
      setFileName("")
    }
    onChange(e)
  }

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="file"
        id={id}
        name={name}
        accept={accept}
        onChange={handleChange}
        className="sr-only"
        disabled={disabled}
      />

      <div
        className={`flex items-center rounded-lg border ${
          disabled
            ? "bg-gray-800/30 border-gray-700/30 cursor-not-allowed"
            : "bg-gray-800/50 border-white/10 hover:border-amber-500/50 cursor-pointer"
        } transition-all duration-300`}
        onClick={handleClick}
      >
        <div
          className={`flex items-center justify-center h-12 w-12 rounded-l-lg ${
            disabled ? "bg-gray-700/50" : "bg-amber-600/20"
          }`}
        >
          <Upload className={`h-5 w-5 ${disabled ? "text-gray-500" : "text-amber-400"}`} />
        </div>

        <div className="flex-1 px-3 py-2 truncate">
          {fileName ? (
            <span className={`text-sm ${disabled ? "text-gray-500" : "text-white"}`}>{fileName}</span>
          ) : (
            <span className={`text-sm ${disabled ? "text-gray-500" : "text-white/60"}`}>Choose file...</span>
          )}
        </div>

        <div
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            disabled ? "text-gray-500" : "text-amber-400 hover:bg-amber-600/10"
          } transition-colors duration-300`}
        >
          Browse
        </div>
      </div>
    </div>
  )
}
