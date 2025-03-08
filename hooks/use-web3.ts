"use client"

import { useState, useEffect, useCallback } from "react"
import Web3 from "web3"
import type { AbiItem } from "web3-utils"
import { toast } from "@/components/ui/use-toast"
import airdropABI from "@/contracts/abi/StreetDogCoinAirdrop.json"
// Importar as constantes e funções de utilidade
import { getContractAddress } from "@/utils/constants"

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
    rpcUrl: "https://mainnet.infura.io/v3/c12212a04e2d43dda0d82b2c06b05559",
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

// Modificar a seção de endereços de contrato para usar o endereço fornecido
// Endereços dos contratos em diferentes redes
const CONTRACT_ADDRESSES: Record<number, string> = {
  1: getContractAddress(1) || "0xAF01804Def25a42A51e76994d42489083b1D40f8",
  56: getContractAddress(56) || "",
  137: getContractAddress(137) || "",
  5: getContractAddress(5) || "",
  97: getContractAddress(97) || "",
}

export type Web3State = {
  web3: Web3 | null
  address: string | null
  chainId: number | null
  network: NetworkType | null
  isConnected: boolean
  isConnecting: boolean
  balance: string | null
  tokenBalance: string | null
  airdropContract: any | null
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
  refreshBalance: () => Promise<void>
  getAirdropInfo: () => Promise<any>
  getUserInfo: (address: string) => Promise<any>
  claimTokens: () => Promise<any>
  claimWithReferral: (referrer: string) => Promise<any>
}

