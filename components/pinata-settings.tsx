"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/context/toast-context"

export default function PinataSettings({ onClose }: { onClose: () => void }) {
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pinataApiKey") || ""
    }
    return ""
  })

  const [apiSecret, setApiSecret] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pinataApiSecret") || ""
    }
    return ""
  })

  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const { addToast } = useToast()

  const testConnection = async () => {
    if (!apiKey || !apiSecret) {
      setTestResult({
        success: false,
        message: "Please enter both API Key and Secret Key",
      })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/test-pinata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          apiSecret,
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
          message: data.error || "Failed to connect to Pinata. Please check your API keys.",
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "An error occurred while testing the connection.",
      })
    } finally {
      setTesting(false)
    }
  }

  const saveSettings = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pinataApiKey", apiKey)
      localStorage.setItem("pinataApiSecret", apiSecret)

      addToast({
        title: "Settings Saved",
        description: "Your Pinata API keys have been saved.",
        type: "success",
      })

      onClose()
    }
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Pinata IPFS Settings</h2>

      <div className="space-y-2">
        <Label htmlFor="apiKey">Pinata API Key</Label>
        <Input
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Pinata API Key"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiSecret">Pinata Secret Key</Label>
        <Input
          id="apiSecret"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
          placeholder="Enter your Pinata API Secret"
          type="password"
        />
      </div>

      <div className="text-sm text-gray-500">
        <p>Don't have Pinata API keys?</p>
        <ol className="list-decimal pl-5 mt-2">
          <li>
            Sign up at{" "}
            <a
              href="https://app.pinata.cloud/register"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Pinata.cloud
            </a>
          </li>
          <li>Go to API Keys in your dashboard</li>
          <li>Create a new key with "pinFileToIPFS" and "pinJSONToIPFS" permissions</li>
        </ol>
      </div>

      {testResult && (
        <div
          className={`p-3 rounded ${testResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {testResult.message}
        </div>
      )}

      <div className="flex space-x-2 pt-4">
        <Button onClick={testConnection} disabled={testing} variant="outline">
          {testing ? "Testing..." : "Test Connection"}
        </Button>
        <Button onClick={saveSettings} disabled={testing}>
          Save Settings
        </Button>
        <Button onClick={onClose} variant="ghost">
          Cancel
        </Button>
      </div>
    </div>
  )
}
