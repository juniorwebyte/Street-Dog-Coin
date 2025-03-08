// Endereços dos contratos em diferentes redes
export const CONTRACT_ADDRESSES: Record<number, string> = {
  1: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM || "0xAF01804Def25a42A51e76994d42489083b1D40f8",
  56: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BSC || "",
  137: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON || "",
  5: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_GOERLI || "",
  97: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BSC_TESTNET || "",
}

// Endereço do token
export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "0xAF01804Def25a42A51e76994d42489083b1D40f8"

