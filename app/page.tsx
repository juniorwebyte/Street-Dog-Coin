"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnect } from "@/components/wallet-connect"
import { useWeb3 } from "@/hooks/use-web3"
import { AirdropStats } from "@/components/airdrop-stats"
import { HowItWorks } from "@/components/how-it-works"
import { Timeline } from "@/components/timeline"
import { motion, AnimatePresence } from "framer-motion"
import { WalletWarningDialog } from "@/components/wallet-warning-dialog"
import { ParticipationInstructions } from "@/components/participation-instructions"
import { FAQ } from "@/components/faq"

export default function Home() {
  const { address, isConnected, disconnect } = useWeb3()
  const [activeTab, setActiveTab] = useState("participate")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Adicionar o componente de aviso */}
      <WalletWarningDialog />

      <motion.div
        className="flex flex-col items-center justify-center text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Street Dog Coin Airdrop</h1>
        <p className="text-xl text-muted-foreground max-w-[700px] mb-8">
          Participe do nosso airdrop e receba tokens $SDC gratuitamente. Complete as tarefas e reivindique seus tokens
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
              <WalletConnect showBalance={true} className="max-w-xs mx-auto" />
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
              <ParticipationInstructions />
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

