"use client"

import { useTokenForm } from "@/context/token-form-context"
import { getPinataKeys } from "@/lib/pinata-service"
import { useState, useEffect } from "react"

export default function Step4Review() {
  const { formState } = useTokenForm()
  const [hasPinataKeys, setHasPinataKeys] = useState(false)

  // Check if Pinata keys are configured
  useEffect(() => {
    const keys = getPinataKeys()
    setHasPinataKeys(!!keys)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Token Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Token Name:</span>
                <span className="font-medium">{formState.tokenName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Symbol:</span>
                <span className="font-medium">{formState.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Decimals:</span>
                <span className="font-medium">{formState.decimals}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Supply:</span>
                <span className="font-medium">{formState.supply}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Storage</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">IPFS Storage:</span>
                <span className={`font-medium ${hasPinataKeys ? "text-green-500" : "text-yellow-500"}`}>
                  {hasPinataKeys ? "Enabled (Pinata)" : "Local Storage Only"}
                </span>
              </div>
              {!hasPinataKeys && (
                <p className="text-xs text-yellow-500">
                  Your token metadata will be stored locally. For permanent storage, configure Pinata IPFS.
                </p>
              )}
            </div>
          </div>

          {formState.enableCreatorInfo && (
            <div>
              <h3 className="text-lg font-medium">Creator Information</h3>
              <div className="mt-2 space-y-2">
                {formState.creatorName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Creator Name:</span>
                    <span className="font-medium">{formState.creatorName}</span>
                  </div>
                )}
                {formState.siteName && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Website:</span>
                    <span className="font-medium">{formState.siteName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {formState.enableSocialLinks && (
            <div>
              <h3 className="text-lg font-medium">Social Links</h3>
              <div className="mt-2 space-y-2">
                {formState.socials?.twitter && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Twitter:</span>
                    <span className="font-medium">{formState.socials.twitter}</span>
                  </div>
                )}
                {formState.socials?.telegram && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Telegram:</span>
                    <span className="font-medium">{formState.socials.telegram}</span>
                  </div>
                )}
                {formState.socials?.discord && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discord:</span>
                    <span className="font-medium">{formState.socials.discord}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium">Authorities</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Mint Authority:</span>
                <span className="font-medium">{formState.mintAuthority ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Freeze Authority:</span>
                <span className="font-medium">{formState.freezeAuthority ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transfer Fee Authority:</span>
                <span className="font-medium">{formState.transferFeeAuthority ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Fee</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Creation Fee:</span>
                <span className="font-medium">{formState.fee} SOL</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Token Image</h3>
          {formState.image ? (
            <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 aspect-square flex items-center justify-center">
              <img
                src={formState.image || "/placeholder.svg"}
                alt="Token Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 aspect-square flex items-center justify-center">
              <p className="text-gray-400">No image selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
