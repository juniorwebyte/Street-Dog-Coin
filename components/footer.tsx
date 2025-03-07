import Link from "next/link"
import { Twitter, Github, DiscIcon as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              W
            </div>
            <span className="font-bold">Street Dog Coin</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
          <Link href="https://webytebr.com/" target="_blank" title="Webyte | Tecnologia Laravel" rel="noopener noreferrer">
            © 2025 Webyte® Todos os direitos reservados.            
          </Link>
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-4">
            <Link href="https://x.com/StreetDogCoin" target="_blank" rel="noopener noreferrer">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Link>
            <Link href="https://github.com/juniorwebyte/Street-Dog-Coin" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Link>
            <Link href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <Discord className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Link>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-primary">
              Termos
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">
              Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

