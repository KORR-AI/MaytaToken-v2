"use client"
import { X } from "lucide-react"
import Link from "next/link"

interface DisclaimerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DisclaimerModal({ isOpen, onClose }: DisclaimerModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-amber-500/30 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-amber-500/30 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-400">Legal Disclaimer</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-white/80 text-sm">
          <p>
            The information provided on MaytaToken is for general informational purposes only. All information is
            provided in good faith, however, we make no representation or warranty of any kind, express or implied,
            regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on
            the site.
          </p>

          <p>
            <strong className="text-white">No Financial Advice:</strong> The information contained on this website is
            not intended as, and shall not be understood or construed as financial advice. We are not financial
            advisors, and the information provided is not a substitute for financial advice from a professional.
          </p>

          <p>
            <strong className="text-white">Cryptocurrency Risk Warning:</strong> Trading and investing in
            cryptocurrencies involves substantial risk of loss and is not suitable for every investor. The valuation of
            cryptocurrencies may fluctuate and, as a result, clients may lose more than their original investment.
          </p>

          <p>
            <strong className="text-white">Limitation of Liability:</strong> In no event shall MaytaToken be liable for
            anything arising out of or in any way connected with your use of this website, whether such liability is
            under contract, tort, or otherwise.
          </p>

          <div className="pt-4 mt-4 border-t border-white/10">
            <Link
              href="/legal/disclaimer"
              className="text-amber-400 hover:text-amber-300 text-xs"
              onClick={(e) => {
                e.preventDefault()
                onClose()
                window.open("/legal/disclaimer", "_blank")
              }}
            >
              View Full Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
