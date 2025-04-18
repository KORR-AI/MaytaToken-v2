import Link from "next/link"
import SiteLayout from "@/components/site-layout"
import DirectPhantomLink from "@/components/direct-phantom-link"

export default function PhantomHelpPage() {
  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          <span className="text-white">Phantom </span>
          <span className="gradient-text">Connection Help</span>
        </h1>

        <div className="space-y-6">
          <div className="bg-black/50 border border-amber-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-amber-400 mb-4">Recommended Method</h2>
            <p className="text-white/80 mb-4">The most reliable way to connect is to use Phantom's built-in browser:</p>

            <ol className="list-decimal list-inside space-y-2 text-white/80">
              <li>Open the Phantom app on your device</li>
              <li>
                Tap the <span className="text-amber-400 font-bold">Browse</span> icon at the bottom
              </li>
              <li>Enter this URL in the address bar</li>
              <li>Use the app directly within Phantom's browser</li>
            </ol>

            <DirectPhantomLink />
          </div>

          <div className="bg-black/50 border border-amber-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-amber-400 mb-4">Alternative Connection Methods</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">1. Try our minimal connection page</h3>
                <p className="text-white/80 mb-2">
                  We've created an ultra-simple page that should work in any browser:
                </p>
                <a
                  href="/minimal-connect.html"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
                >
                  Open Minimal Connection Page
                </a>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">2. Use a QR code from another device</h3>
                <p className="text-white/80 mb-2">Scan this QR code with another device to open the app:</p>
                <div className="flex justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://your-app-url.vercel.app"
                    alt="QR Code"
                    className="w-48 h-48 bg-white p-2 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/50 border border-red-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">Troubleshooting</h2>

            <div className="space-y-4 text-white/80">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">White Screen Issues</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Clear Phantom app cache (Settings > Apps > Phantom > Storage > Clear Cache)</li>
                  <li>Update Phantom to the latest version</li>
                  <li>Restart your device</li>
                  <li>Try using a different internet connection (switch between Wi-Fi and mobile data)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">Connection Issues</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Make sure you have SOL in your wallet for transaction fees</li>
                  <li>Check if Phantom is connected to the correct network (Mainnet)</li>
                  <li>Try using a different wallet if available</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/create"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-6 rounded"
            >
              Back to Token Creator
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
