"use client"

import { useEffect } from "react"
import SiteLayout from "@/components/site-layout"
import DirectMobileConnect from "@/components/direct-mobile-connect"
import { useRouter } from "next/navigation"
import { isMobileDevice } from "@/lib/phantom-mobile-connector"
import ModernButton from "@/components/modern-button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ConnectMobilePage() {
  const router = useRouter()

  useEffect(() => {
    // If not on mobile, redirect to home
    if (!isMobileDevice() && typeof window !== "undefined") {
      router.push("/create")
    }
  }, [router])

  return (
    <SiteLayout>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Link href="/create">
            <ModernButton variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Token Creator
            </ModernButton>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">
          <span className="text-white">Connect </span>
          <span className="gradient-text">Phantom Mobile</span>
        </h1>

        <DirectMobileConnect />

        <div className="mt-8 p-4 bg-black/30 border border-amber-500/20 rounded-lg">
          <h3 className="text-lg font-bold text-amber-400 mb-2">Important Note</h3>
          <p className="text-white/80">
            For the best experience on mobile, always use Phantom's built-in browser. This ensures a seamless connection
            without redirection issues.
          </p>
        </div>
      </div>
    </SiteLayout>
  )
}
