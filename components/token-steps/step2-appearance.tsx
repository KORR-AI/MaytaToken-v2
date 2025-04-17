"use client"

import { useTokenForm } from "@/context/token-form-context"
import { useFormStep } from "@/context/form-step-context"
import ModernButton from "../modern-button"
import ModernCard from "../modern-card"
import ImageDisplay from "../image-display"
import LeverToggle from "../lever-toggle"
import { motion, AnimatePresence } from "framer-motion"
import StyledFileInput from "../styled-file-input"

export default function Step2Appearance() {
  const { formState, handleChange, imagePreview, uploadingImage, handleImageUpload, setFormState } = useTokenForm()
  const { nextStep, prevStep } = useFormStep()

  const toggleCreatorInfo = () => {
    setFormState((prev) => ({ ...prev, enableCreatorInfo: !prev.enableCreatorInfo }))
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <ModernCard className="p-8" variant="gradient">
        <h2 className="text-2xl font-bold text-amber-400 mb-8 text-center">Token Appearance</h2>

        <div className="mb-8">
          <label htmlFor="image" className="block text-xl font-medium text-amber-400 mb-3">
            Token Image
          </label>
          <StyledFileInput id="image" name="image" accept="image/*" onChange={handleImageUpload} className="mt-1" />
          <p className="text-sm text-white/60 mt-2">
            Images will be resized to 500x500 pixels for wallet compatibility
          </p>
          {uploadingImage && <p className="text-yellow-400 mt-2">Uploading image...</p>}
          {imagePreview && (
            <div className="mt-6 flex justify-center">
              <div className="relative w-48 h-48 overflow-hidden rounded-full border border-white/20 shadow-lg shadow-black/50">
                <ImageDisplay
                  src={imagePreview || "/placeholder.svg"}
                  alt="Token Preview"
                  width={192}
                  height={192}
                  className="rounded-full max-h-48 mx-auto z-10 relative"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <div
            className={`p-4 rounded-lg ${formState.enableCreatorInfo ? "bg-amber-900/20 border border-amber-500/30" : "bg-black/20 border border-white/10"} transition-colors duration-300`}
          >
            <LeverToggle
              enabled={formState.enableCreatorInfo}
              onChange={toggleCreatorInfo}
              label="Enable Creator Info"
              price="+0.1 SOL"
              className="mb-4"
            />

            <AnimatePresence>
              {formState.enableCreatorInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mt-4 border-t border-amber-500/30 pt-4">
                    <div>
                      <label htmlFor="creatorName" className="block text-lg text-white/80 mb-2">
                        Creator Name
                      </label>
                      <input
                        type="text"
                        id="creatorName"
                        name="creatorName"
                        value={formState.creatorName || ""}
                        onChange={handleChange}
                        className="mt-1 p-5 w-full rounded-lg bg-gray-800/50 text-white text-lg border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                        placeholder="Your name or organization"
                      />
                    </div>

                    <div>
                      <label htmlFor="siteName" className="block text-lg text-white/80 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        name="siteName"
                        value={formState.siteName || ""}
                        onChange={handleChange}
                        className="mt-1 p-5 w-full rounded-lg bg-gray-800/50 text-white text-lg border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                        placeholder="Your website name"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ModernCard>

      <div className="flex justify-between">
        <ModernButton onClick={prevStep} variant="outline" size="lg" className="px-10 py-4 text-lg">
          Previous
        </ModernButton>
        <ModernButton onClick={nextStep} size="lg" className="px-10 py-4 text-lg">
          Next Step
        </ModernButton>
      </div>
    </div>
  )
}
