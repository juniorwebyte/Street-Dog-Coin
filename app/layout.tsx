import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/contexts/language-context"
import { FallbackProvider } from "@/components/fallback-provider"
import "@/styles/globals.css"
import ClientLayout from "./client-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Street Dog Coin Airdrop",
  description: "Participe do airdrop de tokens $SDC e faça parte do ecossistema Street Dog Coin.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <LanguageProvider>
          <FallbackProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster />
          </FallbackProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}



import './globals.css'