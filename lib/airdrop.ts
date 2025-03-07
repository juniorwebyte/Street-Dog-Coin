import type Web3 from "web3"
import type { AbiItem } from "web3-utils"
import airdropABI from "@/contracts/abi/StreetDogCoinAirdrop.json"

// Função para verificar elegibilidade
export async function checkEligibility(web3: Web3, contractAddress: string, address: string) {
  if (!web3 || !contractAddress) throw new Error("Web3 ou endereço do contrato não fornecido")

  const airdropContract = new web3.eth.Contract(airdropABI as AbiItem[], contractAddress)

  try {
    const isEligible = await airdropContract.methods.isEligible(address).call()
    const airdropInfo = await airdropContract.methods.getAirdropInfo().call()

    return {
      isEligible,
      amount: isEligible ? web3.utils.fromWei(airdropInfo.baseAmount, "ether") : "0",
    }
  } catch (error) {
    console.error("Erro ao verificar elegibilidade:", error)
    throw error
  }
}

// Função para reivindicar tokens
export async function claimAirdrop(web3: Web3, contractAddress: string, address: string) {
  if (!web3 || !contractAddress) throw new Error("Web3 ou endereço do contrato não fornecido")

  const airdropContract = new web3.eth.Contract(airdropABI as AbiItem[], contractAddress)

  try {
    const tx = await airdropContract.methods.claimTokens().send({ from: address })
    return { success: true, txHash: tx.transactionHash }
  } catch (error) {
    console.error("Erro ao reivindicar tokens:", error)
    throw error
  }
}

// Função para obter o status das reivindicações
export async function getClaimStatus(web3: Web3, contractAddress: string, address: string) {
  if (!web3 || !contractAddress) throw new Error("Web3 ou endereço do contrato não fornecido")

  const airdropContract = new web3.eth.Contract(airdropABI as AbiItem[], contractAddress)

  try {
    const userInfo = await airdropContract.methods.getUserInfo(address).call()
    const airdropInfo = await airdropContract.methods.getAirdropInfo().call()

    const claims = []
    if (userInfo.claimed) {
      claims.push({
        id: `claim-${address.substring(2, 8)}`,
        timestamp: Date.now(),
        amount: web3.utils.fromWei(airdropInfo.baseAmount, "ether"),
        status: "completed",
        txHash: "0x" + "0".repeat(64), // Placeholder para o hash da transação
      })
    }

    return claims
  } catch (error) {
    console.error("Erro ao obter status de reivindicação:", error)
    throw error
  }
}

// Função para obter estatísticas do airdrop
export async function getAirdropStats(web3: Web3, contractAddress: string) {
  if (!web3 || !contractAddress) throw new Error("Web3 ou endereço do contrato não fornecido")

  const airdropContract = new web3.eth.Contract(airdropABI as AbiItem[], contractAddress)

  try {
    const airdropInfo = await airdropContract.methods.getAirdropInfo().call()
    const tokenAddress = await airdropContract.methods.token().call()
    const tokenContract = new web3.eth.Contract(
      [
        { constant: true, inputs: [], name: "totalSupply", outputs: [{ name: "", type: "uint256" }], type: "function" },
      ] as AbiItem[],
      tokenAddress,
    )
    const totalSupply = await tokenContract.methods.totalSupply().call()

    const now = Date.now() / 1000
    const remainingDays = Math.max(0, Math.floor((Number(airdropInfo.end) - now) / 86400))

    return {
      totalTokens: web3.utils.fromWei(totalSupply, "ether"),
      claimedTokens: web3.utils.fromWei(airdropInfo.claimedAmount, "ether"),
      totalParticipants: airdropInfo.totalParticipants,
      remainingDays,
    }
  } catch (error) {
    console.error("Erro ao obter estatísticas do airdrop:", error)
    throw error
  }
}

