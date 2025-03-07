"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/hooks/use-web3"
import { Copy, Share2, Users, LinkIcon, AlertCircle } from "lucide-react"

export function ReferralSystem() {
  const { address, isConnected, getUserInfo } = useWeb3()
  const [referralLink, setReferralLink] = useState("")
  const [referralCount, setReferralCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isConnected && address) {
      // Gerar link de referral
      const baseUrl = window.location.origin
      setReferralLink(`${baseUrl}/claim?ref=${address}`)

      // Carregar informações de referral
      loadReferralInfo()
    } else {
      setReferralLink("")
      setReferralCount(0)
    }
  }, [isConnected, address])

  const loadReferralInfo = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      const userInfo = await getUserInfo(address)
      setReferralCount(userInfo.referrals)
    } catch (error) {
      console.error("Error loading referral info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Link copiado!",
      description: "Link de referral copiado para a área de transferência.",
    })
  }

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      `Participe do airdrop de tokens $STDOG da Street Dog Coin e ganhe tokens grátis! Use meu link de referral: ${referralLink}`,
    )
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  const shareOnTelegram = () => {
    const text = encodeURIComponent(
      `Participe do airdrop de tokens $STDOG da Street Dog Coin e ganhe tokens grátis! Use meu link de referral: ${referralLink}`,
    )
    window.open(`https://t.me/share/url?url=${referralLink}&text=${text}`, "_blank")
  }

  if (!isConnected) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Conecte sua carteira para acessar o sistema de referral.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Sistema de Referral
        </CardTitle>
        <CardDescription>Convide amigos e ganhe 200 tokens $STDOG por cada pessoa que usar seu link.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="font-semibold">Total de referrals:</div>
          <div className="text-lg">{isLoading ? "..." : referralCount}</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Seu link de referral:</div>
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="gap-2" onClick={shareOnTwitter}>
          <Share2 className="h-4 w-4" />
          Twitter
        </Button>
        <Button variant="outline" className="gap-2" onClick={shareOnTelegram}>
          <LinkIcon className="h-4 w-4" />
          Telegram
        </Button>
      </CardFooter>
    </Card>
  )
}

