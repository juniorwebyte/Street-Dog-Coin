"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function WalletWarningDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Verificar se o aviso já foi mostrado nesta sessão
    const hasSeenWarning = sessionStorage.getItem("hasSeenWalletWarning")

    if (!hasSeenWarning) {
      // Mostrar o aviso após um pequeno delay para não interferir com o carregamento inicial
      const timer = setTimeout(() => {
        setOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    // Marcar que o usuário já viu o aviso nesta sessão
    sessionStorage.setItem("hasSeenWalletWarning", "true")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="h-5 w-5" />
            Aviso Importante
          </DialogTitle>
          <DialogDescription>
            Para garantir a melhor experiência durante o processo de airdrop, leia as informações abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p>
            Recomendamos <strong>não usar o Trust Wallet DApp</strong> para que você possa concluir a tarefa do Telegram
            corretamente.
          </p>
          <p>
            Algumas carteiras móveis podem ter limitações ao interagir com links externos, o que pode dificultar a
            conclusão de todas as tarefas necessárias.
          </p>
          <p>
            Para uma experiência completa, recomendamos usar <strong>MetaMask</strong> ou outra carteira compatível em
            um navegador desktop.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            Entendi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

