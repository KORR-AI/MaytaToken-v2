"use client"

import { motion } from "framer-motion"
import SiteLayout from "@/components/site-layout"
import ModernCard from "@/components/modern-card"
import ModernButton from "@/components/modern-button"
import { Mail, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto">
        <Link href="/home" className="inline-flex items-center text-amber-400 hover:text-amber-300 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Contact </span>
            <span className="gradient-text">MaytaToken</span>
          </h1>
          <p className="text-xl text-white/80">Have questions or feedback? We'd love to hear from you.</p>
        </motion.div>

        <ModernCard className="p-8" variant="gradient">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-900/30 flex items-center justify-center">
              <Mail className="w-8 h-8 text-amber-400" />
            </div>

            <h2 className="text-2xl font-bold text-amber-400">Email Us</h2>

            <p className="text-white/80 text-center max-w-md">
              For inquiries, support, or feedback, please reach out to us at:
            </p>

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=maytatoken@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 text-xl hover:text-amber-300 transition-colors duration-300 flex items-center"
            >
              maytatoken@gmail.com
            </a>

            <ModernButton
              onClick={() =>
                window.open("https://mail.google.com/mail/?view=cm&fs=1&to=maytatoken@gmail.com", "_blank")
              }
              className="mt-4"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Email
            </ModernButton>
          </div>
        </ModernCard>

        <div className="mt-12 text-center">
          <p className="text-white/60">
            We typically respond to all inquiries within 24-48 hours during business days.
          </p>
        </div>
      </div>
    </SiteLayout>
  )
}
