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

// Função para obter o endereço do contrato com base na rede
export function getContractAddress(chainId: number): string {
  // Endereço do contrato padrão para testes
  const DEFAULT_CONTRACT_ADDRESS = "0xAF01804Def25a42A51e76994d42489083b1D40f8"

  // Verificar se há um endereço específico para a rede nas variáveis de ambiente
  let contractAddress: string | undefined

  switch (chainId) {
    case 1: // Ethereum Mainnet
      contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM
      break
    case 56: // Binance Smart Chain
      contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BSC
      break
    case 137: // Polygon
      contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON
      break
    case 5: // Goerli Testnet
      contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_GOERLI
      break
    case 97: // BSC Testnet
      contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BSC_TESTNET
      break
  }

  // Se encontrou um endereço específico para a rede e ele é válido, retorná-lo
  if (contractAddress && contractAddress.startsWith("0x") && contractAddress.length === 42) {
    return contractAddress
  }

  // Se nenhum endereço válido for encontrado, retornar o endereço padrão
  return DEFAULT_CONTRACT_ADDRESS
}

