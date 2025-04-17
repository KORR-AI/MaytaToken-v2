"use client"
import Link from "next/link"
import SiteLayout from "@/components/site-layout"
import ModernButton from "@/components/modern-button"
import ModernCard from "@/components/modern-card"
import MetadataTechShowcase from "@/components/metadata-tech-showcase"

// Remove the inline lantern effect since it's now in the layout
export default function HomePage() {
  return (
    <SiteLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] relative z-20">
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="neotech-font" data-text="Mayta">
              Mayta
            </span>
            <span className="neotech-font gradient" data-text="Token">
              Token
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 font-light">
            Create your own Solana token with embedded metadata in a single transaction
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/create">
              <ModernButton size="lg" className="px-8 py-4 text-lg">
                Create Token
              </ModernButton>
            </Link>
            <Link href="/about">
              <ModernButton variant="outline" size="lg" className="px-8 py-4 text-lg">
                Learn More
              </ModernButton>
            </Link>
          </div>
        </div>

        {/* Add the Metadata Tech Showcase component here */}
        <MetadataTechShowcase />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-12">
          <ModernCard variant="gradient" className="p-6 slide-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-xl font-bold text-amber-400 mb-3">Embedded Metadata</h3>
            <p className="text-white/80">
              Create tokens with rich metadata that's embedded directly on-chain for maximum compatibility.
            </p>
          </ModernCard>

          <ModernCard variant="gradient" className="p-6 slide-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold text-amber-400 mb-3">Single Transaction</h3>
            <p className="text-white/80">
              Create your token in a single transaction, making the process faster and more efficient.
            </p>
          </ModernCard>

          <ModernCard variant="gradient" className="p-6 slide-in" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-xl font-bold text-amber-400 mb-3">Full Control</h3>
            <p className="text-white/80">
              Maintain complete control over your token with customizable mint, freeze, and transfer fee authorities.
            </p>
          </ModernCard>
        </div>

        <div className="mt-20 max-w-5xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="neotech-font gradient" data-text="External Liquidity Management">
              External Liquidity Management
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernCard variant="outline" className="p-6 hover:glow-effect transition-all duration-300">
              <h3 className="text-xl font-bold text-amber-400 mb-3 text-center">Add Liquidity</h3>
              <p className="text-white/80 mb-6 text-center">
                Create a new liquidity pool for your token on Raydium's official interface.
              </p>
              <div className="flex justify-center">
                <a
                  href="https://raydium.io/liquidity/create-pool/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <ModernButton>Go to Raydium Pool Creator</ModernButton>
                </a>
              </div>
            </ModernCard>

            <ModernCard variant="outline" className="p-6 hover:glow-effect transition-all duration-300">
              <h3 className="text-xl font-bold text-amber-400 mb-3 text-center">Manage Liquidity</h3>
              <p className="text-white/80 mb-6 text-center">
                View and manage your existing liquidity positions on Raydium.
              </p>
              <div className="flex justify-center">
                <a
                  href="https://raydium.io/portfolio/?position_tab=standard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <ModernButton>Go to Raydium Portfolio</ModernButton>
                </a>
              </div>
            </ModernCard>
          </div>
        </div>

        <div className="mt-16 max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModernCard className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">11.4k+</div>
              <div className="text-white/60 text-sm">Tokens Created</div>
            </ModernCard>

            <ModernCard className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">3.2k+</div>
              <div className="text-white/60 text-sm">Active Pools</div>
            </ModernCard>

            <ModernCard className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">378</div>
              <div className="text-white/60 text-sm">Daily Users</div>
            </ModernCard>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