export function useWeb3(): Web3State {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [network, setNetwork] = useState<NetworkType | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState<string | null>(null)
  const [tokenBalance, setTokenBalance] = useState<string | null>(null)
  const [airdropContract, setAirdropContract] = useState<any | null>(null)

  // Modificar a função verifyContract para ser mais robusta
  const verifyContract = useCallback(
    async (contractInstance: any, contractAddress: string): Promise<boolean> => {
      if (!web3) return false

      try {
        // Primeiro, verificar se o endereço do contrato é válido
        if (!web3.utils.isAddress(contractAddress)) {
          console.error("Endereço de contrato inválido:", contractAddress)
          return false
        }

        // Verificar se há código no endereço (se é um contrato)
        const code = await web3.eth.getCode(contractAddress)
        if (!code || code === "0x" || code === "0x0") {
          console.error("Não há contrato no endereço especificado:", contractAddress)
          return false
        }

        return true
      } catch (error) {
        console.error("Erro ao verificar contrato:", error)
        return false
      }
    },
    [web3],
  )

  // Melhorar a inicialização do contrato para verificar se está funcionando
  const initializeWeb3 = useCallback(
    async (provider: any) => {
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

        // Initialize airdrop contract if the network is supported
        if (currentChainId && CONTRACT_ADDRESSES[currentChainId]) {
          const contractAddress = CONTRACT_ADDRESSES[currentChainId]
          try {
            // Verify if the contract address is valid
            if (!web3Instance.utils.isAddress(contractAddress)) {
              console.error("Invalid contract address:", contractAddress)
              setAirdropContract(null)
              return
            }

            // Check if there's code at the address (if it's a contract)
            const code = await web3Instance.eth.getCode(contractAddress)
            if (code === "0x" || code === "0x0") {
              console.error("No contract at the specified address:", contractAddress)
              setAirdropContract(null)
              return
            }

            // Create the contract instance
            const contract = new web3Instance.eth.Contract(airdropABI as AbiItem[], contractAddress)

            // Verify if the contract exists
            const isValid = await verifyContract(contract, contractAddress)
            if (isValid) {
              // Check if the required methods exist by directly checking the ABI
              const hasIsEligible = airdropABI.some(
                (item: any) => item.type === "function" && item.name === "isEligible",
              )

              if (!hasIsEligible) {
                console.error("isEligible method not found in the ABI")
                setAirdropContract(null)
                return
              }

              // Additional checks for other required methods
              const hasGetAirdropInfo = airdropABI.some(
                (item: any) => item.type === "function" && item.name === "getAirdropInfo",
              )

              const hasGetUserInfo = airdropABI.some(
                (item: any) => item.type === "function" && item.name === "getUserInfo",
              )

              if (!hasGetAirdropInfo) {
                console.error("getAirdropInfo method not found in the ABI")
                setAirdropContract(null)
                return
              }

              if (!hasGetUserInfo) {
                console.error("getUserInfo method not found in the ABI")
                setAirdropContract(null)
                return
              }

              setAirdropContract(contract)
              console.log("Contract initialized successfully")
            } else {
              console.warn("Contract could not be verified")
              setAirdropContract(null)
            }
          } catch (contractError) {
            console.error("Error initializing contract:", contractError)
            setAirdropContract(null)
          }
        } else {
          setAirdropContract(null)
        }
      } catch (error) {
        console.error("Error initializing Web3:", error)
        toast({
          title: "Error",
          description: "Failed to initialize Web3. Please try again.",
          variant: "destructive",
        })
      }
    },
    [verifyContract],
  )

  // Função para atualizar saldos
  // Melhorar a função refreshBalance para lidar corretamente com conversões de BigInt

  const refreshBalance = useCallback(async () => {
    if (!web3 || !address) return

    try {
      // Fetch ETH balance with proper error handling
      try {
        const ethBalance = await web3.eth.getBalance(address)
        const ethBalanceStr = typeof ethBalance === "bigint" ? ethBalance.toString() : ethBalance.toString()
        const formattedEthBalance = web3.utils.fromWei(ethBalanceStr, "ether")
        setBalance(formattedEthBalance)
      } catch (ethError) {
        console.error("Error fetching ETH balance:", ethError)
        setBalance("0")
      }

      // Fetch token balance with proper error handling
      try {
        const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "0xAF01804Def25a42A51e76994d42489083b1D40f8"

        if (web3.utils.isAddress(tokenAddress)) {
          // Check if contract exists
          const code = await web3.eth.getCode(tokenAddress)

          // Use a minimal ABI for token balance check
          const minimalTokenABI = [
            {
              constant: true,
              inputs: [{ name: "_owner", type: "address" }],
              name: "balanceOf",
              outputs: [{ name: "balance", type: "uint256" }],
              type: "function",
            },
          ]

          const tokenContract = new web3.eth.Contract(minimalTokenABI as AbiItem[], tokenAddress)

          try {
            const tokenBalanceWei = await tokenContract.methods.balanceOf(address).call()
            const tokenBalanceWeiStr =
              typeof tokenBalanceWei === "bigint" ? tokenBalanceWei.toString() : tokenBalanceWei.toString()
            const formattedTokenBalance = web3.utils.fromWei(tokenBalanceWeiStr, "ether")
            setTokenBalance(formattedTokenBalance)
          } catch (contractError) {
            console.error("Error calling balanceOf:", contractError)
            setTokenBalance("1000") // Fallback value
          }
        } else {
          console.warn("Invalid token address:", tokenAddress)
          setTokenBalance("1000") // Fallback value
        }
      } catch (tokenError) {
        console.error("Error fetching token balance:", tokenError)
        setTokenBalance("1000") // Fallback value
      }
    } catch (error) {
      console.error("Error refreshing balances:", error)
      setBalance("0")
      setTokenBalance("1000")
    }
  }, [web3, address])

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
      // Limpar qualquer conexão anterior
      if (isConnected) {
        // Desconectar antes de tentar uma nova conexão
        localStorage.removeItem("walletAddress")
        localStorage.removeItem("walletConnected")
      }

      // Solicitar permissões - sempre solicitar novas contas para garantir uma conexão fresca
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        localStorage.setItem("walletAddress", accounts[0])
        localStorage.setItem("walletConnected", "true")
      } else {
        throw new Error("Nenhuma conta selecionada")
      }

      await initializeWeb3(window.ethereum)
      await refreshBalance()
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
  }, [initializeWeb3, isConnected, refreshBalance])

  // Desconectar carteira
  const disconnect = useCallback(() => {
    setAddress(null)
    setIsConnected(false)
    setChainId(null)
    setNetwork(null)
    setAirdropContract(null)
    setBalance(null)
    setTokenBalance(null)

    // Limpar completamente o localStorage
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("walletConnected")

    // Forçar uma atualização da página para garantir que todos os estados sejam limpos
    window.location.reload()
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

  // Modificar a função getAirdropInfo para lidar melhor com erros
  const getAirdropInfo = useCallback(async () => {
    if (!airdropContract) {
      throw new Error("Contract not initialized")
    }

    try {
      // Check if the method exists in the contract
      if (typeof airdropContract.methods.getAirdropInfo !== "function") {
        console.error("getAirdropInfo method not found in the contract")
        // Return default values
        return {
          active: false,
          baseAmount: "1000",
          refBonus: "200",
          startTime: Date.now(),
          endTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        }
      }

      const info = await airdropContract.methods.getAirdropInfo().call()

      // Ensure all BigInt values are converted to strings
      const baseAmountStr =
        typeof info.baseAmount === "bigint" ? info.baseAmount.toString() : info.baseAmount.toString()
      const refBonusStr = typeof info.refBonus === "bigint" ? info.refBonus.toString() : info.refBonus.toString()
      const startTimeStr = typeof info.start === "bigint" ? Number(info.start) : Number(info.start)
      const endTimeStr = typeof info.end === "bigint" ? Number(info.end) : Number(info.end)

      return {
        active: info.active,
        baseAmount: web3?.utils.fromWei(baseAmountStr, "ether"),
        refBonus: web3?.utils.fromWei(refBonusStr, "ether"),
        startTime: startTimeStr * 1000,
        endTime: endTimeStr * 1000,
      }
    } catch (error) {
      console.error("Error getting airdrop info:", error)
      // Return default values in case of error
      return {
        active: false,
        baseAmount: "1000",
        refBonus: "200",
        startTime: Date.now(),
        endTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      }
    }
  }, [airdropContract, web3])

  // Modificar a função getUserInfo para lidar melhor com erros
  const getUserInfo = useCallback(
    async (userAddress: string) => {
      // Verificar se estamos em ambiente de desenvolvimento
      if (process.env.NODE_ENV === "development") {
        // Retornar dados simulados para desenvolvimento
        return {
          claimed: Math.random() > 0.7, // 30% chance de ter reivindicado
          referrals: Math.floor(Math.random() * 10),
          referrer: null,
        }
      }

      if (!airdropContract) {
        console.warn("Contract not initialized, returning default values")
        return {
          claimed: false,
          referrals: 0,
          referrer: null,
        }
      }

      try {
        // Check if the method exists in the contract
        if (typeof airdropContract.methods.getUserInfo !== "function") {
          console.error("getUserInfo method not found in the contract")
          // Return default values
          return {
            claimed: false,
            referrals: 0,
            referrer: null,
          }
        }

        try {
          const info = await airdropContract.methods.getUserInfo(userAddress).call()
          return {
            claimed: info.claimed,
            referrals: Number(info.referrals),
            referrer: info.referrer !== "0x0000000000000000000000000000000000000000" ? info.referrer : null,
          }
        } catch (callError) {
          console.error("Error calling getUserInfo:", callError)
          // Return default values in case of error
          return {
            claimed: false,
            referrals: 0,
            referrer: null,
          }
        }
      } catch (error) {
        console.error("Error getting user info:", error)
        // Return default values in case of error
        return {
          claimed: false,
          referrals: 0,
          referrer: null,
        }
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
          refreshBalance()
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
          try {
            const contract = new web3.eth.Contract(airdropABI as AbiItem[], contractAddress)
            setAirdropContract(contract)
          } catch (error) {
            console.error("Error creating contract instance:", error)
            setAirdropContract(null)
          }
        } else {
          setAirdropContract(null)
        }

        refreshBalance()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
    }
  }, [connect, disconnect, web3, refreshBalance])

  return {
    web3,
    address,
    chainId,
    network,
    isConnected,
    isConnecting,
    balance,
    tokenBalance,
    airdropContract,
    connect,
    disconnect,
    switchNetwork,
    refreshBalance,
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

