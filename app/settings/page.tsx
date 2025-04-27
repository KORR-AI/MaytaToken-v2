"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

export default function PinataSettings() {
  const [apiKey, setApiKey] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const router = useRouter()

  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined"

  // Load saved keys from localStorage on component mount
  useEffect(() => {
    if (isBrowser) {
      const savedApiKey = localStorage.getItem("pinata_api_key")
      const savedSecretKey = localStorage.getItem("pinata_secret_key")

      if (savedApiKey) setApiKey(savedApiKey)
      if (savedSecretKey) setSecretKey(savedSecretKey)
    }
  }, [isBrowser])

  const saveKeys = () => {
    setIsLoading(true)
    setStatus("Saving keys...")

    try {
      // Save to localStorage
      localStorage.setItem("pinata_api_key", apiKey)
      localStorage.setItem("pinata_secret_key", secretKey)

      setStatus("Keys saved successfully!")

      // Redirect back to create page after a short delay
      setTimeout(() => {
        router.push("/create")
      }, 1500)
    } catch (error) {
      console.error("Error saving keys:", error)
      setStatus("Error saving keys. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    setIsLoading(true)
    setStatus("Testing Pinata connection...")
    setTestResult(null)

    try {
      const response = await fetch("/api/test-pinata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          secretKey,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setTestResult({
          success: true,
          message: "Connection successful! Your Pinata API keys are working.",
        })
      } else {
        setTestResult({
          success: false,
          message: `Connection failed: ${data.error}`,
        })
      }
    } catch (error) {
      console.error("Error testing connection:", error)
      setTestResult({
        success: false,
        message: "Error testing connection. Please check your network and try again.",
      })
    } finally {
      setIsLoading(false)
      setStatus("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Pinata IPFS Settings</h1>

      <Card className="p-6 mb-8 bg-black/80 border border-gray-700">
        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            To use IPFS for storing your token metadata and images, you need to provide Pinata API keys. These keys will
            be stored in your browser and used for uploading files to IPFS.
          </p>
          <p className="text-gray-300 mb-4">
            <strong>Note:</strong> Your keys are stored locally in your browser and are not sent to our servers except
            when making uploads.
          </p>
          <ol className="list-decimal pl-5 text-gray-300 space-y-2">
            <li>
              Sign up for a free account at{" "}
              <a
                href="https://app.pinata.cloud/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Pinata
              </a>
            </li>
            <li>Go to API Keys in your Pinata dashboard</li>
            <li>Create a new API key with "pinFileToIPFS" and "pinJSONToIPFS" permissions</li>
            <li>Copy and paste your API Key and API Secret below</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
              Pinata API Key
            </label>
            <input
              type="text"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              placeholder="Enter your Pinata API Key"
            />
          </div>

          <div>
            <label htmlFor="secretKey" className="block text-sm font-medium text-gray-300 mb-1">
              Pinata API Secret
            </label>
            <input
              type="password"
              id="secretKey"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
              placeholder="Enter your Pinata API Secret"
            />
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-md ${testResult.success ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
            >
              {testResult.message}
            </div>
          )}

          {status && <div className="p-3 rounded-md bg-blue-900/50 text-blue-300">{status}</div>}

          <div className="flex space-x-4 pt-2">
            <button
              onClick={testConnection}
              disabled={isLoading || !apiKey || !secretKey}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Connection
            </button>

            <button
              onClick={saveKeys}
              disabled={isLoading || !apiKey || !secretKey}
              className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Keys
            </button>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <button
          onClick={() => router.push("/create")}
          className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
        >
          Back to Token Creation
        </button>
      </div>
    </div>
  )
}
