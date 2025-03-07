"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { useWeb3 } from "@/hooks/use-web3"
import { AirdropStats } from "@/components/airdrop-stats"
import { HowItWorks } from "@/components/how-it-works"
import { Timeline } from "@/components/timeline"
import { CheckCircle, Twitter, MessageCircle, ExternalLink, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { WelcomePopup } from "@/components/welcome-popup"
import { HashtagCopyButton } from "@/components/hashtag-copy-button"
import { TaskVerification } from "@/components/task-verification"

export default function Home() {
  const { address, isConnected, disconnect } = useWeb3()
  const [activeTab, setActiveTab] = useState("participate")
  const [isClient, setIsClient] = useState(false)

  // Task completion state
  const [tasks, setTasks] = useState({
    twitter: false,
    retweet: false,
    like: false,
    telegram: false,
  })

  const [verificationComplete, setVerificationComplete] = useState(false)

  // Update task completion
  const completeTask = (task: keyof typeof tasks) => {
    setTasks((prev) => ({
      ...prev,
      [task]: true,
    }))
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // or a loading spinner
  }

  // Hashtags for the copy button
  const hashtags =
    "#airdrop #Dogecoin #eth #ShibaInu #mainnet #pepecoin #web3 #crypto #arbitrum #OFFICIALTRUMP #memecoins #StreetDogCoin #CryptoForACause #CryptoForACause #DogAdoption #BlockchainForGood #CryptoWithPurpose #SupportAnimalRescue #DogRescue #StreetDogs #CharityCrypto #DogLovers"

  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomePopup />

      <motion.div
        className="flex flex-col items-center justify-center text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Street Dog Coin Airdrop</h1>
        <p className="text-xl text-muted-foreground max-w-[700px] mb-8">
          Participe do nosso airdrop e receba tokens $STDOG gratuitamente. Complete as tarefas e reivindique seus tokens
          agora!
        </p>

        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.div
              key="connected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-4"
            >
              <p className="text-sm text-muted-foreground mb-2">Conectado como:</p>
              <p className="font-mono text-sm mb-2">{address}</p>
              <Button variant="outline" onClick={disconnect}>
                Desconectar Carteira
              </Button>
            </motion.div>
          ) : (
            <motion.div key="disconnected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WalletConnect />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>{isConnected && <AirdropStats />}</AnimatePresence>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto mt-16">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participate">Participar</TabsTrigger>
          <TabsTrigger value="how">Como Funciona</TabsTrigger>
          <TabsTrigger value="timeline">Cronograma</TabsTrigger>
          <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="participate">
              <ParticipationInstructions
                tasks={tasks}
                completeTask={completeTask}
                hashtags={hashtags}
                verificationComplete={verificationComplete}
                setVerificationComplete={setVerificationComplete}
              />
            </TabsContent>

            <TabsContent value="how">
              <HowItWorks />
            </TabsContent>

            <TabsContent value="timeline">
              <Timeline />
            </TabsContent>

            <TabsContent value="faq">
              <FAQ />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

function ParticipationInstructions({
  tasks,
  completeTask,
  hashtags,
  verificationComplete,
  setVerificationComplete,
}: {
  tasks: Record<string, boolean>
  completeTask: (task: string) => void
  hashtags: string
  verificationComplete: boolean
  setVerificationComplete: (complete: boolean) => void
}) {
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
        completed={tasks.twitter}
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
          <Button key="twitter-verify" className="w-full mt-2" onClick={() => completeTask("twitter")}>
            {tasks.twitter ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verificado
              </>
            ) : (
              "Enviar para verificação"
            )}
          </Button>,
        ]}
      />

      <TaskSection
        title="Tarefa 2: Retweet com Hashtags"
        icon={Twitter}
        completed={tasks.retweet}
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
            <div key="hashtags-display" className="mt-2 p-3 bg-muted rounded-md text-sm font-mono">
              {hashtags}
            </div>
            <div className="mt-2">
              <HashtagCopyButton hashtags={hashtags} />
            </div>
          </>,
          <Input key="retweet-input" placeholder="Cole o link do seu retweet" />,
          <Button key="retweet-verify" className="w-full mt-2" onClick={() => completeTask("retweet")}>
            {tasks.retweet ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verificado
              </>
            ) : (
              "Enviar para verificação"
            )}
          </Button>,
        ]}
      />

      <TaskSection
        title="Tarefa 3: Curtir no Twitter"
        icon={Twitter}
        completed={tasks.like}
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
          <Button key="like-verify" className="w-full mt-2" onClick={() => completeTask("like")}>
            {tasks.like ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verificado
              </>
            ) : (
              "Verificar curtida"
            )}
          </Button>,
        ]}
      />

      <TaskSection
        title="Tarefa 4: Entrar no Grupo do Telegram"
        icon={MessageCircle}
        completed={tasks.telegram}
        steps={[
          <>
            Entre no{" "}
            <a
              key="telegram-link"
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
              key="userinfobot-link"
              href="https://t.me/userinfobot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              @userinfobot <ExternalLink className="inline h-4 w-4" />
            </a>
            )
          </>,
          <Input key="telegram-input" placeholder="Digite seu ID do Telegram (ex: 6123567677)" />,
          <Button key="telegram-verify" className="w-full mt-2" onClick={() => completeTask("telegram")}>
            {tasks.telegram ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verificado
              </>
            ) : (
              "Enviar para verificação"
            )}
          </Button>,
        ]}
      />

      <TaskVerification
        tasksCompleted={Object.values(tasks).every((task) => task)}
        onVerificationComplete={() => setVerificationComplete(true)}
      />
    </motion.div>
  )
}

function TaskSection({
  title,
  icon: Icon,
  steps,
  completed = false,
}: {
  title: string
  icon: any
  steps: React.ReactNode[]
  completed?: boolean
}) {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className={completed ? "border-green-500/20" : ""}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            {title}
          </CardTitle>
          {completed && (
            <span className="flex items-center text-green-500 text-sm font-medium">
              <CheckCircle className="h-4 w-4 mr-1" />
              Concluído
            </span>
          )}
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

function FAQ() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Quem é elegível para o airdrop?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Usuários que completarem todas as tarefas especificadas, incluindo seguir nossas redes sociais e interagir
            com nosso conteúdo.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quantos tokens posso receber?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            A quantidade de tokens $STDOG que você pode receber será anunciada após a conclusão bem-sucedida de todas as
            tarefas.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Por quanto tempo o airdrop estará disponível?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            O período de participação no airdrop é limitado. Recomendamos que você complete todas as tarefas o mais
            rápido possível para garantir sua participação.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Como posso verificar se minhas tarefas foram concluídas?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Após enviar suas informações para verificação em cada tarefa, nosso sistema irá validá-las. Você receberá
            uma confirmação assim que todas as tarefas forem verificadas com sucesso.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

