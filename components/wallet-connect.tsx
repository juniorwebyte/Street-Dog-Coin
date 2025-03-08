"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2, Wallet, LogOut, RefreshCw, Eye, EyeOff } from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface WalletConnectProps {
  className?: string
  showBalance?: boolean
}

// Improve the WalletConnect component to handle balance display better
export function WalletConnect({ className, showBalance = false }: WalletConnectProps) {
  const { address, isConnected, isConnecting, connect, disconnect, balance, tokenBalance, refreshBalance } = useWallet()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [connectClicked, setConnectClicked] = useState(false)
  const [disconnectClicked, setDisconnectClicked] = useState(false)
  const [showAddress, setShowAddress] = useState(true)

  // Update loading state when balance changes
  useEffect(() => {
    if (isConnected) {
      if (balance !== null && tokenBalance !== null) {
        setIsLoading(false)
      } else {
        setIsLoading(true)
      }
    }
  }, [isConnected, balance, tokenBalance])

  // Refresh balance when connected
  useEffect(() => {
    if (isConnected && address) {
      refreshBalance().catch((error) => {
        console.error("Error refreshing balance:", error)
      })
    }
  }, [isConnected, address, refreshBalance])

  const handleRefresh = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    setIsLoading(true)

    try {
      await refreshBalance()
    } catch (error) {
      console.error("Error refreshing balance:", error)
    } finally {
      setTimeout(() => {
        setIsRefreshing(false)
        setIsLoading(false)
      }, 800)
    }
  }

  const handleConnect = async () => {
    if (connectClicked || isConnecting) return

    setConnectClicked(true)

    try {
      await connect()
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setConnectClicked(false)
    }
  }

  const handleDisconnect = () => {
    if (disconnectClicked) return

    setDisconnectClicked(true)

    try {
      disconnect()
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
      setDisconnectClicked(false)
    }
  }

  const toggleAddressVisibility = () => {
    setShowAddress(!showAddress)
  }

  const formatAddress = (addr: string | null) => {
    if (!addr) return ""
    return showAddress ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "••••••...••••"
  }

  if (isConnected) {
    return (
      <div className={`${className} flex flex-col items-center gap-2`}>
        {showBalance && (
          <Card className="w-full mb-2">
            <CardContent className="p-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ETH:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-20" />
                  ) : (
                    <span className="font-bold">{balance ? Number(balance).toFixed(4) : "0.0000"} ETH</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">$SDC:</span>
                  {isLoading ? (
                    <Skeleton className="h-5 w-20" />
                  ) : (
                    <span className="font-bold">{tokenBalance ? formatNumber(Number(tokenBalance)) : "0"} $SDC</span>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="mt-1 h-8" onClick={handleRefresh} disabled={isRefreshing}>
                  {isRefreshing ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  <span className="ml-1 text-xs">Refresh</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1 font-mono text-xs" onClick={toggleAddressVisibility}>
            <span className="mr-2">{formatAddress(address)}</span>
            {showAddress ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDisconnect}
            title="Disconnect wallet"
            disabled={disconnectClicked}
          >
            {disconnectClicked ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Button onClick={handleConnect} disabled={isConnecting || connectClicked} className="w-full">
        {isConnecting || connectClicked ? (
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

