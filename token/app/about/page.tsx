import SiteLayout from "@/components/site-layout"

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">About MaytaToken</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">The advanced token creation platform for Solana</p>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">What is MaytaToken?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              MaytaToken is a powerful platform designed to simplify the process of creating tokens on the Solana
              blockchain. Our platform allows you to create SPL tokens with embedded metadata in a single transaction,
              making the token creation process faster, more efficient, and more accessible.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Whether you're creating a token for a new project, a community, or just for fun, MaytaToken provides all
              the tools you need to get started quickly and easily.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">Key Features</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Create tokens with embedded metadata in a single transaction</li>
              <li>Customize token supply, decimals, and other properties</li>
              <li>Upload and attach custom images to your token</li>
              <li>Set mint, freeze, and transfer fee authorities</li>
              <li>Add social links and other metadata to your token</li>
              <li>User-friendly interface with real-time feedback</li>
              <li>Secure and reliable token creation process</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-4">How It Works</h2>
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-4">
              <li>
                <span className="font-bold">Connect your wallet</span>
                <p className="ml-6 mt-1">Connect your Solana wallet (like Phantom) to get started.</p>
              </li>
              <li>
                <span className="font-bold">Fill out the token details</span>
                <p className="ml-6 mt-1">Enter your token name, symbol, supply, and other details.</p>
              </li>
              <li>
                <span className="font-bold">Upload an image</span>
                <p className="ml-6 mt-1">Add a custom image to represent your token.</p>
              </li>
              <li>
                <span className="font-bold">Set authorities</span>
                <p className="ml-6 mt-1">Choose which authorities you want to retain for your token.</p>
              </li>
              <li>
                <span className="font-bold">Create your token</span>
                <p className="ml-6 mt-1">Click the "Create Token" button and confirm the transaction in your wallet.</p>
              </li>
              <li>
                <span className="font-bold">Done!</span>
                <p className="ml-6 mt-1">Your token is now created and ready to use on the Solana blockchain.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
