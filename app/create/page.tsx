"use client"

import SiteLayout from "@/components/site-layout"
import MultiStepForm from "@/components/multi-step-form"
import { TokenFormProvider } from "@/context/token-form-context"
import { FormStepProvider } from "@/context/form-step-context"
import WalletStatus from "@/components/wallet-status"
import MobileConnectionGuide from "@/components/mobile-connection-guide"
import { isMobileDevice } from "@/lib/mobile-wallet-connector"
import { useEffect, useState } from "react"

export default function CreateTokenPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  return (
    <TokenFormProvider>
      <FormStepProvider>
        <SiteLayout>
          <div className="mb-12 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              <span className="text-white">Create Your </span>
              <span className="gradient-text">Solana Token</span>
            </h1>
            <p className="text-white/80 mt-2 text-xl text-center">
              Simple steps to launch your token on the Solana blockchain
            </p>
          </div>

          <div className="flex justify-end mb-6">
            <WalletStatus />
          </div>

          {isMobile && <MobileConnectionGuide />}

          <MultiStepForm />
        </SiteLayout>
      </FormStepProvider>
    </TokenFormProvider>
  )
}
