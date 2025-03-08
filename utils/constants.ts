// Arquivo de constantes para centralizar valores importantes

// Endereço do contrato principal
export const DEFAULT_CONTRACT_ADDRESS = "0xAF01804Def25a42A51e76994d42489083b1D40f8"

// Configurações de redes suportadas
export const NETWORK_CONFIG = {
  ETHEREUM: {
    id: 1,
    name: "Ethereum Mainnet",
    contractAddress: DEFAULT_CONTRACT_ADDRESS,
    explorer: "https://etherscan.io",
  },
  BSC: {
    id: 56,
    name: "Binance Smart Chain",
    contractAddress: DEFAULT_CONTRACT_ADDRESS,
    explorer: "https://bscscan.com",
  },
  POLYGON: {
    id: 137,
    name: "Polygon",
    contractAddress: DEFAULT_CONTRACT_ADDRESS,
    explorer: "https://polygonscan.com",
  },
  GOERLI: {
    id: 5,
    name: "Goerli Testnet",
    contractAddress: DEFAULT_CONTRACT_ADDRESS,
    explorer: "https://goerli.etherscan.io",
  },
  BSC_TESTNET: {
    id: 97,
    name: "BSC Testnet",
    contractAddress: DEFAULT_CONTRACT_ADDRESS,
    explorer: "https://testnet.bscscan.com",
  },
}

// Melhorar a função getContractAddress para garantir que sempre retorne um endereço válido
export function getContractAddress(chainId: number): string {
  // Verificar se há um endereço específico para a rede nas variáveis de ambiente
  let contractAddress: string | undefined

  switch (chainId) {
    case NETWORK_CONFIG.ETHEREUM.id:
      contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM
      break
    case NETWORK_CONFIG.BSC.id:
      contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BSC
      break
    case NETWORK_CONFIG.POLYGON.id:
      contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON
      break
    case NETWORK_CONFIG.GOERLI.id:
      contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_GOERLI
      break
    case NETWORK_CONFIG.BSC_TESTNET.id:
      contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BSC_TESTNET
      break
  }

  // Se encontrou um endereço específico para a rede e ele é válido, retorná-lo
  if (contractAddress && contractAddress.startsWith("0x") && contractAddress.length === 42) {
    return contractAddress
  }

  // Verificar se há um endereço configurado para a rede específica
  const networkConfig = Object.values(NETWORK_CONFIG).find((config) => config.id === chainId)
  if (
    networkConfig &&
    networkConfig.contractAddress &&
    networkConfig.contractAddress.startsWith("0x") &&
    networkConfig.contractAddress.length === 42
  ) {
    return networkConfig.contractAddress
  }

  // Se nenhum endereço válido for encontrado, retornar o endereço padrão
  return DEFAULT_CONTRACT_ADDRESS
}

// Função para obter o explorador de blocos com base na rede
export function getBlockExplorer(chainId: number): string {
  switch (chainId) {
    case NETWORK_CONFIG.ETHEREUM.id:
      return NETWORK_CONFIG.ETHEREUM.explorer
    case NETWORK_CONFIG.BSC.id:
      return NETWORK_CONFIG.BSC.explorer
    case NETWORK_CONFIG.POLYGON.id:
      return NETWORK_CONFIG.POLYGON.explorer
    case NETWORK_CONFIG.GOERLI.id:
      return NETWORK_CONFIG.GOERLI.explorer
    case NETWORK_CONFIG.BSC_TESTNET.id:
      return NETWORK_CONFIG.BSC_TESTNET.explorer
    default:
      return NETWORK_CONFIG.ETHEREUM.explorer
  }
}

