"use client"

import { useTokenForm } from "@/context/token-form-context"
import StyledFileInput from "@/components/styled-file-input"
import { PinataModal } from "@/components/pinata-modal"

export default function Step2Appearance() {
  const { formState, handleChange, handleImageUpload, imagePreview, uploadingImage } = useTokenForm()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Token Appearance</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Token Image
          </label>
          <StyledFileInput
            id="image"
            onChange={handleImageUpload}
            imagePreview={imagePreview}
            isUploading={uploadingImage}
            accept="image/*"
          />
          <p className="text-xs text-gray-500 mt-1">Upload an image for your token (recommended size: 500x500px)</p>
        </div>

        <div className="mt-4">
          <PinataModal />
          <p className="text-xs text-gray-500 mt-1">
            Configure Pinata IPFS for permanent decentralized storage of your token metadata
          </p>
        </div>

        <div className="mt-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="enableCreatorInfo"
              checked={formState.enableCreatorInfo}
              onChange={handleChange}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <span>Add Creator Information (+0.1 SOL)</span>
          </label>
        </div>

        {formState.enableCreatorInfo && (
          <div className="space-y-4 pl-6 border-l-2 border-gray-200 mt-2">
            <div>
              <label htmlFor="creatorName" className="block text-sm font-medium mb-1">
                Creator Name
              </label>
              <input
                type="text"
                id="creatorName"
                name="creatorName"
                value={formState.creatorName || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter creator name"
              />
            </div>

            <div>
              <label htmlFor="siteName" className="block text-sm font-medium mb-1">
                Website
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={formState.siteName || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter website URL"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="enableSocialLinks"
                  checked={formState.enableSocialLinks}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span>Add Social Links (+0.1 SOL)</span>
              </label>
            </div>

            {formState.enableSocialLinks && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-200 mt-2">
                <div>
                  <label htmlFor="socials.twitter" className="block text-sm font-medium mb-1">
                    Twitter
                  </label>
                  <input
                    type="text"
                    id="socials.twitter"
                    name="socials.twitter"
                    value={formState.socials?.twitter || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Twitter username"
                  />
                </div>

                <div>
                  <label htmlFor="socials.telegram" className="block text-sm font-medium mb-1">
                    Telegram
                  </label>
                  <input
                    type="text"
                    id="socials.telegram"
                    name="socials.telegram"
                    value={formState.socials?.telegram || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Telegram username or group"
                  />
                </div>

                <div>
                  <label htmlFor="socials.discord" className="block text-sm font-medium mb-1">
                    Discord
                  </label>
                  <input
                    type="text"
                    id="socials.discord"
                    name="socials.discord"
                    value={formState.socials?.discord || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Discord invite link"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
