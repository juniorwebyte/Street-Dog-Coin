"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Twitter, MessageCircle, ExternalLink, Copy } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

export function ParticipationInstructions() {
  const { toast } = useToast()

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Instruções para Participantes</AlertTitle>
        <AlertDescription>
          Siga estas etapas para participar do airdrop Street Dog Coin e ter a chance de receber tokens gratuitos.
        </AlertDescription>
      </Alert>

      <TaskSection
        title="Tarefa 1: Seguir no Twitter"
        icon={Twitter}
        steps={[
          <>
            Siga{" "}
            <a
              key="twitter-link"
              href="https://x.com/StreetDogCoin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              @StreetDogCoin <ExternalLink className="inline h-4 w-4" />
            </a>
          </>,
          <Input key="twitter-input" placeholder="Digite seu nome de usuário do Twitter" />,
          <Button key="twitter-verify" className="w-full mt-2">
            Enviar para verificação
          </Button>,
        ]}
      />

      <TaskSection
        title="Tarefa 2: Retweet com Hashtags"
        icon={Twitter}
        steps={[
          <>
            Faça um quote retweet do{" "}
            <a
              key="retweet-link"
              href="https://x.com/StreetDogCoin/status/1829273641130873292"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              tweet do Street Dog Coin <ExternalLink className="inline h-4 w-4" />
            </a>{" "}
            com as hashtags:
            <div key="hashtags" className="mt-2 p-3 bg-muted rounded-md text-sm">
              #airdrop #Dogecoin #eth #ShibaInu #mainnet #pepecoin #web3 #crypto #arbitrum #OFFICIALTRUMP #memecoins
              #StreetDogCoin #CryptoForACause #DogAdoption #BlockchainForGood #CryptoWithPurpose #SupportAnimalRescue
              #DogRescue #StreetDogs #CharityCrypto #DogLovers
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                const hashtags =
                  "#airdrop #Dogecoin #eth #ShibaInu #mainnet #pepecoin #web3 #crypto #arbitrum #OFFICIALTRUMP #memecoins #StreetDogCoin #CryptoForACause #DogAdoption #BlockchainForGood #CryptoWithPurpose #SupportAnimalRescue #DogRescue #StreetDogs #CharityCrypto #DogLovers"
                navigator.clipboard.writeText(hashtags)
                toast({
                  title: "Copiado!",
                  description: "Hashtags copiadas para a área de transferência.",
                  duration: 3000,
                })
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar Hashtags
            </Button>
          </>,
          <Input key="retweet-input" placeholder="Cole o link do seu retweet" />,
          <Button key="retweet-verify" className="w-full mt-2">
            Enviar para verificação
          </Button>,
        ]}
      />

      <TaskSection
        title="Tarefa 3: Curtir no Twitter"
        icon={Twitter}
        steps={[
          <>
            Curta o{" "}
            <a
              key="like-link"
              href="https://x.com/intent/like?tweet_id=1829273641130873292"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              tweet do Street Dog Coin <ExternalLink className="inline h-4 w-4" />
            </a>
          </>,
        ]}
      />

      <TaskSection
        title="Tarefa 4: Entrar no Grupo do Telegram"
        icon={MessageCircle}
        steps={[
          <>
            Entre no{" "}
            <a
              key="telegram-group-link"
              href="https://t.me/StreetDogCoin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              grupo do Telegram do Street Dog Coin <ExternalLink className="inline h-4 w-4" />
            </a>
          </>,
          <>
            Obtenha seu ID de usuário do Telegram (use{" "}
            <a
              key="telegram-userinfo-link"
              href="https://t.me/StreetDogCoin" // Deveria ser @userinfobot
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              @StreetDogCoin <ExternalLink className="inline h-4 w-4" />
            </a>
            )
          </>,
          <Input key="telegram-input" placeholder="Digite seu ID do Telegram (ex: @6123567677)" />,
          <Button key="telegram-verify" className="w-full mt-2">
            Enviar para verificação
          </Button>,
        ]}
      />

      <Alert className="mt-8">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Reivindicar Airdrop</AlertTitle>
        <AlertDescription>
          Após completar todas as tarefas, você poderá reivindicar seus tokens do airdrop. Certifique-se de ter uma
          carteira compatível conectada para receber os tokens.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <Button size="lg">Reivindicar Airdrop</Button>
      </div>
    </motion.div>
  )
}

function TaskSection({ title, icon: Icon, steps }: { title: string; icon: any; steps: React.ReactNode[] }) {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-4">
            {steps.map((step, index) => (
              <motion.li
                key={index}
                className="text-muted-foreground"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {step}
              </motion.li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </motion.div>
  )
}

