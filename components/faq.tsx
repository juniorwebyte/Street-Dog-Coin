"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export function FAQ() {
  return (
    <motion.div className="grid gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
            A quantidade de tokens $SDC que você pode receber será anunciada após a conclusão bem-sucedida de todas as
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
      <Card>
        <CardHeader>
          <CardTitle>Quais carteiras são compatíveis com o airdrop?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Recomendamos o uso de MetaMask ou outras carteiras Web3 compatíveis com EVM em navegadores desktop. Algumas
            carteiras móveis, como o Trust Wallet DApp, podem ter limitações ao interagir com links externos, o que pode
            dificultar a conclusão de todas as tarefas necessárias.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>O que acontece se eu não conseguir completar todas as tarefas?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Todas as tarefas devem ser concluídas para ser elegível ao airdrop. Se você encontrar dificuldades, entre em
            contato com nossa equipe de suporte através do nosso canal oficial no Telegram.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

