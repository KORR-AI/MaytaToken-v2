"use client"

import SiteLayout from "@/components/site-layout"
import ModernCard from "@/components/modern-card"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

export default function DisclaimerPage() {
  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/home" className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold mb-8 text-center">
            <span className="text-white">Legal </span>
            <span className="gradient-text">Disclaimer</span>
          </h1>

          <ModernCard className="p-8" variant="gradient">
            <div className="space-y-6 text-white/80">
              <section>
                <h2 className="text-xl font-bold text-amber-400 mb-3">1. General Information</h2>
                <p>
                  The information provided on MaytaToken ("we," "us," or "our") is for general informational purposes
                  only. All information on our platform is provided in good faith, however, we make no representation or
                  warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability,
                  availability, or completeness of any information on our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-amber-400 mb-3">2. No Financial Advice</h2>
                <p>
                  The information contained on MaytaToken is not intended as, and shall not be understood or construed
                  as, financial advice. We are not a financial advisor, registered investment advisor, broker/dealer, or
                  financial planner. The information provided on our platform is not intended as a substitute for
                  professional financial advice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-amber-400 mb-3">3. Cryptocurrency Risk Warning</h2>
                <p>
                  Cryptocurrency investments are volatile and high-risk in nature. Investments in cryptocurrencies,
                  tokens, and other digital assets may result in losses. The cryptocurrency market is highly
                  unpredictable, and we do not guarantee any particular outcome. You should never invest more than you
                  can afford to lose.
                </p>
                <p className="mt-2">
                  Our token creation service enables users to create tokens on the Solana blockchain. We do not endorse,
                  guarantee, or vouch for any tokens created using our service. Users are solely responsible for their
                  token creation activities and any consequences thereof.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-amber-400 mb-3">4. Metadata Implementation</h2>
                <p>
                  Our platform uses the Token-2022 Extension Pointer approach for implementing token metadata. While we
                  believe this approach offers advantages over traditional Metaplex metadata implementation, we make no
                  guarantees regarding compatibility with all wallets, exchanges, or other services in the Solana
                  ecosystem. Users should conduct their own research regarding metadata compatibility before creating
                  tokens.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-amber-400 mb-3">5. Limitation of Liability</h2>
                <p>
                  Under no circumstances shall MaytaToken be liable for any direct, indirect, special, incidental,
                  consequential, or punitive damages, including but not limited to, loss of profits, data, use,
                  goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to
                  access or use the service; (ii) any conduct or content of any third party on the service; (iii) any
                  content obtained from the service; and (iv) unauthorized access, use, or alteration of your
                  transmissions or content, whether based on warranty, contract, tort (including negligence), or any
                  other legal theory, whether or not we have been informed of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-amber-400 mb-3">6. Accuracy of Materials</h2>
                <p>
                  The materials appearing on MaytaToken could include technical, typographical, or photographic errors.
                  We do not warrant that any of the materials on our platform are accurate, complete, or current. We may
                  make changes to the materials contained on our platform at any time without notice.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-amber-400 mb-3">7. Links to Third-Party Websites</h2>
                <p>
                  Our platform may contain links to third-party websites or services that are not owned or controlled by
                  MaytaToken. We have no control over, and assume no responsibility for, the content, privacy policies,
                  or practices of any third-party websites or services. You further acknowledge and agree that
                  MaytaToken shall not be responsible or liable, directly or indirectly, for any damage or loss caused
                  or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or
                  services available on or through any such websites or services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-amber-400 mb-3">8. Governing Law</h2>
                <p>
                  These terms shall be governed and construed in accordance with the laws applicable in the jurisdiction
                  where MaytaToken operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-amber-400 mb-3">9. Changes to Disclaimer</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace this disclaimer at any time. If a
                  revision is material, we will try to provide at least 30 days' notice prior to any new terms taking
                  effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-amber-400 mb-3">10. Contact Us</h2>
                <p>If you have any questions about this disclaimer, please contact us at:</p>
                <div className="flex items-center mt-2 text-amber-400">
                  <Mail className="mr-2 h-4 w-4" />
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=maytatoken@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    maytatoken@gmail.com
                  </a>
                </div>
              </section>

              <div className="pt-6 border-t border-white/10 text-center">
                <p className="text-white/60 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </ModernCard>
        </motion.div>
      </div>
    </SiteLayout>
  )
}
