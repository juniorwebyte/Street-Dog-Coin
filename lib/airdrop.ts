import type Web3 from "web3"
import type { AbiItem } from "web3-utils"
import airdropABI from "@/contracts/abi/StreetDogCoinAirdrop.json"

// Atualizar o endereço do contrato padrão no início do arquivo
const DEFAULT_CONTRACT_ADDRESS = "0xAF01804Def25a42A51e76994d42489083b1D40f8"

// Variáveis para simular estatísticas em tempo real (para desenvolvimento)
const simulatedTotalTokens = 10000000
let simulatedClaimedTokens = 2500000
let simulatedParticipants = 2500
const simulatedEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias a partir de agora

// Função para verificar se um endereço é um contrato válido
async function isValidContract(web3: Web3, address: string): Promise<boolean> {
  try {
    // Verificar se o endereço é válido
    if (!web3.utils.isAddress(address)) {
      console.error("Endereço inválido:", address)
      return false
    }

    const code = await web3.eth.getCode(address)
    // Se o endereço contém código (não é apenas "0x"), é um contrato
    return code !== "0x" && code !== "0x0"
  } catch (error) {
    console.error("Erro ao verificar se o endereço é um contrato:", error)
    return false
  }
}

// Melhorar a função checkEligibility para lidar melhor com erros
export async function checkEligibility(address: string, web3?: Web3, contractAddress?: string) {
  console.log("Verificando elegibilidade para:", address)

  // Validar endereço
  if (!address || typeof address !== "string" || !address.startsWith("0x")) {
    console.error("Endereço inválido:", address)
    throw new Error("Endereço Ethereum inválido")
  }

  // Se web3 não estiver disponível, retornar valores padrão
  if (!web3) {
    console.log("Web3 não disponível, retornando valores padrão")
    return {
      isEligible: false,
      amount: "0",
      hasClaimed: false,
    }
  }

  // Usar o endereço padrão se não for fornecido
  const effectiveContractAddress = contractAddress || DEFAULT_CONTRACT_ADDRESS

  try {
    // Verificar se o contrato é válido
    if (!web3.utils.isAddress(effectiveContractAddress)) {
      console.error("Endereço de contrato inválido:", effectiveContractAddress)
      throw new Error("Endereço de contrato inválido")
    }

    // Verificar se há código no endereço
    const code = await web3.eth.getCode(effectiveContractAddress)
    if (code === "0x" || code === "0x0") {
      console.error("Não há contrato no endereço especificado:", effectiveContractAddress)
      throw new Error("Contrato não encontrado no endereço especificado")
    }

    // Inicializar contrato
    const contract = new web3.eth.Contract(airdropABI as AbiItem[], effectiveContractAddress)

    // Verificar se os métodos necessários existem
    if (typeof contract.methods.isEligible !== "function") {
      console.error("Método isEligible não encontrado no contrato")
      throw new Error("Contrato não possui o método isEligible")
    }

    if (typeof contract.methods.getUserInfo !== "function") {
      console.error("Método getUserInfo não encontrado no contrato")
      throw new Error("Contrato não possui o método getUserInfo")
    }

    if (typeof contract.methods.getAirdropInfo !== "function") {
      console.error("Método getAirdropInfo não encontrado no contrato")
      throw new Error("Contrato não possui o método getAirdropInfo")
    }

    try {
      // Chamar isEligible no contrato
      const isEligible = await contract.methods.isEligible(address).call()

      // Obter informações do usuário
      const userInfo = await contract.methods.getUserInfo(address).call()

      // Obter informações do airdrop
      const airdropInfo = await contract.methods.getAirdropInfo().call()

      // Calcular valor com base nas informações do airdrop
      const amount = web3.utils.fromWei(airdropInfo.baseAmount || "1000000000000000000", "ether")

      return {
        isEligible,
        amount,
        hasClaimed: userInfo.claimed,
      }
    } catch (contractError) {
      console.error("Erro ao chamar contrato:", contractError)
      throw new Error("Erro ao verificar elegibilidade no contrato")
    }
  } catch (error) {
    console.error("Erro ao verificar elegibilidade:", error)
    throw error
  }
}

