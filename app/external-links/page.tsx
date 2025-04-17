import SiteLayout from "@/components/site-layout"
import { ExternalLink } from "lucide-react"

export default function ExternalLinksPage() {
  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">External Resources</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Manage your tokens and liquidity with these official tools
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Liquidity Management</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Create and manage liquidity pools for your tokens using Raydium's official interfaces.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://raydium.io/liquidity/create-pool/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
              >
                <span className="mr-2">Add Liquidity on Raydium</span>
                <ExternalLink size={16} />
              </a>

              <a
                href="https://raydium.io/portfolio/?position_tab=standard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
              >
                <span className="mr-2">Manage Liquidity on Raydium</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Token Explorers</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Track your tokens and monitor market activity using these blockchain explorers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://dexscreener.com/?rankBy=pairAge&order=asc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
              >
                <span className="mr-2">DexScreener</span>
                <ExternalLink size={16} />
              </a>

              <a
                href="https://solscan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300"
              >
                <span className="mr-2">Solscan</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-4">Trading</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Trade your tokens on these popular Solana decentralized exchanges.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://raydium.io/swap/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all duration-300"
              >
                <span className="mr-2">Raydium Swap</span>
                <ExternalLink size={16} />
              </a>

              <a
                href="https://jup.ag/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-300"
              >
                <span className="mr-2">Jupiter Aggregator</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
