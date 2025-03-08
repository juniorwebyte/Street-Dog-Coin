"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getAirdropStats } from "@/lib/airdrop"
import { useWeb3 } from "@/hooks/use-web3"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"
import { motion } from "framer-motion"
import { formatNumber } from "@/lib/utils"

type AirdropStatsType = {
  totalTokens: string
  claimedTokens: string
  totalParticipants: number
  remainingDays: number
}

export function AirdropStats() {
  const [stats, setStats] = useState<AirdropStatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { web3, chainId, isConnected, tokenBalance } = useWeb3()
  const { language } = useLanguage()

  // Função para atualizar estatísticas
  const updateStats = async () => {
    if (!isConnected) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Usar a função de simulação para obter estatísticas
      const data = await getAirdropStats()
      setStats(data)
    } catch (error) {
      console.error("Error loading stats:", error)
      setError(error instanceof Error ? error.message : getTranslation(language, "unknownError"))
    } finally {
      setIsLoading(false)
    }
  }

  // Atualizar estatísticas quando conectado
  useEffect(() => {
    updateStats()

    // Configurar atualização periódica (a cada 30 segundos)
    const interval = setInterval(() => {
      updateStats()
    }, 30000)

    return () => clearInterval(interval)
  }, [isConnected, language])

  if (!isConnected) {
    return null
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{getTranslation(language, "error")}</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!stats) return null

  const claimPercentage = (Number(stats.claimedTokens) / Number(stats.totalTokens)) * 100

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StatCard
        title={getTranslation(language, "totalTokens")}
        value={`${formatNumber(Number(stats.totalTokens))} $SDC`}
      />
      <StatCard
        title={getTranslation(language, "claimedTokens")}
        value={`${formatNumber(Number(stats.claimedTokens))} $SDC`}
        progress={claimPercentage}
      />
      <StatCard title={getTranslation(language, "participants")} value={formatNumber(stats.totalParticipants)} />
      <StatCard title={getTranslation(language, "remainingDays")} value={stats.remainingDays.toString()} />
    </motion.div>
  )
}

function StatCard({ title, value, progress }: { title: string; value: string; progress?: number }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card className="bg-opacity-80 backdrop-blur-sm">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {progress !== undefined && <Progress value={progress} className="h-2 mt-2" />}
        </CardContent>
      </Card>
    </motion.div>
  )
}

