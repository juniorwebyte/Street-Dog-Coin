"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { WalletConnect } from "@/components/wallet-connect"
import { ReferralSystem } from "@/components/referral-system"
import { useWeb3 } from "@/hooks/use-web3"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function ClaimPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const {
    address,
    isConnected,
    network,
    airdropContract,
    getAirdropInfo,
    getUserInfo,
    claimTokens,
    claimWithReferral,
  } = useWeb3()

  const [isEligible, setIsEligible] = useState<boolean | null>(null)
  const [hasClaimed, setHasClaimed] = useState<boolean | null>(null)
  const [airdropAmount, setAirdropAmount] = useState<string | null>(null)
  const [referralBonus, setReferralBonus] = useState<string | null>(null)
  const [referrer, setReferrer] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Verificar referral no URL
  useEffect(() => {
    const refParam = searchParams.get("ref")
    if (refParam && refParam.startsWith("0x")) {
      setReferrer(refParam)
    }
  }, [searchParams])

  // Verificar elegibilidade quando conectado
  useEffect(() => {
    if (isConnected && address && airdropContract) {
      checkEligibilityStatus()
    }
  }, [isConnected, address, airdropContract])

  const checkEligibilityStatus = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Obter informações do airdrop
      const airdropInfo = await getAirdropInfo()
      setAirdropAmount(airdropInfo.baseAmount)
      setReferralBonus(airdropInfo.refBonus)

      // Verificar se o usuário já reivindicou
      const userInfo = await getUserInfo(address!)
      setHasClaimed(userInfo.claimed)

      // Se não reivindicou, é elegível
      setIsEligible(!userInfo.claimed)
    } catch (err) {
      console.error(err)
      setError("Erro ao verificar elegibilidade. Verifique se está na rede correta.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async () => {
    setIsClaiming(true)
    setError(null)
    try {
      let tx

      if (referrer) {
        // Reivindicar com referral
        tx = await claimWithReferral(referrer)
      } else {
        // Reivindicar sem referral
        tx = await claimTokens()
      }

      setTxHash(tx.transactionHash)
      setClaimSuccess(true)

      toast({
        title: "Sucesso!",
        description: "Tokens reivindicados com sucesso.",
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Erro ao reivindicar tokens. Tente novamente.")
    } finally {
      setIsClaiming(false)
    }
  }

  const getExplorerLink = () => {
    if (!network || !txHash) return "#"
    return `${network.blockExplorerUrl}/tx/${txHash}`
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Reivindicar Airdrop</h1>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Conecte sua carteira</CardTitle>
            <CardDescription>
              Conecte sua carteira para verificar sua elegibilidade e reivindicar tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletConnect />
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card className="text-center py-8">
          <CardContent>
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-lg">Verificando elegibilidade...</p>
          </CardContent>
        </Card>
      ) : claimSuccess ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-500 flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Reivindicação bem-sucedida!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">Parabéns! Você reivindicou com sucesso {airdropAmount} tokens $WBC.</p>
            <p className="text-center text-muted-foreground mb-6">Os tokens foram transferidos para sua carteira.</p>
            <div className="flex justify-center mb-4">
              <a
                href={getExplorerLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:underline"
              >
                Ver transação <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
            <div className="flex justify-center">
              <Link href="/status">
                <Button>Ver Status</Button>
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex-col">
            <Separator className="my-4" />
            <ReferralSystem />
          </CardFooter>
        </Card>
      ) : hasClaimed ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-yellow-500">Já Reivindicado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">Você já reivindicou seus tokens do airdrop.</p>
            <div className="flex justify-center">
              <Link href="/status">
                <Button>Ver Status</Button>
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex-col">
            <Separator className="my-4" />
            <ReferralSystem />
          </CardFooter>
        </Card>
      ) : isEligible ? (
        <Card>
          <CardHeader>
            <CardTitle>Você é elegível!</CardTitle>
            <CardDescription>Você pode reivindicar tokens $WBC do airdrop.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span>Endereço da carteira:</span>
                <span className="font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tokens disponíveis:</span>
                <span className="font-bold">{airdropAmount} $WBC</span>
              </div>
              {referrer && (
                <div className="flex justify-between">
                  <span>Referral:</span>
                  <span className="font-mono">
                    {referrer.slice(0, 6)}...{referrer.slice(-4)}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleClaim} disabled={isClaiming}>
              {isClaiming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Reivindicar Tokens"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-500">Não elegível</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">Infelizmente, seu endereço não é elegível para este airdrop.</p>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Critérios de elegibilidade</AlertTitle>
              <AlertDescription>
                Para ser elegível, você deve ter interagido com o ecossistema Street Dog Coin antes da data do snapshot.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Link href="/">
                <Button variant="outline">Voltar para Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