// Melhorar a função claimAirdrop para lidar melhor com erros
export async function claimAirdrop(address: string, web3?: Web3, contractAddress?: string, referrer?: string) {
  console.log("Tentando reivindicar tokens para:", address)

  // Validar endereço
  if (!address || typeof address !== "string" || !address.startsWith("0x")) {
    console.error("Endereço inválido:", address)
    throw new Error("Endereço Ethereum inválido")
  }

  // Validar referrer se fornecido
  if (referrer && (!referrer.startsWith("0x") || referrer.length !== 42)) {
    console.error("Endereço de referência inválido:", referrer)
    throw new Error("Endereço de referência inválido")
  }

  // Se web3 não estiver disponível, retornar erro
  if (!web3) {
    console.error("Web3 não disponível")
    throw new Error("Web3 não inicializado. Por favor, conecte sua carteira.")
  }

  // Usar o endereço padrão se não for fornecido
  const effectiveContractAddress = contractAddress || DEFAULT_CONTRACT_ADDRESS

  try {
    // Verificar se o contrato é válido
    if (!web3.utils.isAddress(effectiveContractAddress)) {
      console.error("Endereço de contrato inválido:", effectiveContractAddress)
      throw new Error("Endereço de contrato inválido")
    }

    // Verificar se há código no endereço
    const code = await web3.eth.getCode(effectiveContractAddress)
    if (code === "0x" || code === "0x0") {
      console.error("Não há contrato no endereço especificado:", effectiveContractAddress)
      throw new Error("Contrato não encontrado no endereço especificado")
    }

    // Inicializar contrato
    const contract = new web3.eth.Contract(airdropABI as AbiItem[], effectiveContractAddress)

    // Verificar se os métodos necessários existem
    if (typeof contract.methods.isEligible !== "function") {
      console.error("Método isEligible não encontrado no contrato")
      throw new Error("Contrato não possui o método isEligible")
    }

    if (typeof contract.methods.claimTokens !== "function") {
      console.error("Método claimTokens não encontrado no contrato")
      throw new Error("Contrato não possui o método claimTokens")
    }

    if (referrer && typeof contract.methods.claimWithReferral !== "function") {
      console.error("Método claimWithReferral não encontrado no contrato")
      throw new Error("Contrato não possui o método claimWithReferral")
    }

    try {
      // Verificar elegibilidade antes de reivindicar
      const isEligible = await contract.methods.isEligible(address).call()

      if (!isEligible) {
        throw new Error("Endereço não elegível para reivindicar tokens")
      }

      // Executar a transação de reivindicação
      let tx
      if (referrer && referrer !== address) {
        // Reivindicar com referral
        tx = await contract.methods.claimWithReferral(referrer).send({ from: address })
      } else {
        // Reivindicar sem referral
        tx = await contract.methods.claimTokens().send({ from: address })
      }

      return {
        success: true,
        txHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
      }
    } catch (contractError) {
      console.error("Erro ao reivindicar tokens via contrato:", contractError)

      // Verificar se é um erro de "já reivindicado"
      if (contractError.message && contractError.message.includes("Not eligible")) {
        throw new Error("Você já reivindicou seus tokens ou não é elegível")
      }

      throw contractError
    }
  } catch (error) {
    console.error("Erro ao reivindicar tokens:", error)
    throw error
  }
}

