"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Contexto para fornecer valores simulados quando os reais não estão disponíveis
type FallbackContextType = {
  useFallback: boolean
  setUseFallback: (value: boolean) => void
  fallbackValues: {
    balance: string
    tokenBalance: string
    isEligible: boolean
    hasClaimed: boolean
    airdropAmount: string
  }
}

const FallbackContext = createContext<FallbackContextType | undefined>(undefined)

export function FallbackProvider({ children }: { children: ReactNode }) {
  const [useFallback, setUseFallback] = useState(false)

  // Valores padrão para desenvolvimento
  const fallbackValues = {
    balance: "0.1",
    tokenBalance: "1000",
    isEligible: true,
    hasClaimed: false,
    airdropAmount: "1000",
  }

  // Verificar se estamos em ambiente de desenvolvimento
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Verificar se há variáveis de ambiente para contratos
      const hasContracts =
        !!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM || !!process.env.NEXT_PUBLIC_TOKEN_ADDRESS

      // Se não houver contratos configurados, usar fallback
      if (!hasContracts) {
        setUseFallback(true)
        console.log("Usando valores simulados para desenvolvimento (nenhum contrato configurado)")
      }
    }
  }, [])

  return (
    <FallbackContext.Provider value={{ useFallback, setUseFallback, fallbackValues }}>
      {children}
    </FallbackContext.Provider>
  )
}

export function useFallback() {
  const context = useContext(FallbackContext)
  if (context === undefined) {
    throw new Error("useFallback must be used within a FallbackProvider")
  }
  return context
}

