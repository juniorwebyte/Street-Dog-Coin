import type Web3 from "web3"
import type { AbiItem } from "web3-utils"
import airdropABI from "@/contracts/abi/StreetDogCoinAirdrop.json"
import tokenABI from "@/contracts/abi/ERC20.json"
import { getContractAddress } from "@/utils/constants"

/**
 * Realiza verificações de segurança no contrato de airdrop
 * @param web3 Instância Web3
 * @param chainId ID da rede
 * @returns Objeto com resultados das verificações
 */
export async function performSecurityChecks(web3: Web3, chainId: number) {
  const results = {
    contractExists: false,
    contractHasBalance: false,
    airdropIsActive: false,
    canClaimTokens: false,
    errors: [] as string[],
  }

  try {
    // Obter endereço do contrato para a rede atual
    const contractAddress = getContractAddress(chainId)

    if (!contractAddress) {
      results.errors.push(`Contrato não configurado para a rede ${chainId}`)
      return results
    }

    // Verificar se o contrato existe
    try {
      const code = await web3.eth.getCode(contractAddress)
      results.contractExists = code !== "0x" && code !== "0x0"

      if (!results.contractExists) {
        results.errors.push(`Contrato não encontrado no endereço ${contractAddress}`)
        return results
      }
    } catch (codeError) {
      console.error("Erro ao verificar código do contrato:", codeError)
      results.errors.push("Não foi possível verificar se o contrato existe")
      return results
    }

    // Inicializar contrato
    let contract
    try {
      contract = new web3.eth.Contract(airdropABI as AbiItem[], contractAddress)
    } catch (contractError) {
      console.error("Erro ao inicializar contrato:", contractError)
      results.errors.push("Não foi possível inicializar o contrato")
      return results
    }

    // Verificar se o airdrop está ativo
    try {
      const airdropInfo = await contract.methods.getAirdropInfo().call()
      results.airdropIsActive = airdropInfo.active

      if (!results.airdropIsActive) {
        results.errors.push("O airdrop não está ativo no momento")
      }
    } catch (airdropInfoError) {
      console.error("Erro ao obter informações do airdrop:", airdropInfoError)
      results.errors.push("Não foi possível verificar se o airdrop está ativo")
      return results
    }

    // Verificar se o contrato tem tokens suficientes
    try {
      let tokenAddress
      try {
        tokenAddress = await contract.methods.token().call()
      } catch (tokenAddressError) {
        console.error("Erro ao obter endereço do token:", tokenAddressError)
        results.errors.push("Não foi possível obter o endereço do token")
        // Usar endereço padrão do token como fallback
        tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "0xAF01804Def25a42A51e76994d42489083b1D40f8"
      }

      try {
        // Verificar se o endereço do token é válido
        if (!web3.utils.isAddress(tokenAddress)) {
          results.errors.push("Endereço do token inválido")
          return results
        }

        // Verificar se o token existe
        const tokenCode = await web3.eth.getCode(tokenAddress)
        if (tokenCode === "0x" || tokenCode === "0x0") {
          results.errors.push("Contrato do token não encontrado")
          return results
        }

        const tokenContract = new web3.eth.Contract(tokenABI as AbiItem[], tokenAddress)
        const tokenBalance = await tokenContract.methods.balanceOf(contractAddress).call()
        results.contractHasBalance = Number(tokenBalance) > 0

        if (!results.contractHasBalance) {
          results.errors.push("O contrato não possui tokens suficientes para distribuição")
        }
      } catch (balanceError) {
        console.error("Erro ao verificar saldo de tokens:", balanceError)
        results.errors.push("Não foi possível verificar o saldo de tokens do contrato")
      }
    } catch (tokenError) {
      console.error("Erro ao verificar token:", tokenError)
      results.errors.push("Não foi possível verificar informações do token")
    }

    // Verificar se é possível reivindicar tokens (simulação)
    try {
      // Obter uma conta para teste
      try {
        const accounts = await web3.eth.getAccounts()
        if (accounts.length > 0) {
          const testAccount = accounts[0]

          try {
            // Verificar elegibilidade
            const isEligible = await contract.methods.isEligible(testAccount).call()

            // Verificar se já reivindicou
            const userInfo = await contract.methods.getUserInfo(testAccount).call()

            results.canClaimTokens = isEligible && !userInfo.claimed

            if (!results.canClaimTokens) {
              if (!isEligible) {
                results.errors.push("Teste de elegibilidade falhou")
              }
              if (userInfo.claimed) {
                results.errors.push("Teste de reivindicação falhou - tokens já reivindicados")
              }
            }
          } catch (eligibilityError) {
            console.error("Erro ao verificar elegibilidade:", eligibilityError)
            results.errors.push("Não foi possível verificar a elegibilidade")
          }
        }
      } catch (accountsError) {
        console.error("Erro ao obter contas:", accountsError)
        results.errors.push("Não foi possível obter contas para teste")
      }
    } catch (claimError) {
      console.error("Erro ao verificar possibilidade de reivindicação:", claimError)
      results.errors.push("Não foi possível verificar a possibilidade de reivindicação")
    }
  } catch (error) {
    console.error("Erro durante verificações de segurança:", error)
    results.errors.push("Erro durante verificações de segurança")
  }

  return results
}

/**
 * Verifica se o sistema está pronto para uso
 * @param web3 Instância Web3
 * @param chainId ID da rede
 * @returns Objeto com status e mensagem
 */
export async function checkSystemReadiness(web3: Web3 | null, chainId: number | null) {
  if (!web3 || !chainId) {
    return {
      ready: false,
      message: "Web3 não inicializado ou rede não identificada",
    }
  }

  try {
    const securityChecks = await performSecurityChecks(web3, chainId)

    if (securityChecks.errors.length > 0) {
      return {
        ready: false,
        message: securityChecks.errors[0],
      }
    }

    if (!securityChecks.contractExists) {
      return {
        ready: false,
        message: "Contrato não encontrado",
      }
    }

    if (!securityChecks.airdropIsActive) {
      return {
        ready: false,
        message: "Airdrop não está ativo",
      }
    }

    if (!securityChecks.contractHasBalance) {
      return {
        ready: false,
        message: "Contrato sem saldo suficiente",
      }
    }

    return {
      ready: true,
      message: "Sistema pronto para uso",
    }
  } catch (error) {
    console.error("Erro ao verificar prontidão do sistema:", error)
    return {
      ready: false,
      message: "Erro ao verificar prontidão do sistema",
    }
  }
}

