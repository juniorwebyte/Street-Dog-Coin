"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WalletConnect } from "@/components/ui/wallet-connect"
import { useWallet } from "@/hooks/use-wallet"
import { checkEligibility } from "@/lib/airdrop"
import { AlertCircle, CheckCircle, Loader2, Search } from "lucide-react"
import Link from "next/link"

export default function CheckPage() {
  const { address, isConnected } = useWallet()
  const [customAddress, setCustomAddress] = useState("")
  const [isEligible, setIsEligible] = useState<boolean | null>(null)
  const [amount, setAmount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    const addressToCheck = isConnected ? address : customAddress

    if (!addressToCheck || !addressToCheck.startsWith("0x") || addressToCheck.length !== 42) {
      setError("Por favor, insira um endereço Ethereum válido")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await checkEligibility(addressToCheck)
      setIsEligible(result.isEligible)
      setAmount(result.amount)
    } catch (err) {
      setError("Erro ao verificar elegibilidade. Tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Verificar Elegibilidade</h1>

      <Card>
        <CardHeader>
          <CardTitle>Verificar Endereço</CardTitle>
          <CardDescription>Verifique se seu endereço é elegível para o airdrop de tokens $WBC.</CardDescription>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="bg-muted p-4 rounded-lg mb-4">
              <p className="text-sm text-muted-foreground mb-2">Endereço conectado:</p>
              <p className="font-mono">{address}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Conecte sua carteira ou insira um endereço manualmente:
                </p>
                <WalletConnect className="mb-4" />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Insira um endereço Ethereum (0x...)"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isEligible !== null && !isLoading && (
            <div className="mt-6 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold">Resultado:</span>
                {isEligible ? (
                  <span className="text-green-500 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> Elegível
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> Não elegível
                  </span>
                )}
              </div>

              {isEligible && (
                <div className="mt-2">
                  <p>
                    Tokens disponíveis: <span className="font-bold">{amount} $WBC</span>
                  </p>
                  <div className="mt-4">
                    <Link href="/claim">
                      <Button className="w-full">Reivindicar Tokens</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleCheck} disabled={isLoading || (!isConnected && !customAddress)}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Verificar Elegibilidade
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

