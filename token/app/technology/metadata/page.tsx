"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import SiteLayout from "@/components/site-layout"
import ModernCard from "@/components/modern-card"
import ModernButton from "@/components/modern-button"
import { ArrowRight, CheckCircle2, XCircle, Code, Zap, Shield, Coins } from "lucide-react"
import MetadataComparison from "@/components/artwork/metadata-comparison" // Import our new component
import MetadataFlow from "@/components/artwork/metadata-flow" // Import our new component

export default function MetadataExplainerPage() {
  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Advanced </span>
            <span className="gradient-text">Token Metadata</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            How our Token-2022 Extension Pointer revolutionizes on-chain metadata compared to traditional Metaplex
            approaches
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Introduction Section */}
          <section>
            <ModernCard className="p-8" variant="gradient">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">The Evolution of Solana Token Metadata</h2>
              <p className="text-white/80 mb-4">
                Token metadata is essential for creating recognizable and functional tokens on Solana. It provides
                crucial information like name, symbol, logo, and other attributes that make your token unique and usable
                in wallets and applications.
              </p>
              <p className="text-white/80">
                There are two primary approaches to implementing token metadata on Solana: the traditional{" "}
                <strong className="text-amber-300">Metaplex NFT Standard</strong> and the newer{" "}
                <strong className="text-amber-300">Token-2022 Extension Pointer</strong> approach that we use at
                MaytaToken.
              </p>
            </ModernCard>
          </section>

          {/* Add our new comparison artwork here */}
          <MetadataComparison />

          {/* Comparison Table */}
          <section>
            <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center">Metadata Approach Comparison</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Traditional Metaplex */}
              <ModernCard className="p-6 border border-red-500/30 bg-gradient-to-b from-red-900/20 to-black/60">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center mr-4">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-red-400">Traditional Metaplex</h3>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-white/80">
                      <strong className="text-white">Multiple Accounts:</strong> Requires separate token mint and
                      metadata accounts
                    </span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-white/80">
                      <strong className="text-white">Higher Costs:</strong> Creating and updating metadata requires more
                      SOL for rent
                    </span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-white/80">
                      <strong className="text-white">Multiple Transactions:</strong> Often requires separate
                      transactions for token and metadata
                    </span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-white/80">
                      <strong className="text-white">Complex Integration:</strong> Requires additional lookups to find
                      and verify metadata
                    </span>
                  </li>
                  <li className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-white/80">
                      <strong className="text-white">Slower Processing:</strong> Multiple account lookups increase
                      processing time
                    </span>
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-black/30 rounded-lg border border-red-500/20">
                  <p className="text-white/70 text-sm">
                    The traditional approach uses the Metaplex NFT standard to create a separate metadata account that
                    points to the token mint. This approach was originally designed for NFTs and adapted for fungible
                    tokens.
                  </p>
                </div>
              </ModernCard>

              {/* Token-2022 Extension Pointer */}
              <ModernCard className="p-6 border border-green-500/30 bg-gradient-to-b from-green-900/20 to-black/60">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center mr-4">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-green-400">Token-2022 Extension Pointer</h3>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-white/80">
                      <strong className="text-white">Single Account:</strong> Metadata is stored directly in the token
                      mint account
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-white/80">
                      <strong className="text-white">Cost Efficient:</strong> Lower rent costs with consolidated storage
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-white/80">
                      <strong className="text-white">Single Transaction:</strong> Create token and metadata in one
                      atomic operation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-white/80">
                      <strong className="text-white">Simplified Integration:</strong> Direct access to metadata from the
                      token mint
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-white/80">
                      <strong className="text-white">Faster Processing:</strong> Single account lookup improves
                      performance
                    </span>
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-black/30 rounded-lg border border-green-500/20">
                  <p className="text-white/70 text-sm">
                    Our approach uses the Token-2022 program's extension feature to embed metadata directly within the
                    token mint account, creating a more efficient and streamlined token creation process.
                  </p>
                </div>
              </ModernCard>
            </div>
          </section>

          {/* Add our new flow artwork here */}
          <MetadataFlow />

          {/* Key Benefits */}
          <section>
            <h2 className="text-2xl font-bold text-amber-400 mb-8 text-center">Key Benefits of Our Approach</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ModernCard className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center mr-3">
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-400">Efficiency</h3>
                </div>
                <p className="text-white/80">
                  Our Token-2022 Extension Pointer approach reduces blockchain bloat by consolidating token and metadata
                  into a single account, resulting in faster transactions and lower network fees.
                </p>
              </ModernCard>

              <ModernCard className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center mr-3">
                    <Coins className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-400">Cost Savings</h3>
                </div>
                <p className="text-white/80">
                  By eliminating the need for a separate metadata account, you save on rent costs. This makes token
                  creation more affordable, especially for projects creating multiple tokens.
                </p>
              </ModernCard>

              <ModernCard className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-400">Security</h3>
                </div>
                <p className="text-white/80">
                  The direct association between token and metadata eliminates potential verification issues and ensures
                  that metadata is always correctly linked to its token.
                </p>
              </ModernCard>

              <ModernCard className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center mr-3">
                    <Code className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-400">Future-Proof</h3>
                </div>
                <p className="text-white/80">
                  Token-2022 is the latest Solana token standard, offering improved features and compatibility with
                  future Solana ecosystem developments and optimizations.
                </p>
              </ModernCard>
            </div>
          </section>

          {/* Technical Details */}
          <section>
            <ModernCard className="p-8" variant="gradient">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">Technical Implementation</h2>

              <div className="bg-black/40 p-4 rounded-lg border border-amber-500/20 mb-6 overflow-x-auto">
                <pre className="text-sm text-white/80 font-mono">
                  <code>{`// Token-2022 Extension Pointer Implementation
const mintLen = getMintLen([ExtensionType.MetadataPointer]);
const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
const metadataLen = pack(tokenMetadata).length;

// Create mint account with extension
const createAccountInstruction = SystemProgram.createAccount({
  fromPubkey: userPublicKey,
  newAccountPubkey: mint,
  space: mintLen,
  lamports,
  programId: TOKEN_2022_PROGRAM_ID,
});

// Initialize metadata pointer
const initializeMetadataPointerInstruction = createInitializeMetadataPointerInstruction(
  mint,
  userPublicKey,
  mint,
  TOKEN_2022_PROGRAM_ID,
);

// Initialize metadata directly in the token mint
const initializeMetadataInstruction = createInitializeInstruction({
  programId: TOKEN_2022_PROGRAM_ID,
  metadata: mint,
  updateAuthority: userPublicKey,
  mint: mint,
  name: tokenMetadata.name,
  symbol: tokenMetadata.symbol,
  uri: tokenMetadata.uri,
});`}</code>
                </pre>
              </div>

              <p className="text-white/80">
                Our implementation uses the SPL Token-2022 program's extension capabilities to create a token mint with
                embedded metadata. This approach allows us to initialize both the token and its metadata in a single
                atomic transaction, improving efficiency and reducing costs.
              </p>

              <p className="text-white/80 mt-4">
                The metadata is directly accessible from the token mint account, eliminating the need for complex PDA
                derivations and additional account lookups that are required with the traditional Metaplex approach.
              </p>
            </ModernCard>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-amber-400 mb-6">Experience the Future of Token Creation</h2>
            <p className="text-white/80 mb-8 max-w-3xl mx-auto">
              Create your token using our advanced Token-2022 Extension Pointer approach and benefit from improved
              efficiency, lower costs, and better integration with the Solana ecosystem.
            </p>

            <Link href="/create">
              <ModernButton size="lg" className="px-8 py-4">
                Create Your Token Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </ModernButton>
            </Link>
          </section>
        </div>
      </div>
    </SiteLayout>
  )
}
