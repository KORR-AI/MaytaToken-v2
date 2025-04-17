"use client"

import { useTokenForm } from "@/context/token-form-context"
import { useFormStep } from "@/context/form-step-context"
import ModernButton from "../modern-button"
import ModernCard from "../modern-card"
import LeverToggle from "../lever-toggle"
import { motion, AnimatePresence } from "framer-motion"

export default function Step3Authorities() {
  const { formState, handleChange, setFormState } = useTokenForm()
  const { nextStep, prevStep } = useFormStep()

  const toggleAuthorities = () => {
    setFormState((prev) => ({ ...prev, enableAuthorities: !prev.enableAuthorities }))
  }

  const toggleSocialLinks = () => {
    setFormState((prev) => ({ ...prev, enableSocialLinks: !prev.enableSocialLinks }))
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <ModernCard className="p-8" variant="gradient">
        <h2 className="text-2xl font-bold text-amber-400 mb-8 text-center">Authorities & Social Links</h2>

        {/* Authorities Section */}
        <div className="mb-8">
          <div
            className={`p-4 rounded-lg ${formState.enableAuthorities ? "bg-amber-900/20 border border-amber-500/30" : "bg-black/20 border border-white/10"} transition-colors duration-300`}
          >
            <LeverToggle
              enabled={formState.enableAuthorities}
              onChange={toggleAuthorities}
              label="Enable Authorities"
              className="mb-4"
            />

            <AnimatePresence>
              {formState.enableAuthorities && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mt-4 border-t border-amber-500/30 pt-4">
                    <div className="bg-black/20 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                      <label htmlFor="mintAuthority" className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="mintAuthority"
                          name="mintAuthority"
                          checked={formState.mintAuthority}
                          onChange={handleChange}
                          className="mr-3 h-6 w-6 rounded bg-black/30 text-amber-500 border border-white/20 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200"
                        />
                        <div>
                          <span className="text-lg text-white/90">
                            Mint Authority <span className="text-amber-400 text-sm">+0.1 SOL</span>
                          </span>
                          <p className="text-sm text-white/60 mt-1">Allows you to mint more tokens in the future</p>
                        </div>
                      </label>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                      <label htmlFor="freezeAuthority" className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="freezeAuthority"
                          name="freezeAuthority"
                          checked={formState.freezeAuthority}
                          onChange={handleChange}
                          className="mr-3 h-6 w-6 rounded bg-black/30 text-amber-500 border border-white/20 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200"
                        />
                        <div>
                          <span className="text-lg text-white/90">
                            Freeze Authority <span className="text-amber-400 text-sm">+0.1 SOL</span>
                          </span>
                          <p className="text-sm text-white/60 mt-1">Allows you to freeze token accounts</p>
                        </div>
                      </label>
                    </div>

                    <div className="bg-black/20 p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                      <label htmlFor="transferFeeAuthority" className="inline-flex items-center">
                        <input
                          type="checkbox"
                          id="transferFeeAuthority"
                          name="transferFeeAuthority"
                          checked={formState.transferFeeAuthority}
                          onChange={handleChange}
                          className="mr-3 h-6 w-6 rounded bg-black/30 text-amber-500 border border-white/20 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200"
                        />
                        <div>
                          <span className="text-lg text-white/90">
                            Transfer Fee Authority <span className="text-amber-400 text-sm">+0.1 SOL</span>
                          </span>
                          <p className="text-sm text-white/60 mt-1">Allows you to set transfer fees</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Social Links Section */}
        <div>
          <div
            className={`p-4 rounded-lg ${formState.enableSocialLinks ? "bg-amber-900/20 border border-amber-500/30" : "bg-black/20 border border-white/10"} transition-colors duration-300`}
          >
            <LeverToggle
              enabled={formState.enableSocialLinks}
              onChange={toggleSocialLinks}
              label="Enable Social Links"
              price="+0.1 SOL"
              className="mb-4"
            />

            <AnimatePresence>
              {formState.enableSocialLinks && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mt-4 border-t border-amber-500/30 pt-4">
                    <div>
                      <label htmlFor="socials.twitter" className="block text-lg text-white/80 mb-2">
                        Twitter
                      </label>
                      <input
                        type="text"
                        id="socials.twitter"
                        name="socials.twitter"
                        value={formState.socials?.twitter || ""}
                        onChange={handleChange}
                        className="mt-1 p-5 w-full rounded-lg bg-gray-800/50 text-white text-lg border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                        placeholder="https://twitter.com/yourusername"
                      />
                    </div>
                    <div>
                      <label htmlFor="socials.discord" className="block text-lg text-white/80 mb-2">
                        Discord
                      </label>
                      <input
                        type="text"
                        id="socials.discord"
                        name="socials.discord"
                        value={formState.socials?.discord || ""}
                        onChange={handleChange}
                        className="mt-1 p-5 w-full rounded-lg bg-gray-800/50 text-white text-lg border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                        placeholder="https://discord.gg/yourserver"
                      />
                    </div>
                    <div>
                      <label htmlFor="socials.telegram" className="block text-lg text-white/80 mb-2">
                        Telegram
                      </label>
                      <input
                        type="text"
                        id="socials.telegram"
                        name="socials.telegram"
                        value={formState.socials?.telegram || ""}
                        onChange={handleChange}
                        className="mt-1 p-5 w-full rounded-lg bg-gray-800/50 text-white text-lg border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
                        placeholder="https://t.me/yourchannel"
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