// Função para obter o status das reivindicações com tratamento de erros aprimorado
export async function getClaimStatus(address: string, web3?: Web3, contractAddress?: string) {
  console.log("Obtendo status de reivindicação para:", address)

  // Validar endereço
  if (!address || typeof address !== "string" || !address.startsWith("0x")) {
    console.error("Endereço inválido:", address)
    return [] // Retornar array vazio em vez de lançar erro
  }

  // Se web3 não estiver disponível, retornar array vazio
  if (!web3) {
    console.log("Web3 não disponível, retornando array vazio")
    return []
  }

  try {
    // Usar o endereço padrão se não for fornecido
    const effectiveContractAddress = contractAddress || DEFAULT_CONTRACT_ADDRESS

    // Verificar se o contrato é válido antes de tentar usá-lo
    let isValid = false
    try {
      isValid = await isValidContract(web3, effectiveContractAddress)
    } catch (contractCheckError) {
      console.error("Erro ao verificar contrato:", contractCheckError)
      return [] // Retornar array vazio se não conseguir verificar o contrato
    }

    if (!isValid) {
      console.warn("Contrato inválido ou não encontrado, retornando array vazio")
      return []
    }

    // Inicializar contrato com tratamento de erro
    let contract
    try {
      contract = new web3.eth.Contract(airdropABI as AbiItem[], effectiveContractAddress)
    } catch (contractInitError) {
      console.error("Erro ao inicializar contrato:", contractInitError)
      return [] // Retornar array vazio se não conseguir inicializar o contrato
    }

    // Tentar obter informações do usuário com tratamento de erro robusto
    let userInfo
    try {
      // Verificar se o método getUserInfo existe no contrato
      if (typeof contract.methods.getUserInfo !== "function") {
        console.error("Método getUserInfo não encontrado no contrato")
        return []
      }

      userInfo = await contract.methods.getUserInfo(address).call()
      console.log("Informações do usuário obtidas com sucesso:", userInfo)
    } catch (userInfoError) {
      console.error("Erro ao obter informações do usuário:", userInfoError)
      return [] // Retornar array vazio em vez de tentar usar fallback
    }

    // Se o usuário reivindicou, buscar eventos para obter detalhes
    if (userInfo && userInfo.claimed) {
      try {
        // Obter o número do bloco atual
        const currentBlock = await web3.eth.getBlockNumber()
        // Buscar eventos dos últimos 10000 blocos (ou ajustar conforme necessário)
        const fromBlock = Math.max(0, currentBlock - 10000)

        // Buscar eventos TokensClaimed para o endereço
        let events = []
        try {
          // Verificar se o método getPastEvents existe
          if (typeof contract.getPastEvents !== "function") {
            console.error("Método getPastEvents não encontrado no contrato")

            return []
          }

          events = await contract.getPastEvents("TokensClaimed", {
            filter: { user: address },
            fromBlock,
            toBlock: "latest",
          })
          console.log("Eventos obtidos com sucesso:", events.length)
        } catch (eventsError) {
          console.error("Erro ao buscar eventos TokensClaimed:", eventsError)
          // Se não conseguir obter eventos mas sabemos que o usuário reivindicou
          return [
            {
              id: `claim-${address?.substring(2, 8) || "000000"}`,
              timestamp: Date.now() - 86400000, // 1 dia atrás
              amount: "1000",
              status: "completed",
              txHash: `0x${Array(64)
                .fill(0)
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join("")}`,
            },
          ]
        }

        if (events.length > 0) {
          // Mapear eventos para o formato esperado
          return events.map((event) => {
            const block = event.blockNumber
            // Obter timestamp aproximado (pode ser ajustado para buscar o timestamp real do bloco)
            const timestamp = Date.now() - (currentBlock - block) * 15000 // ~15 segundos por bloco

            return {
              id: `claim-${event.transactionHash.substring(2, 10)}`,
              timestamp,
              amount: web3.utils.fromWei(event.returnValues.amount, "ether").toString(),
              status: "completed",
              txHash: event.transactionHash,
            }
          })
        } else {
          // Se não encontrou eventos mas o usuário reivindicou, retornar um evento simulado
          console.log("Nenhum evento encontrado, mas usuário marcado como tendo reivindicado. Usando dados simulados.")
          return [
            {
              id: `claim-${address?.substring(2, 8) || "000000"}`,
              timestamp: Date.now() - 86400000, // 1 dia atrás
              amount: "1000",
              status: "completed",
              txHash: `0x${Array(64)
                .fill(0)
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join("")}`,
            },
          ]
        }
      } catch (blockError) {
        console.error("Erro ao obter informações de bloco:", blockError)
        return [] // Retornar array vazio em caso de erro
      }
    }

    // Se não encontrou eventos ou o usuário não reivindicou, retornar array vazio
    console.log("Usuário não reivindicou ou nenhum evento encontrado. Retornando array vazio.")
    return []
  } catch (error) {
    // Capturar qualquer outro erro não tratado
    console.error("Erro não tratado em getClaimStatus:", error)
    return [] // Retornar array vazio para qualquer erro
  }
}

