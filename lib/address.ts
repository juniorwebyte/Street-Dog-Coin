// Arquivo centralizado para gerenciar endereços de contratos

// Endereço do contrato principal para testes
export const DEFAULT_CONTRACT_ADDRESS = "0xAF01804Def25a42A51e76994d42489083b1D40f8"

// Função para obter o endereço do contrato com base na rede
export function getContractAddress(chainId: number): string {
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

// Endereço do token ERC-20
export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "0xAF01804Def25a42A51e76994d42489083b1D40f8"

