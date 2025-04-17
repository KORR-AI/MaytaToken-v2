"use client"

import { useTokenForm } from "@/context/token-form-context"
import { useFormStep } from "@/context/form-step-context"
import ModernButton from "../modern-button"
import ModernCard from "../modern-card"

export default function Step1BasicInfo() {
  const { formState, handleChange, walletConnected, connectWallet } = useTokenForm()
  const { nextStep } = useFormStep()

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <ModernCard className="p-8" variant="gradient">
        <h2 className="text-2xl font-bold text-amber-400 mb-8 text-center">Basic Token Information</h2>

        <div className="mb-8">
          <label htmlFor="tokenName" className="block text-xl font-medium text-amber-400 mb-3">
            Token Name
          </label>
          <input
            type="text"
            id="tokenName"
            name="tokenName"
            value={formState.tokenName}
            onChange={handleChange}
            className="mt-1 p-5 w-full rounded-lg bg-gray-800/50 text-white text-lg border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
            required
            placeholder="Enter your token name"
          />
        </div>

        <div className="mb-8">
          <label htmlFor="symbol" className="block text-xl font-medium text-amber-400 mb-3">
            Symbol
          </label>
          <input
            type="text"
            id="symbol"
            name="symbol"
            value={formState.symbol}
            onChange={handleChange}
            className="mt-1 p-5 w-full rounded-lg bg-gray-800/50 text-white text-lg border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
            required
            placeholder="Enter token symbol (e.g., BTC)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="decimals" className="block text-xl font-medium text-amber-400 mb-3">
              Decimals
            </label>
            <input
              type="number"
              id="decimals"
              name="decimals"
              value={formState.decimals}
              onChange={handleChange}
              className="mt-1 p-5 w-full rounded-lg bg-gray-800/50 text-white text-lg border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
              required
              placeholder="9"
            />
          </div>

          <div>
            <label htmlFor="supply" className="block text-xl font-medium text-amber-400 mb-3">
              Total Supply
            </label>
            <input
              type="number"
              id="supply"
              name="supply"
              value={formState.supply}
              onChange={handleChange}
              className="mt-1 p-5 w-full rounded-lg bg-gray-800/50 text-white text-lg border border-white/10 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300 hover:border-white/30 outline-none"
              required
              placeholder="1000000000"
            />
          </div>
        </div>
      </ModernCard>

      <div className="flex justify-between">
        <div></div> {/* Empty div for spacing */}
        <ModernButton
          onClick={nextStep}
          size="lg"
          className="px-10 py-4 text-lg"
          disabled={!walletConnected || !formState.tokenName || !formState.symbol}
        >
          Next Step
        </ModernButton>
      </div>

      {!walletConnected && (
        <div className="text-center mt-6">
          <p className="text-amber-400 mb-4">Connect your wallet to continue</p>
          <ModernButton onClick={connectWallet} size="md">
            Connect Wallet
          </ModernButton>
        </div>
      )}
    </div>
  )
}
