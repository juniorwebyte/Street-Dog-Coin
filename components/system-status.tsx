"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useWeb3 } from "@/hooks/use-web3"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { SUPPORTED_NETWORKS } from "@/lib/constants"
import { getContractAddress } from "@/utils/constants"
import type { AbiItem } from "web3-utils"
import airdropABI from "@/lib/abi/airdrop.json"
import { useAddress } from "@/hooks/use-address"

// Melhorar o componente SystemStatus para verificar a disponibilidade do contrato
export function SystemStatus() {
  const { web3, chainId, isConnected } = useWeb3()
  const [status, setStatus] = useState<{
    ready: boolean
    message: string
    loading: boolean
  }>({
    ready: false,
    message: "Verificando status do sistema...",
    loading: true,
  })
  const { address } = useAddress()

  useEffect(() => {
    // Improve the checkStatus function to handle missing methods
    const checkStatus = async () => {
      if (!isConnected || !web3 || !chainId) {
        setStatus({
          ready: false,
          message: "Conecte sua carteira para verificar o status do sistema",
          loading: false,
        })
        return
      }

      setStatus((prev) => ({ ...prev, loading: true }))

      try {
        // Check if the network is supported
        const currentNetwork = SUPPORTED_NETWORKS.find((n) => n.chainId === chainId)
        if (!currentNetwork) {
          setStatus({
            ready: false,
            message: `Rede não suportada (ID: ${chainId}). Por favor, mude para uma rede suportada.`,
            loading: false,
          })
          return
        }

        // Check if the contract is configured for this network
        const contractAddress = getContractAddress(chainId)
        if (!contractAddress || !web3.utils.isAddress(contractAddress)) {
          setStatus({
            ready: false,
            message: `Contrato não configurado para a rede ${currentNetwork.name}`,
            loading: false,
          })
          return
        }

        // Check if the contract exists
        try {
          const code = await web3.eth.getCode(contractAddress)
          if (code === "0x" || code === "0x0") {
            setStatus({
              ready: false,
              message: `Contrato não encontrado no endereço ${contractAddress}`,
              loading: false,
            })
            return
          }

          // Check if the contract has the necessary methods
          try {
            const contract = new web3.eth.Contract(airdropABI as AbiItem[], contractAddress)

            // Check if the ABI includes the necessary methods
            const hasGetAirdropInfo = airdropABI.some(
              (item: any) => item.type === "function" && item.name === "getAirdropInfo",
            )

            const hasGetUserInfo = airdropABI.some(
              (item: any) => item.type === "function" && item.name === "getUserInfo",
            )

            const hasIsEligible = airdropABI.some((item: any) => item.type === "function" && item.name === "isEligible")

            if (!hasGetAirdropInfo) {
              setStatus({
                ready: false,
                message: "Contrato não possui o método getAirdropInfo",
                loading: false,
              })
              return
            }

            if (!hasGetUserInfo) {
              setStatus({
                ready: false,
                message: "Contrato não possui o método getUserInfo",
                loading: false,
              })
              return
            }

            if (!hasIsEligible) {
              setStatus({
                ready: false,
                message: "Contrato não possui o método isEligible",
                loading: false,
              })
              return
            }

            // Verificar se os métodos realmente existem no contrato
            try {
              // Tentar chamar os métodos para verificar se eles existem
              await contract.methods.getAirdropInfo().call()
              await contract.methods.getUserInfo(address).call()
              await contract.methods.isEligible(address).call()

              // Se chegou aqui, o contrato está pronto para uso
              setStatus({
                ready: true,
                message: "Sistema pronto para uso",
                loading: false,
              })
            } catch (methodCallError) {
              console.error("Erro ao chamar métodos do contrato:", methodCallError)

              // Verificar se o erro é devido à falta de um método específico
              const errorMessage = methodCallError instanceof Error ? methodCallError.message : String(methodCallError)

              if (errorMessage.includes("getAirdropInfo")) {
                setStatus({
                  ready: false,
                  message: "Erro ao chamar o método getAirdropInfo",
                  loading: false,
                })
              } else if (errorMessage.includes("getUserInfo")) {
                setStatus({
                  ready: false,
                  message: "Erro ao chamar o método getUserInfo",
                  loading: false,
                })
              } else if (errorMessage.includes("isEligible")) {
                setStatus({
                  ready: false,
                  message: "Erro ao chamar o método isEligible",
                  loading: false,
                })
              } else {
                setStatus({
                  ready: false,
                  message: "Erro ao chamar métodos do contrato",
                  loading: false,
                })
              }
            }
          } catch (methodError) {
            console.error("Error checking contract methods:", methodError)
            setStatus({
              ready: false,
              message: "Erro ao verificar métodos do contrato",
              loading: false,
            })
          }
        } catch (codeError) {
          console.error("Error checking contract code:", codeError)
          setStatus({
            ready: false,
            message: "Não foi possível verificar se o contrato existe",
            loading: false,
          })
          return
        }
      } catch (error) {
        console.error("Error checking system status:", error)
        setStatus({
          ready: false,
          message: "Erro ao verificar status do sistema. Tente novamente mais tarde.",
          loading: false,
        })
      }
    }

    checkStatus()

    // Verificar status a cada 5 minutos
    const interval = setInterval(checkStatus, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [web3, chainId, isConnected, address])

  if (!isConnected) {
    return null
  }

  return (
    <Alert variant={status.ready ? "default" : "destructive"} className="mt-4">
      {status.loading ? (
        <AlertCircle className="h-4 w-4 animate-spin" />
      ) : status.ready ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      <AlertTitle className="flex items-center gap-2">
        Status do Sistema
        <Badge variant={status.ready ? "success" : "destructive"}>
          {status.ready ? "Operacional" : "Problema Detectado"}
        </Badge>
      </AlertTitle>
      <AlertDescription>{status.message}</AlertDescription>
    </Alert>
  )
}

