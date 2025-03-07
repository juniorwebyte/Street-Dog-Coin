"use client"

import { useState, useEffect, useCallback } from "react"
import Web3 from "web3"
import type { AbiItem } from "web3-utils"
import { toast } from "@/components/ui/use-toast"
import airdropABI from "@/contracts/abi/StreetDogCoinAirdrop.json"

export type NetworkType = {
  id: string
  name: string
  chainId: number
  rpcUrl: string
  currencySymbol: string
  blockExplorerUrl: string
  isTestnet: boolean
}

export const SUPPORTED_NETWORKS: NetworkType[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/your-infura-key",
    currencySymbol: "ETH",
    blockExplorerUrl: "https://etherscan.io",
    isTestnet: false,
  },
  {
    id: "bsc",
    name: "Binance Smart Chain",
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org/",
    currencySymbol: "BNB",
    blockExplorerUrl: "https://bscscan.com",
    isTestnet: false,
  },
  {
    id: "polygon",
    name: "Polygon",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    currencySymbol: "MATIC",
    blockExplorerUrl: "https://polygonscan.com",
    isTestnet: false,
  },
  {
    id: "goerli",
    name: "Goerli Testnet",
    chainId: 5,
    rpcUrl: "https://goerli.infura.io/v3/your-infura-key",
    currencySymbol: "ETH",
    blockExplorerUrl: "https://goerli.etherscan.io",
    isTestnet: true,
  },
  {
    id: "bsc-testnet",
    name: "BSC Testnet",
    chainId: 97,
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    currencySymbol: "tBNB",
    blockExplorerUrl: "https://testnet.bscscan.com",
    isTestnet: true,
  },
]

// Endereços dos contratos em diferentes redes
const CONTRACT_ADDRESSES: Record<number, string> = {
  1: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM || "0xAF01804Def25a42A51e76994d42489083b1D40f8",
  56: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BSC || "",
  137: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON || "",
  5: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_GOERLI || "",
  97: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BSC_TESTNET || "",
}

export type Web3State = {
  web3: Web3 | null
  address: string | null
  chainId: number | null
  network: NetworkType | null
  isConnected: boolean
  isConnecting: boolean
  airdropContract: any | null
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
  getAirdropInfo: () => Promise<any>
  getUserInfo: (address: string) => Promise<any>
  claimTokens: () => Promise<any>
  claimWithReferral: (referrer: string) => Promise<any>
}

