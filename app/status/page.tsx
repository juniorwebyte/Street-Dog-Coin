"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WalletConnect } from "@/components/wallet-connect"
import { useWallet } from "@/hooks/use-wallet"
import { getClaimStatus } from "@/lib/airdrop"
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"

type ClaimStatus = {
  id: string
  timestamp: number
  amount: string
  status: "pending" | "completed" | "failed"
  txHash?: string
}

export default function StatusPage() {
  const { address, isConnected } = useWallet()
  const [claims, setClaims] = useState<ClaimStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected && address) {
      fetchClaimStatus()
    }
  }, [isConnected, address])

  const fetchClaimStatus = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getClaimStatus(address!)
      setClaims(result)
    } catch (err) {
      setError("Erro ao carregar status das reivindicações. Tente novamente.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Concluído</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pendente</Badge>
      case "failed":
        return <Badge className="bg-red-500">Falhou</Badge>
      default:
        return <Badge>Desconhecido</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Status das Reivindicações</h1>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Conecte sua carteira</CardTitle>
            <CardDescription>
              Conecte sua carteira para ver o status das suas reivindicações de airdrop.
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
            <p className="text-lg">Carregando status das reivindicações...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : claims.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma reivindicação encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6">Você ainda não reivindicou nenhum token do airdrop.</p>
            <div className="flex justify-center">
              <Link href="/claim">
                <Button>Reivindicar Airdrop</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Suas Reivindicações</CardTitle>
            <CardDescription>
              Histórico de reivindicações para o endereço {address?.slice(0, 6)}...{address?.slice(-4)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell>{formatDate(claim.timestamp)}</TableCell>
                    <TableCell>{claim.amount} $WBC</TableCell>
                    <TableCell>{getStatusBadge(claim.status)}</TableCell>
                    <TableCell>
                      {claim.txHash ? (
                        <a
                          href={`https://etherscan.io/tx/${claim.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-500 hover:underline"
                        >
                          Ver <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={fetchClaimStatus}>
              Atualizar
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

