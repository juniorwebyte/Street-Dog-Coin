"use client"

import Link from "next/link"
import { WalletConnect } from "@/components/wallet-connect"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function Navbar() {
  const { isConnected, address, disconnect } = useWallet()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            W
          </div>
          <span className="font-bold text-xl">Street Dog Coin</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 mx-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/claim" className="text-sm font-medium hover:text-primary">
            Reivindicar
          </Link>
          <Link href="/check" className="text-sm font-medium hover:text-primary">
            Verificar
          </Link>
          <Link href="/status" className="text-sm font-medium hover:text-primary">
            Status
          </Link>
          <Link href="/wallet" className="text-sm font-medium hover:text-primary">
            Carteira
          </Link>
          <Link href="/configuracao" className="text-sm font-medium hover:text-primary">
            Configuração
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <Link href="/wallet">
                <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
                  <Wallet className="h-4 w-4" />
                  <span className="font-mono text-xs">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </Button>
              </Link>
              <WalletConnect />
            </div>
          ) : (
            <WalletConnect />
          )}
        </div>
      </div>
    </header>
  )
}

