import Link from "next/link"
import { WalletConnect } from "@/components/wallet-connect"

export function Navbar() {
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
          <Link href="/configuracao" className="text-sm font-medium hover:text-primary">
            Configuração
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}