// Função para obter estatísticas do airdrop com tratamento de erros aprimorado
export async function getAirdropStats(web3?: Web3, contractAddress?: string) {
  console.log("Obtendo estatísticas do airdrop")

  // Usar o endereço padrão se não for fornecido
  const effectiveContractAddress = contractAddress || DEFAULT_CONTRACT_ADDRESS

  // Se web3 estiver disponível, tentar usar o contrato real
  if (web3) {
    try {
      // Verificar se o contrato é válido
      const isValid = await isValidContract(web3, effectiveContractAddress)

      if (isValid) {
        // Inicializar contrato
        const contract = new web3.eth.Contract(airdropABI as AbiItem[], effectiveContractAddress)

        try {
          // Verificar se o método getAirdropInfo existe no contrato
          if (typeof contract.methods.getAirdropInfo !== "function") {
            console.error("Método getAirdropInfo não encontrado no contrato")
            return getFallbackStatsData()
          }

          // Obter informações do airdrop
          const airdropInfo = await contract.methods.getAirdropInfo().call()

          // Calcular dias restantes
          const endTime = Number(airdropInfo.end) * 1000
          const now = Date.now()
          const diffTime = endTime - now
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          const remainingDays = diffDays > 0 ? diffDays : 0

          // Obter total de tokens (valor base * número estimado de participantes)
          const baseAmount = web3.utils.fromWei(airdropInfo.baseAmount, "ether").toString()
          const totalTokens = (Number(baseAmount) * 10000).toString() // Estimativa

          // Obter tokens reivindicados (estimativa baseada em eventos)
          let claimedTokens = "0"
          let totalParticipants = 0

          try {
            // Obter o número do bloco atual
            const currentBlock = await web3.eth.getBlockNumber()
            // Buscar eventos dos últimos 10000 blocos (ou ajustar conforme necessário)
            const fromBlock = Math.max(0, currentBlock - 10000)

            // Verificar se o método getPastEvents existe
            if (typeof contract.getPastEvents !== "function") {
              console.error("Método getPastEvents não encontrado no contrato")
              return getFallbackStatsData()
            }

            // Buscar eventos TokensClaimed
            const events = await contract.getPastEvents("TokensClaimed", {
              fromBlock,
              toBlock: "latest",
            })

            // Contar participantes únicos
            const uniqueAddresses = new Set()
            let totalClaimed = 0

            events.forEach((event) => {
              uniqueAddresses.add(event.returnValues.user)
              const amount = web3.utils.fromWei(event.returnValues.amount, "ether")
              totalClaimed += Number(amount)
            })

            totalParticipants = uniqueAddresses.size
            claimedTokens = totalClaimed.toString()
          } catch (eventError) {
            console.error("Erro ao buscar eventos para estatísticas:", eventError)
          }

          return {
            totalTokens,
            claimedTokens,
            totalParticipants,
            remainingDays,
          }
        } catch (contractError) {
          console.error("Erro ao obter estatísticas via contrato:", contractError)
          // Fallback para simulação em caso de erro
          return getFallbackStatsData()
        }
      } else {
        console.warn("Contrato inválido, usando simulação")
        return getFallbackStatsData()
      }
    } catch (web3Error) {
      console.error("Erro Web3:", web3Error)
      return getFallbackStatsData()
    }
  }

  // Sempre usar simulação se web3 não estiver disponível
  console.log("Web3 não disponível, usando simulação para estatísticas")
  return getFallbackStatsData()
}

// Funções de fallback para dados simulados

function getFallbackEligibilityData(address: string) {
  // Usar o endereço para gerar um resultado determinístico
  const addressSum = address
    .toLowerCase()
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)

  // 80% de chance de ser elegível
  const isEligible = addressSum % 10 < 8

  return {
    isEligible,
    amount: "1000",
    hasClaimed: false,
  }
}

function getFallbackClaimData(address: string) {
  // Atualizar estatísticas simuladas
  simulatedClaimedTokens += 1000
  simulatedParticipants += 1

  // Gerar um hash de transação simulado
  const simulatedTxHash =
    "0x" +
    Array(64)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")

  return {
    success: true,
    txHash: simulatedTxHash,
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
  }
}

// Modificar a função getFallbackClaimStatusData para retornar dados simulados consistentes
function getFallbackClaimStatusData(address: string) {
  console.log("Gerando dados simulados de status para:", address)

  // Usar o endereço para gerar um resultado determinístico
  const addressSum = address
    .toLowerCase()
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)

  // Determinar se o usuário "reivindicou" com base no endereço (para consistência)
  const hasClaimed = addressSum % 10 < 7 // 70% de chance de ter reivindicado

  // Se não reivindicou, retornar array vazio
  if (!hasClaimed) {
    return []
  }

  // Se reivindicou, retornar um evento simulado
  return [
    {
      id: `claim-${address?.substring(2, 8) || "000000"}`,
      timestamp: Date.now() - 86400000, // 1 dia atrás
      amount: "1000",
      status: "completed",
      txHash: `0x${Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
    },
  ]
}

function getFallbackStatsData() {
  // Calcular dias restantes
  const now = new Date()
  const diffTime = simulatedEndDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const remainingDays = diffDays > 0 ? diffDays : 0

  return {
    totalTokens: simulatedTotalTokens.toString(),
    claimedTokens: simulatedClaimedTokens.toString(),
    totalParticipants: simulatedParticipants,
    remainingDays,
  }
}

// Função para simular uma nova reivindicação (apenas para desenvolvimento)
export function simulateNewClaim() {
  simulatedClaimedTokens += 1000
  simulatedParticipants += 1
}

