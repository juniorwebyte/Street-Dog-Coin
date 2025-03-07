"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface TaskVerificationProps {
  tasksCompleted: boolean
  onVerificationComplete: () => void
}

export function TaskVerification({ tasksCompleted, onVerificationComplete }: TaskVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(100)
  const { toast } = useToast()

  useEffect(() => {
    if (isVerifying) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval)
            setVerificationComplete(true)
            onVerificationComplete()

            toast({
              title: "Verificação concluída!",
              description: "Todas as tarefas foram verificadas com sucesso. Você já pode reivindicar seu airdrop.",
            })

            return 0
          }
          return prevTime - 1
        })

        setProgress((prevProgress) => {
          // Calculate progress as a percentage of time elapsed
          const newProgress = Math.floor(((100 - timeLeft + 1) / 100) * 100)
          return newProgress > 100 ? 100 : newProgress
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isVerifying, timeLeft, onVerificationComplete, toast])

  const startVerification = () => {
    if (!tasksCompleted) {
      toast({
        title: "Tarefas incompletas",
        description: "Por favor, complete todas as tarefas antes de iniciar a verificação.",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    toast({
      title: "Verificação iniciada",
      description: "Estamos verificando suas tarefas. Isso levará aproximadamente 100 segundos.",
    })
  }

  if (verificationComplete) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-500">
            <CheckCircle className="h-5 w-5" />
            Verificação Concluída
          </CardTitle>
          <CardDescription>Todas as suas tarefas foram verificadas com sucesso!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Parabéns! Você completou todas as tarefas necessárias e está elegível para receber tokens $STDOG.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/claim">
            <Button size="lg" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Reivindicar Airdrop
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  if (isVerifying) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Verificando Tarefas
          </CardTitle>
          <CardDescription>Por favor, aguarde enquanto verificamos suas tarefas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Progresso da verificação</span>
            <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />

          <div className="flex items-center justify-center gap-2 text-amber-500 mt-4">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Tempo restante: {timeLeft} segundos</span>
          </div>

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Não feche esta página durante o processo de verificação. Isso pode interromper o processo e exigir que
              você comece novamente.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verificação de Tarefas</CardTitle>
        <CardDescription>
          Após completar todas as tarefas, inicie a verificação para habilitar a reivindicação do airdrop.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Nosso sistema verificará se você completou todas as tarefas necessárias. Este processo leva aproximadamente
          100 segundos.
        </p>

        {!tasksCompleted && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Tarefas Incompletas</AlertTitle>
            <AlertDescription>Complete todas as tarefas antes de iniciar a verificação.</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={startVerification} className="w-full" disabled={!tasksCompleted}>
          Iniciar Verificação
        </Button>
      </CardFooter>
    </Card>
  )
}

