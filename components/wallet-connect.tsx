"use client"

import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/hooks/use-wallet"
import { Loader2, Wallet } from "lucide-react"

interface WalletConnectProps {
  className?: string
}

export function WalletConnect({ className }: WalletConnectProps) {
  const { address, isConnected, isConnecting, connect, disconnect } = useWeb3()

  if (isConnected) {
    return (
      <div className={className}>
        <Button variant="outline" onClick={disconnect} className="font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Button>
      </div>
    )
  }

  return (
    <div className={className}>
      <Button onClick={connect} disabled={isConnecting}>
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Conectando...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Conectar Carteira
          </>
        )}
      </Button>
    </div>
  )
}

