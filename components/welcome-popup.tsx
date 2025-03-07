"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Show popup after a short delay to ensure it renders after page load
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Aviso Importante
          </DialogTitle>
          <DialogDescription>
            Para garantir a melhor experiência durante o processo de airdrop, leia as informações abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md bg-yellow-500/10 p-4 border border-yellow-500/20">
            <p className="text-sm font-medium">
              <span className="font-bold">Recomendamos não usar o Trust Wallet DApp</span> para que você possa concluir
              a tarefa do Telegram corretamente.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Algumas carteiras móveis podem ter limitações ao interagir com links externos, o que pode dificultar a
            conclusão de todas as tarefas necessárias.
          </p>
          <p className="text-sm text-muted-foreground">
            Para uma experiência completa, recomendamos usar MetaMask ou outra carteira compatível em um navegador
            desktop.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} className="w-full">
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

