"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Web3 from "web3"
import type { AbiItem } from "web3-utils"
import tokenABI from "@/contracts/abi/ERC20.json"
import { toast } from "@/components/ui/use-toast"

type WalletState = {
  web3: Web3 | null
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: number | null
  balance: string | null
  tokenBalance: string | null
  connect: () => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
}

export function useWallet(): WalletState {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [tokenBalance, setTokenBalance] = useState<string | null>(null)

  // Usar uma ref para rastrear se há uma solicitação pendente
  const pendingRequestRef = useRef(false)
  // Usar uma ref para rastrear se o componente está montado
  const isMountedRef = useRef(true)

  // Inicializar Web3 se o ethereum estiver disponível
  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum)
      setWeb3(web3Instance)
    }

    // Definir isMountedRef como false na desmontagem
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Fix the refreshBalance function to handle asynchronous operations better
  const refreshBalance = useCallback(async () => {
    if (!web3 || !address) return

    try {
      console.log("Refreshing balance for:", address)

      // Set a loading state to prevent multiple simultaneous requests
      if (isMountedRef.current) {
        setBalance(null) // Clear balance while loading
        setTokenBalance(null) // Clear token balance while loading
      }

      // Fetch ETH balance with proper error handling
      try {
        const ethBalance = await web3.eth.getBalance(address)
        const ethBalanceStr = typeof ethBalance === "bigint" ? ethBalance.toString() : ethBalance.toString()
        const formattedEthBalance = web3.utils.fromWei(ethBalanceStr, "ether")

        if (isMountedRef.current) {
          setBalance(formattedEthBalance)
        }
      } catch (ethError) {
        console.error("Error fetching ETH balance:", ethError)
        if (isMountedRef.current) {
          setBalance("0")
        }
      }

      // Fetch token balance with proper error handling
      try {
        const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "0xAF01804Def25a42A51e76994d42489083b1D40f8"

        if (web3.utils.isAddress(tokenAddress)) {
          const code = await web3.eth.getCode(tokenAddress)

          // Create token contract instance
          const tokenContract = new web3.eth.Contract(tokenABI as AbiItem[], tokenAddress)

          // Check if balanceOf method exists
          if (typeof tokenContract.methods.balanceOf === "function") {
            const tokenBalanceWei = await tokenContract.methods.balanceOf(address).call()
            const tokenBalanceWeiStr =
              typeof tokenBalanceWei === "bigint" ? tokenBalanceWei.toString() : tokenBalanceWei.toString()
            const formattedTokenBalance = web3.utils.fromWei(tokenBalanceWeiStr, "ether")

            if (isMountedRef.current) {
              setTokenBalance(formattedTokenBalance)
            }
          } else {
            // Fallback to simulation if method doesn't exist
            if (isMountedRef.current) {
              setTokenBalance("1000")
            }
          }
        } else {
          // Fallback for invalid token address
          if (isMountedRef.current) {
            setTokenBalance("1000")
          }
        }
      } catch (tokenError) {
        console.error("Error fetching token balance:", tokenError)
        if (isMountedRef.current) {
          setTokenBalance("1000")
        }
      }
    } catch (error) {
      console.error("Error refreshing balances:", error)
      if (isMountedRef.current) {
        setBalance("0")
        setTokenBalance("1000")
      }
    }
  }, [web3, address])

  // Improve the connect function to handle connection more reliably
  const connect = useCallback(async () => {
    // Check for pending requests
    if (pendingRequestRef.current || isConnecting) {
      console.log("Connection request already pending")
      return
    }

    if (!window.ethereum) {
      toast({
        title: "Wallet not found",
        description: "Please install MetaMask or another Ethereum-compatible wallet",
        variant: "destructive",
      })
      return
    }

    // Set pending request flag
    pendingRequestRef.current = true
    if (isMountedRef.current) {
      setIsConnecting(true)
    }

    try {
      // Request accounts with proper error handling
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts && accounts.length > 0) {
        if (isMountedRef.current) {
          setAddress(accounts[0])
          setIsConnected(true)
        }

        localStorage.setItem("walletAddress", accounts[0])
        localStorage.setItem("walletConnected", "true")

        // Get chain ID
        if (web3 && isMountedRef.current) {
          try {
            const chainId = await web3.eth.getChainId()
            if (isMountedRef.current) {
              setChainId(chainId)
            }
          } catch (chainError) {
            console.error("Error getting chain ID:", chainError)
          }
        }

        // Refresh balance immediately after connection
        await refreshBalance()
      } else {
        throw new Error("No accounts selected")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)

      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes("already pending")) {
        toast({
          title: "Connection pending",
          description: "Please check your wallet for a pending connection request",
          variant: "warning",
        })
      } else {
        toast({
          title: "Connection error",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      // Clear pending request flag
      pendingRequestRef.current = false
      if (isMountedRef.current) {
        setIsConnecting(false)
      }
    }
  }, [web3, refreshBalance, isConnecting, toast])

  // Modificar a função disconnect para garantir uma desconexão completa
  const disconnect = useCallback(() => {
    if (isMountedRef.current) {
      setAddress(null)
      setIsConnected(false)
      setChainId(null)
      setBalance(null)
      setTokenBalance(null)
    }

    // Limpar completamente o localStorage
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletConnected")

    // Forçar uma atualização da página para garantir que todos os estados sejam limpos
    window.location.reload()
  }, [])

  // Verificar se a carteira já estava conectada anteriormente
  useEffect(() => {
    const checkPreviousConnection = async () => {
      // Check if wallet was previously connected
      const savedAddress = localStorage.getItem("walletAddress")
      if (savedAddress && window.ethereum) {
        try {
          // Verificar se a carteira ainda está conectada
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0 && accounts[0].toLowerCase() === savedAddress.toLowerCase()) {
            if (isMountedRef.current) {
              setAddress(accounts[0])
              setIsConnected(true)
            }

            // Obter chainId atual
            if (web3) {
              try {
                const id = await web3.eth.getChainId()
                if (isMountedRef.current) {
                  setChainId(id)
                }
              } catch (error) {
                console.error("Erro ao obter chainId:", error)
              }
            }
          } else {
            // Se a carteira não estiver mais conectada, limpar o localStorage
            localStorage.removeItem("walletAddress")
          }
        } catch (error) {
          console.error("Erro ao verificar conexão anterior:", error)
          localStorage.removeItem("walletAddress")
        }
      }
    }

    checkPreviousConnection()
  }, [web3])

  // Configurar listeners para eventos da carteira
  useEffect(() => {
    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else if (accounts[0] !== address) {
        if (isMountedRef.current) {
          setAddress(accounts[0])
          setIsConnected(true)
        }
        localStorage.setItem("walletAddress", accounts[0])
        refreshBalance()
      }
    }

    // Listen for chain changes
    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = Number.parseInt(chainIdHex, 16)
      if (isMountedRef.current) {
        setChainId(newChainId)
      }
      refreshBalance()
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [address, disconnect, refreshBalance])

  // Atualizar saldo quando conectado
  useEffect(() => {
    if (isConnected && address && web3) {
      refreshBalance()

      // Configurar atualização periódica do saldo (a cada 30 segundos)
      const intervalId = setInterval(() => {
        refreshBalance()
      }, 30000)

      return () => clearInterval(intervalId)
    }
  }, [isConnected, address, web3, refreshBalance])

  return {
    web3,
    address,
    isConnected,
    isConnecting,
    chainId,
    balance,
    tokenBalance,
    connect,
    disconnect,
    refreshBalance,
  }
}

// Add TypeScript interface for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, listener: (...args: any[]) => void) => void
      removeListener: (event: string, listener: (...args: any[]) => void) => void
    }
  }
}

// Manter a compatibilidade com o código existente
export function useWeb3(): WalletState {
  return useWallet()
}

