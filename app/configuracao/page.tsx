"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Server, Code, Cog, Database, Shield, FileCode, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/hooks/use-web3"
// Update the import to use the default export
import InstallationGuide from "./installation-guide"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function ConfiguracaoPage() {
  const [activeTab, setActiveTab] = useState("setup")
  const { address, disconnect } = useWeb3()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  // Verificar se já está autenticado no localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem("configAuth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar a senha
    if (password === "99110990Webytebr@") {
      setIsAuthenticated(true)
      setError("")
      // Salvar estado de autenticação no localStorage
      localStorage.setItem("configAuth", "true")
    } else {
      setError("Senha incorreta. Tente novamente.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("configAuth")
    router.push("/")
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">Área Restrita</h1>
          <p className="text-muted-foreground">
            Esta página contém informações de configuração sensíveis e é protegida por senha.
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Autenticação Necessária</CardTitle>
            <CardDescription>Digite a senha para acessar a documentação de configuração.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Acessar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-8 max-w-4xl relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-4xl font-bold text-white pulsate"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Configuração do Airdrop Street Dog Coin
        </motion.h1>

        <Button variant="outline" onClick={handleLogout}>
          <Lock className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>

      {address && (
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground mb-2">Conectado como:</p>
          <p className="font-mono text-sm mb-2">{address}</p>
          <Button variant="outline" onClick={disconnect}>
            Desconectar Carteira
          </Button>
        </motion.div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="setup">Configuração</TabsTrigger>
            <TabsTrigger value="installation">Instalação</TabsTrigger>
            <TabsTrigger value="changelog">Histórico de Alterações</TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="setup">
          <SetupInstructions />
        </TabsContent>

        <TabsContent value="installation">
          <InstallationGuide />
        </TabsContent>

        <TabsContent value="changelog">
          <Changelog />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

function SetupInstructions() {
  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Alert className="mb-6 bg-opacity-80 backdrop-blur-sm">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Siga este guia passo a passo para configurar e implantar o sistema de airdrop Street Dog Coin. Certifique-se
          de seguir cada etapa cuidadosamente para garantir a configuração correta.
        </AlertDescription>
      </Alert>

      <ConfigSection
        title="1. Requisitos do Sistema"
        icon={Server}
        steps={[
          "Servidor: VPS com pelo menos 2GB de RAM e 1 vCPU (recomendado: 4GB RAM, 2 vCPU)",
          "Sistema Operacional: Ubuntu 20.04 LTS ou superior",
          "Domínio: Um domínio registrado para hospedar a aplicação",
          "Certificado SSL: Necessário para conexões seguras (Let's Encrypt gratuito)",
          "Conta na Infura ou Alchemy para acesso às redes blockchain",
          "Carteira Ethereum com fundos suficientes para implantação de contratos",
        ]}
      />

      <ConfigSection
        title="2. Preparação do Ambiente"
        icon={Cog}
        steps={[
          "Instale o Node.js (versão 16 ou superior) e npm em sua máquina de desenvolvimento",
          "Instale o Git para clonar o repositório",
          "Crie uma conta no GitHub se você não tiver uma",
          "Instale o MetaMask ou outra carteira compatível com Web3 em seu navegador",
          "Configure chaves SSH para acesso seguro ao servidor",
          "Instale o Docker e Docker Compose para containerização (opcional, mas recomendado)",
        ]}
      />

      <ConfigSection
        title="3. Configuração do Contrato Inteligente"
        icon={Code}
        steps={[
          "Abra o arquivo contracts/StreetDogCoinAirdrop.sol e ajuste os parâmetros do airdrop conforme necessário",
          "Modifique o valor de tokens por usuário (airdropAmount) e bônus de referral (referralBonus)",
          "Configure os períodos de início e término do airdrop",
          "Use o Remix IDE (https://remix.ethereum.org/) ou Hardhat para compilar o contrato",
          "Implante o contrato na rede desejada (Ethereum, BSC, Polygon) usando o MetaMask",
          "Verifique o contrato no explorador de blocos correspondente (Etherscan, BscScan, etc.)",
          "Anote o endereço do contrato implantado para cada rede",
        ]}
      />

      <ConfigSection
        title="4. Configuração das Variáveis de Ambiente"
        icon={FileCode}
        steps={[
          "Crie um arquivo .env.local na raiz do projeto com as seguintes variáveis:",
          "NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM=0x... (endereço do contrato na Ethereum)",
          "NEXT_PUBLIC_CONTRACT_ADDRESS_BSC=0x... (endereço do contrato na BSC)",
          "NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON=0x... (endereço do contrato na Polygon)",
          "NEXT_PUBLIC_CONTRACT_ADDRESS_GOERLI=0x... (endereço do contrato na Goerli)",
          "NEXT_PUBLIC_CONTRACT_ADDRESS_BSC_TESTNET=0x... (endereço do contrato na BSC Testnet)",
          "NEXT_PUBLIC_TOKEN_ADDRESS=0x... (endereço do token ERC-20)",
          "NEXT_PUBLIC_INFURA_ID=... (sua chave da Infura)",
          "NEXT_PUBLIC_ALCHEMY_KEY=... (sua chave da Alchemy)",
          "Certifique-se de que todas as variáveis NEXT_PUBLIC_ sejam acessíveis no cliente",
        ]}
      />

      <ConfigSection
        title="5. Configuração do Banco de Dados (Opcional)"
        icon={Database}
        steps={[
          "Se você precisar de persistência de dados, configure um banco de dados MongoDB ou PostgreSQL",
          "Adicione as variáveis de conexão ao banco de dados no arquivo .env.local:",
          "DATABASE_URL=... (URL de conexão com o banco de dados)",
          "Implemente as funções de acesso ao banco de dados em /lib/db.ts",
          "Modifique as funções em /lib/airdrop.ts para usar o banco de dados em vez de simulação",
        ]}
      />

      <ConfigSection
        title="6. Configuração de Segurança"
        icon={Shield}
        steps={[
          "Implemente rate limiting para evitar abusos na API",
          "Configure CORS para permitir apenas origens confiáveis",
          "Adicione proteção contra ataques CSRF",
          "Implemente validação de entrada em todas as APIs",
          "Configure monitoramento e alertas para atividades suspeitas",
          "Realize testes de segurança antes do lançamento",
        ]}
      />

      <Alert className="mt-8 bg-opacity-80 backdrop-blur-sm">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Configuração Concluída!</AlertTitle>
        <AlertDescription>
          Após seguir todas essas etapas de configuração, você estará pronto para prosseguir com a instalação do sistema
          em um servidor de produção. Consulte a guia "Instalação" para instruções detalhadas sobre como implantar o
          sistema.
        </AlertDescription>
      </Alert>
    </motion.div>
  )
}

function Changelog() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-opacity-80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Histórico de Alterações</CardTitle>
          <CardDescription>Histórico de Atualizações do Airdrop Street Dog Coin</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <strong>v1.5.0 (10/03/2025)</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Corrigidos erros de "execution reverted" em chamadas de contrato</li>
                <li>Implementado sistema de fallback para desenvolvimento sem contrato</li>
                <li>Adicionado timer de verificação de elegibilidade com progresso visual</li>
                <li>Melhorado tratamento de erros em todas as chamadas de contrato</li>
                <li>Adicionada página de configuração de arquivos detalhada</li>
                <li>Implementado processamento passo a passo de reivindicações</li>
              </ul>
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <strong>v1.4.0 (07/03/2025)</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Adicionado sistema de confetti para celebrar reivindicações bem-sucedidas</li>
                <li>Implementado aviso sobre compatibilidade de carteiras (Trust Wallet vs MetaMask)</li>
                <li>Adicionado componente SystemStatus para verificação de prontidão do sistema</li>
                <li>Melhorias de segurança com verificações robustas de contratos</li>
                <li>Adicionado componente Badge para melhor visualização de status</li>
                <li>Corrigidos bugs na verificação de elegibilidade</li>
              </ul>
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <strong>v1.3.0 (10/03/2025)</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Adicionado fundo de galáxia animado com elementos cósmicos</li>
                <li>Melhoradas animações e efeitos da interface</li>
                <li>Adicionado suporte para múltiplos idiomas (EN, PT-BR, ES, FR)</li>
                <li>Atualizada documentação e instruções de configuração</li>
              </ul>
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <strong>v1.2.0 (06/03/2025)</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Adicionado suporte para múltiplas redes blockchain</li>
                <li>Implementado sistema de referência</li>
                <li>Melhorada interface do usuário e animações</li>
                <li>Adicionado sistema de fallback para redes não suportadas</li>
                <li>Implementada verificação de saldo de tokens em tempo real</li>
              </ul>
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <strong>v1.1.0 (15/02/2025)</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Integrado Twitter e Telegram para verificação de tarefas</li>
                <li>Adicionada página de configuração detalhada</li>
                <li>Correções de bugs e melhorias de desempenho</li>
                <li>Implementado sistema de estatísticas em tempo real</li>
                <li>Adicionada página de status para acompanhamento de reivindicações</li>
              </ul>
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <strong>v1.0.0 (01/01/2025)</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Lançamento inicial do Airdrop Street Dog Coin</li>
                <li>Suporte básico para reivindicação de tokens</li>
                <li>Interface de usuário responsiva</li>
                <li>Implementação inicial do contrato inteligente</li>
                <li>Suporte para conexão de carteira Web3</li>
              </ul>
            </motion.li>
          </ul>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Para ver o histórico completo de alterações, visite nosso repositório no GitHub.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function ConfigSection({ title, icon: Icon, steps }: { title: string; icon: any; steps: React.ReactNode[] }) {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-opacity-80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            {steps.map((step, index) => (
              <motion.li
                key={index}
                className="text-white"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {step}
              </motion.li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </motion.div>
  )
}