export function useWeb3(): Web3State {
  // ... other state variables

  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [network, setNetwork] = useState<NetworkType | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [airdropContract, setAirdropContract] = useState<any | null>(null)

  // Inicializar Web3 e contratos
  const initializeWeb3 = useCallback(async (provider: any) => {
    try {
      const web3Instance = new Web3(provider)
      setWeb3(web3Instance)

      const accounts = await web3Instance.eth.getAccounts()
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      }

      const chainIdHex = await web3Instance.eth.getChainId()
      const currentChainId = Number(chainIdHex)
      setChainId(currentChainId)

      const currentNetwork = SUPPORTED_NETWORKS.find((n) => n.chainId === currentChainId) || null
      setNetwork(currentNetwork)

      // Inicializar contrato de airdrop se a rede for suportada
      if (currentChainId && CONTRACT_ADDRESSES[currentChainId]) {
        const contractAddress = CONTRACT_ADDRESSES[currentChainId]
        const contract = new web3Instance.eth.Contract(airdropABI as AbiItem[], contractAddress)
        setAirdropContract(contract)
      } else {
        setAirdropContract(null)
      }
    } catch (error) {
      console.error("Error initializing Web3:", error)
      toast({
        title: "Erro",
        description: "Falha ao inicializar Web3. Tente novamente.",
        variant: "destructive",
      })
    }
  }, [])

  // Conectar carteira
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: "Carteira não encontrada",
        description: "Por favor, instale a MetaMask ou outra carteira compatível com Web3.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      await initializeWeb3(window.ethereum)

      // Salvar estado de conexão
      localStorage.setItem("walletConnected", "true")
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Erro de conexão",
        description: "Falha ao conectar carteira. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }, [initializeWeb3])

  // Desconectar carteira
  const disconnect = useCallback(() => {
    setAddress(null)
    setIsConnected(false)
    setChainId(null)
    setNetwork(null)
    setAirdropContract(null)
    localStorage.removeItem("walletConnected")
  }, [])

  // Trocar de rede
  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!window.ethereum) return

    const targetNetwork = SUPPORTED_NETWORKS.find((n) => n.chainId === targetChainId)
    if (!targetNetwork) {
      toast({
        title: "Rede não suportada",
        description: "A rede selecionada não é suportada.",
        variant: "destructive",
      })
      return
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      // Código 4902 significa que a rede não existe no MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: targetNetwork.name,
                nativeCurrency: {
                  name: targetNetwork.currencySymbol,
                  symbol: targetNetwork.currencySymbol,
                  decimals: 18,
                },
                rpcUrls: [targetNetwork.rpcUrl],
                blockExplorerUrls: [targetNetwork.blockExplorerUrl],
              },
            ],
          })
        } catch (addError) {
          console.error("Error adding network:", addError)
          toast({
            title: "Erro",
            description: "Falha ao adicionar rede. Tente novamente.",
            variant: "destructive",
          })
        }
      } else {
        console.error("Error switching network:", switchError)
        toast({
          title: "Erro",
          description: "Falha ao trocar de rede. Tente novamente.",
          variant: "destructive",
        })
      }
    }
  }, [])

  // Obter informações do airdrop
  const getAirdropInfo = useCallback(async () => {
    if (!airdropContract) {
      throw new Error("Contrato não inicializado")
    }

    try {
      const info = await airdropContract.methods.getAirdropInfo().call()
      return {
        active: info.active,
        baseAmount: web3?.utils.fromWei(info.baseAmount, "ether"),
        refBonus: web3?.utils.fromWei(info.refBonus, "ether"),
        startTime: Number(info.start) * 1000,
        endTime: Number(info.end) * 1000,
      }
    } catch (error) {
      console.error("Error getting airdrop info:", error)
      throw error
    }
  }, [airdropContract, web3])

  // Obter informações do usuário
  const getUserInfo = useCallback(
    async (userAddress: string) => {
      if (!airdropContract) {
        throw new Error("Contrato não inicializado")
      }

      try {
        const info = await airdropContract.methods.getUserInfo(userAddress).call()
        return {
          claimed: info.claimed,
          referrals: Number(info.referrals),
          referrer: info.referrer !== "0x0000000000000000000000000000000000000000" ? info.referrer : null,
        }
      } catch (error) {
        console.error("Error getting user info:", error)
        throw error
      }
    },
    [airdropContract],
  )

  // Reivindicar tokens
  const claimTokens = useCallback(async () => {
    if (!airdropContract || !address) {
      throw new Error("Contrato não inicializado ou carteira não conectada")
    }

    try {
      const tx = await airdropContract.methods.claimTokens().send({ from: address })
      return tx
    } catch (error) {
      console.error("Error claiming tokens:", error)
      throw error
    }
  }, [airdropContract, address])

  // Reivindicar com referral
  const claimWithReferral = useCallback(
    async (referrer: string) => {
      if (!airdropContract || !address) {
        throw new Error("Contrato não inicializado ou carteira não conectada")
      }

      try {
        const tx = await airdropContract.methods.claimWithReferral(referrer).send({ from: address })
        return tx
      } catch (error) {
        console.error("Error claiming with referral:", error)
        throw error
      }
    },
    [airdropContract, address],
  )

  // Efeitos para inicialização e eventos
  useEffect(() => {
    // Verificar se o usuário já estava conectado
    const wasConnected = localStorage.getItem("walletConnected") === "true"

    if (wasConnected && window.ethereum) {
      connect()
    }

    // Eventos de mudança de conta e rede
    if (window.ethereum) {
      const checkConnection = async () => {
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({ method: "eth_accounts" })
            setIsConnected(accounts.length > 0)
          } catch (error) {
            console.error("Failed to get accounts", error)
          }
        }
      }

      checkConnection()

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setIsConnected(accounts.length > 0)
        if (accounts.length === 0) {
          disconnect()
        } else {
          setAddress(accounts[0])
        }
      })

      window.ethereum.on("chainChanged", (chainIdHex: string) => {
        const newChainId = Number.parseInt(chainIdHex, 16)
        setChainId(newChainId)

        const newNetwork = SUPPORTED_NETWORKS.find((n) => n.chainId === newChainId) || null
        setNetwork(newNetwork)

        // Reinicializar contrato para a nova rede
        if (web3 && newChainId && CONTRACT_ADDRESSES[newChainId]) {
          const contractAddress = CONTRACT_ADDRESSES[newChainId]
          const contract = new web3.eth.Contract(airdropABI as AbiItem[], contractAddress)
          setAirdropContract(contract)
        } else {
          setAirdropContract(null)
        }
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
    }
  }, [connect, disconnect, web3])

  // ... rest of the hook

  return {
    // ... other returned values
    web3,
    address,
    chainId,
    network,
    isConnected,
    isConnecting,
    airdropContract,
    connect,
    disconnect,
    switchNetwork,
    getAirdropInfo,
    getUserInfo,
    claimTokens,
    claimWithReferral,
  }
}

// Adicionar tipos para window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, listener: (...args: any[]) => void) => void
      removeListener: (event: string, listener: (...args: any[]) => void) => void
      removeAllListeners: (event: string) => void
      isMetaMask?: boolean
    }
  }
}

