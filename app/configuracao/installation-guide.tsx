"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, FileCode, Download, Server, Database, Shield, Code, Laptop } from "lucide-react"
import { motion } from "framer-motion"

export default function InstallationGuide() {
  return (
    <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Alert className="mb-6 bg-opacity-80 backdrop-blur-sm">
        <Download className="h-4 w-4" />
        <AlertTitle>Guia de Instalação e Configuração</AlertTitle>
        <AlertDescription>
          Este guia detalhado explica como instalar e configurar o sistema de airdrop Street Dog Coin em um servidor
          web. Siga as etapas na ordem apresentada para garantir uma instalação bem-sucedida.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="server" className="mb-8">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="server">Servidor</TabsTrigger>
          <TabsTrigger value="files">Arquivos</TabsTrigger>
          <TabsTrigger value="contract">Contrato</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="ide">VS Code x PHPStorm</TabsTrigger>
        </TabsList>

        <TabsContent value="server">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Configuração do Servidor
              </CardTitle>
              <CardDescription>Passos para configurar o servidor web e implantar a aplicação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. Requisitos do Servidor</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Servidor Linux (Ubuntu 20.04 LTS ou superior recomendado)</li>
                  <li>Mínimo de 2GB de RAM e 1 vCPU</li>
                  <li>Pelo menos 20GB de espaço em disco</li>
                  <li>Node.js 16.x ou superior</li>
                  <li>Nginx ou Apache como servidor web</li>
                  <li>Certificado SSL (Let's Encrypt recomendado)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. Preparação do Servidor</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  # Atualizar o sistema
                  <br />
                  sudo apt update && sudo apt upgrade -y
                  <br />
                  <br /># Instalar dependências
                  <br />
                  sudo apt install -y curl git build-essential nginx
                  <br />
                  <br /># Instalar Node.js 16.x
                  <br />
                  curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -<br />
                  sudo apt install -y nodejs
                  <br />
                  <br /># Verificar instalação
                  <br />
                  node --version # Deve mostrar v16.x.x
                  <br />
                  npm --version # Deve mostrar 8.x.x
                  <br />
                  <br /># Instalar PM2 para gerenciamento de processos
                  <br />
                  sudo npm install -g pm2
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. Configuração do Nginx</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  # Criar arquivo de configuração do Nginx
                  <br />
                  sudo nano /etc/nginx/sites-available/streetdogcoin
                  <br />
                  <br /># Adicionar a seguinte configuração:
                  <br />
                  server &#123;
                  <br />
                  &nbsp;&nbsp;listen 80;
                  <br />
                  &nbsp;&nbsp;server_name seu-dominio.com www.seu-dominio.com;
                  <br />
                  <br />
                  &nbsp;&nbsp;location / &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_pass http://localhost:3000;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_http_version 1.1;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header Upgrade $http_upgrade;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header Connection 'upgrade';
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_set_header Host $host;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;proxy_cache_bypass $http_upgrade;
                  <br />
                  &nbsp;&nbsp;&#125;
                  <br />
                  &#125;
                  <br />
                  <br /># Ativar o site
                  <br />
                  sudo ln -s /etc/nginx/sites-available/streetdogcoin /etc/nginx/sites-enabled/
                  <br />
                  <br /># Verificar configuração
                  <br />
                  sudo nginx -t
                  <br />
                  <br /># Reiniciar Nginx
                  <br />
                  sudo systemctl restart nginx
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4. Configuração do SSL com Let's Encrypt</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  # Instalar Certbot
                  <br />
                  sudo apt install -y certbot python3-certbot-nginx
                  <br />
                  <br /># Obter certificado SSL
                  <br />
                  sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
                  <br />
                  <br /># Seguir as instruções na tela
                  <br />
                  <br /># Verificar renovação automática
                  <br />
                  sudo certbot renew --dry-run
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5. Implantação da Aplicação</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  # Criar diretório para a aplicação
                  <br />
                  mkdir -p /var/www/streetdogcoin
                  <br />
                  <br /># Clonar o repositório
                  <br />
                  git clone https://github.com/seu-usuario/streetdogcoin-airdrop.git /var/www/streetdogcoin
                  <br />
                  <br /># Navegar até o diretório
                  <br />
                  cd /var/www/streetdogcoin
                  <br />
                  <br /># Instalar dependências
                  <br />
                  npm install
                  <br />
                  <br /># Criar arquivo .env.local (ver seção de configuração)
                  <br />
                  <br /># Construir a aplicação
                  <br />
                  npm run build
                  <br />
                  <br /># Iniciar com PM2
                  <br />
                  pm2 start npm --name "streetdogcoin" -- start
                  <br />
                  pm2 save
                  <br />
                  pm2 startup
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Dica de Segurança</AlertTitle>
                <AlertDescription>
                  Recomendamos configurar um firewall (UFW) para proteger seu servidor, permitindo apenas as portas
                  necessárias (22, 80, 443).
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Arquivos que Precisam de Configuração
              </CardTitle>
              <CardDescription>
                Lista detalhada dos arquivos que precisam ser editados para a plataforma funcionar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. Variáveis de Ambiente</h3>
                <p className="mb-2">
                  <strong>Arquivo:</strong> <code>.env.local</code> (na raiz do projeto)
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  # Endereços dos contratos em diferentes redes
                  <br />
                  NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM=0x...
                  <br />
                  NEXT_PUBLIC_CONTRACT_ADDRESS_BSC=0x...
                  <br />
                  NEXT_PUBLIC_CONTRACT_ADDRESS_POLYGON=0x...
                  <br />
                  NEXT_PUBLIC_CONTRACT_ADDRESS_GOERLI=0x...
                  <br />
                  NEXT_PUBLIC_CONTRACT_ADDRESS_BSC_TESTNET=0x...
                  <br />
                  <br /># Endereço do token ERC-20
                  <br />
                  NEXT_PUBLIC_TOKEN_ADDRESS=0x...
                  <br />
                  <br /># Chaves de API (obrigatório para conexão com as redes)
                  <br />
                  NEXT_PUBLIC_INFURA_ID=your_infura_id
                  <br />
                  NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. Configuração de Redes</h3>
                <p className="mb-2">
                  <strong>Arquivo:</strong> <code>lib/networks.ts</code>
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  export const SUPPORTED_NETWORKS: NetworkType[] = [<br />
                  &nbsp;&nbsp;&#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;id: "ethereum",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;name: "Ethereum",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;chainId: 1,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;rpcUrl:
                  "https://mainnet.infura.io/v3/$&#123;process.env.NEXT_PUBLIC_INFURA_ID&#125;",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;currencySymbol: "ETH",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;blockExplorerUrl: "https://etherscan.io",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;isTestnet: false,
                  <br />
                  &nbsp;&nbsp;&#125;,
                  <br />
                  &nbsp;&nbsp;// Adicione ou modifique as redes conforme necessário
                  <br />]
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. Endereços dos Contratos</h3>
                <p className="mb-2">
                  <strong>Arquivo:</strong> <code>utils/constants.ts</code>
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  // Endereço do contrato principal
                  <br />
                  export const DEFAULT_CONTRACT_ADDRESS = "0x..." // Substitua pelo endereço real
                  <br />
                  <br />
                  // Configurações de redes suportadas
                  <br />
                  export const NETWORK_CONFIG = &#123;
                  <br />
                  &nbsp;&nbsp;ETHEREUM: &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;id: 1,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;name: "Ethereum Mainnet",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_ETHEREUM ||
                  DEFAULT_CONTRACT_ADDRESS,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;explorer: "https://etherscan.io",
                  <br />
                  &nbsp;&nbsp;&#125;,
                  <br />
                  &nbsp;&nbsp;// Adicione mais redes conforme necessário
                  <br />
                  &#125;
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4. Configuração de Tarefas</h3>
                <p className="mb-2">
                  <strong>Arquivo:</strong> <code>config/tasks.json</code> (crie se não existir)
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  &#123;
                  <br />
                  &nbsp;&nbsp;"tasks": [<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "twitter-follow",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "social",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"platform": "twitter",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"action": "follow",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"target": "@StreetDogCoin",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"points": 10,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"required": true
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;// Adicione mais tarefas conforme necessário
                  <br />
                  &nbsp;&nbsp;],
                  <br />
                  &nbsp;&nbsp;"minimumPoints": 30,
                  <br />
                  &nbsp;&nbsp;"referralBonus": 20
                  <br />
                  &#125;
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5. Personalização da Interface</h3>
                <p className="mb-2">
                  <strong>Arquivos:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <code>components/navbar.tsx</code> - Cabeçalho e navegação
                  </li>
                  <li>
                    <code>components/footer.tsx</code> - Rodapé
                  </li>
                  <li>
                    <code>app/page.tsx</code> - Página inicial
                  </li>
                  <li>
                    <code>styles/globals.css</code> - Estilos globais e cores
                  </li>
                  <li>
                    <code>tailwind.config.js</code> - Configuração de cores e temas
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">6. Configuração de ABIs</h3>
                <p className="mb-2">
                  <strong>Arquivos:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <code>contracts/abi/StreetDogCoinAirdrop.json</code> - ABI do contrato de airdrop
                  </li>
                  <li>
                    <code>contracts/abi/ERC20.json</code> - ABI do token ERC-20
                  </li>
                </ul>
                <p className="mt-2">Certifique-se de que os ABIs correspondam exatamente aos contratos implantados.</p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  Após editar qualquer arquivo de configuração, você precisará reconstruir a aplicação com{" "}
                  <code>npm run build</code> e reiniciar o serviço com <code>pm2 restart streetdogcoin</code>.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contract">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Implantação e Configuração do Contrato
              </CardTitle>
              <CardDescription>Passos para implantar e configurar o contrato inteligente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. Preparação do Contrato</h3>
                <p className="mb-2">
                  <strong>Arquivo:</strong> <code>contracts/StreetDogCoinAirdrop.sol</code>
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  // Ajuste os parâmetros do contrato conforme necessário
                  <br />
                  <br />
                  // Valor de tokens por usuário
                  <br />
                  uint256 public airdropAmount = 1000 * 10**18; // 1000 tokens por usuário
                  <br />
                  <br />
                  // Bônus de referral
                  <br />
                  uint256 public referralBonus = 200 * 10**18; // 200 tokens por referral
                  <br />
                  <br />
                  // Períodos de início e término (configure na função setAirdropTime após a implantação)
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. Compilação e Implantação</h3>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>
                    Acesse o{" "}
                    <a
                      href="https://remix.ethereum.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Remix IDE
                    </a>
                  </li>
                  <li>
                    Crie um novo arquivo e cole o código do contrato <code>StreetDogCoinAirdrop.sol</code>
                  </li>
                  <li>Compile o contrato (Solidity Compiler 0.8.17+)</li>
                  <li>Vá para a aba "Deploy & Run Transactions"</li>
                  <li>Selecione "Injected Web3" como ambiente (certifique-se de que o MetaMask está conectado)</li>
                  <li>Selecione a rede desejada no MetaMask (Ethereum, BSC, Polygon, etc.)</li>
                  <li>Implante o contrato com o endereço do token ERC-20 como parâmetro</li>
                  <li>Anote o endereço do contrato implantado</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. Configuração Pós-Implantação</h3>
                <p className="mb-2">Após a implantação, você precisa configurar o contrato:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>
                    Chame a função <code>setAirdropTime</code> para definir as datas de início e término
                  </li>
                  <li>
                    Chame a função <code>toggleAirdropStatus</code> para ativar o airdrop
                  </li>
                  <li>Transfira tokens para o contrato (suficientes para cobrir todos os participantes esperados)</li>
                  <li>Verifique o contrato no explorador de blocos (Etherscan, BscScan, etc.)</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4. Verificação do Contrato</h3>
                <p className="mb-2">
                  Verifique o contrato no explorador de blocos para que os usuários possam interagir com ele
                  diretamente:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Vá para o explorador de blocos da rede (Etherscan, BscScan, etc.)</li>
                  <li>Busque pelo endereço do contrato</li>
                  <li>Vá para a aba "Contract" e clique em "Verify and Publish"</li>
                  <li>Selecione o compilador Solidity 0.8.17</li>
                  <li>Cole o código-fonte exato do contrato</li>
                  <li>Inclua todas as bibliotecas e dependências</li>
                  <li>Envie para verificação</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5. Teste do Contrato</h3>
                <p className="mb-2">Antes de lançar oficialmente, teste todas as funcionalidades do contrato:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    Verifique se a função <code>isEligible</code> retorna corretamente
                  </li>
                  <li>
                    Teste a função <code>claimTokens</code> com uma carteira de teste
                  </li>
                  <li>
                    Teste a função <code>claimWithReferral</code> com uma carteira de referência
                  </li>
                  <li>Verifique se os tokens são transferidos corretamente</li>
                  <li>Teste o sistema de referral para garantir que os bônus são distribuídos</li>
                </ul>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Segurança do Contrato</AlertTitle>
                <AlertDescription>
                  Recomendamos realizar uma auditoria de segurança no contrato antes de lançá-lo em produção,
                  especialmente se você espera um grande número de participantes ou está distribuindo tokens de alto
                  valor.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configurações Adicionais
              </CardTitle>
              <CardDescription>Configurações avançadas e personalizações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. Configuração de Idiomas</h3>
                <p className="mb-2">
                  <strong>Arquivo:</strong> <code>lib/translations.ts</code>
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  export const translations = &#123;
                  <br />
                  &nbsp;&nbsp;en: &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;connectWallet: "Connect Wallet",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;airdropStats: "Airdrop Stats",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;// Adicione ou modifique traduções conforme necessário
                  <br />
                  &nbsp;&nbsp;&#125;,
                  <br />
                  &nbsp;&nbsp;pt: &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;connectWallet: "Conectar Carteira",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;airdropStats: "Estatísticas do Airdrop",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;// Adicione ou modifique traduções conforme necessário
                  <br />
                  &nbsp;&nbsp;&#125;,
                  <br />
                  &nbsp;&nbsp;// Adicione mais idiomas conforme necessário
                  <br />
                  &#125;
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. Personalização de Cores e Tema</h3>
                <p className="mb-2">
                  <strong>Arquivo:</strong> <code>tailwind.config.js</code>
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  module.exports = &#123;
                  <br />
                  &nbsp;&nbsp;// ...
                  <br />
                  &nbsp;&nbsp;theme: &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;extend: &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;colors: &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Personalize as cores aqui
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;primary: &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DEFAULT: "hsl(var(--primary))",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;foreground:
                  "hsl(var(--primary-foreground))",
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&#125;,
                  <br />
                  &nbsp;&nbsp;&#125;,
                  <br />
                  &#125;
                </div>
                <p className="mb-2">
                  <strong>Arquivo:</strong> <code>styles/globals.css</code>
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  @layer base &#123;
                  <br />
                  &nbsp;&nbsp;:root &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;--background: 240 50% 5%;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;--foreground: 0 0% 100%;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;--primary: 280 75% 60%;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;// Personalize as variáveis CSS aqui
                  <br />
                  &nbsp;&nbsp;&#125;
                  <br />
                  &#125;
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. Configuração de Análises e Rastreamento</h3>
                <p className="mb-2">
                  <strong>Arquivo:</strong> <code>app/layout.tsx</code>
                </p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  // Adicione scripts de análise como Google Analytics
                  <br />
                  export default function RootLayout(&#123; children &#125;: &#123; children: React.ReactNode &#125;)
                  &#123;
                  <br />
                  &nbsp;&nbsp;return (<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;html lang="pt-BR"&gt;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;head&gt;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;!-- Scripts de análise --&gt;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;script async
                  src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"&gt;&lt;/script&gt;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;script&gt;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;window.dataLayer = window.dataLayer || [];
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;function gtag()&#123;dataLayer.push(arguments);&#125;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gtag('js', new Date());
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gtag('config', 'YOUR_GA_ID');
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/script&gt;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/head&gt;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// ...
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&lt;/html&gt;
                  <br />
                  &nbsp;&nbsp;);
                  <br />
                  &#125;
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4. Configuração de Segurança</h3>
                <p className="mb-2">Adicione cabeçalhos de segurança ao servidor:</p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  # Adicione ao arquivo de configuração do Nginx
                  <br />
                  server &#123;
                  <br />
                  &nbsp;&nbsp;// ...
                  <br />
                  &nbsp;&nbsp;# Cabeçalhos de segurança
                  <br />
                  &nbsp;&nbsp;add_header X-Frame-Options "SAMEORIGIN" always;
                  <br />
                  &nbsp;&nbsp;add_header X-Content-Type-Options "nosniff" always;
                  <br />
                  &nbsp;&nbsp;add_header X-XSS-Protection "1; mode=block" always;
                  <br />
                  &nbsp;&nbsp;add_header Referrer-Policy "strict-origin-when-cross-origin" always;
                  <br />
                  &nbsp;&nbsp;add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'
                  'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:
                  https:; font-src 'self' data:; connect-src 'self' https://*.infura.io https://*.alchemyapi.io;"
                  always;
                  <br />
                  &nbsp;&nbsp;// ...
                  <br />
                  &#125;
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5. Configuração de Backup</h3>
                <p className="mb-2">Configure backups automáticos:</p>
                <div className="bg-muted p-4 rounded-md font-mono text-xs mb-2">
                  # Criar script de backup
                  <br />
                  sudo nano /usr/local/bin/backup-streetdogcoin.sh
                  <br />
                  <br /># Conteúdo do script
                  <br />
                  #!/bin/bash
                  <br />
                  BACKUP_DIR="/var/backups/streetdogcoin"
                  <br />
                  DATE=$(date +%Y-%m-%d)
                  <br />
                  mkdir -p $BACKUP_DIR
                  <br />
                  tar -czf $BACKUP_DIR/streetdogcoin-$DATE.tar.gz /var/www/streetdogcoin
                  <br />
                  find $BACKUP_DIR -type f -mtime +30 -delete
                  <br />
                  <br /># Tornar executável
                  <br />
                  sudo chmod +x /usr/local/bin/backup-streetdogcoin.sh
                  <br />
                  <br /># Adicionar ao crontab
                  <br />
                  (crontab -l 2&gt;/dev/null; echo "0 2 * * * /usr/local/bin/backup-streetdogcoin.sh") | crontab -
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Configuração Completa</AlertTitle>
                <AlertDescription>
                  Após concluir todas as configurações, reinicie a aplicação e verifique se tudo está funcionando
                  corretamente. Monitore os logs para identificar possíveis problemas:{" "}
                  <code>pm2 logs streetdogcoin</code>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ide">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Laptop className="h-5 w-5" />
                VS Code x PHPStorm
              </CardTitle>
              <CardDescription>Guia de instalação e configuração usando IDEs populares</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. Instalação com VS Code</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>
                    <strong>Instale o VS Code:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>
                        Baixe e instale o VS Code do{" "}
                        <a
                          href="https://code.visualstudio.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          site oficial
                        </a>
                      </li>
                      <li>
                        Instale as extensões recomendadas: ESLint, Prettier, Tailwind CSS IntelliSense, TypeScript Vue
                        Plugin
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Clone o repositório:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">
                      git clone https://github.com/seu-usuario/streetdogcoin-airdrop.git
                      <br />
                      cd streetdogcoin-airdrop
                    </div>
                  </li>
                  <li>
                    <strong>Abra o projeto no VS Code:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">code .</div>
                  </li>
                  <li>
                    <strong>Instale as dependências:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">npm install --legacy-peer-deps</div>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">npm install --force</div>
                        Essas opções permitem que o npm ignore os conflitos de dependência e prossiga com a instalação.
                  </li>
                  <li>
                    <strong>Configure as variáveis de ambiente:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>
                        Crie um arquivo <code>.env.local</code> na raiz do projeto
                      </li>
                      <li>Adicione as variáveis necessárias (veja a seção "Arquivos")</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Inicie o servidor de desenvolvimento:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">npm run dev</div>
                  </li>
                  <li>
                    <strong>Edite os arquivos principais:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>
                        <code>app/page.tsx</code> - Página inicial e conteúdo principal
                      </li>
                      <li>
                        <code>utils/constants.ts</code> - Endereços dos contratos
                      </li>
                      <li>
                        <code>lib/networks.ts</code> - Configuração de redes blockchain
                      </li>
                      <li>
                        <code>styles/globals.css</code> - Estilos globais e cores
                      </li>
                      <li>
                        <code>tailwind.config.js</code> - Configuração de temas
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Prepare para produção:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">npm run build</div>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. Instalação com PHPStorm</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>
                    <strong>Instale o PHPStorm:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>
                        Baixe e instale o PHPStorm do{" "}
                        <a
                          href="https://www.jetbrains.com/phpstorm/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          site oficial
                        </a>
                      </li>
                      <li>Instale os plugins: Tailwind CSS, ESLint, Prettier</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Clone o repositório:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">
                      git clone https://github.com/seu-usuario/streetdogcoin-airdrop.git
                    </div>
                  </li>
                  <li>
                    <strong>Abra o projeto no PHPStorm:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Abra o PHPStorm</li>
                      <li>Selecione "Open" e navegue até a pasta do projeto</li>
                      <li>Clique em "Trust Project" se solicitado</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Configure o Terminal integrado:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Abra o terminal integrado (Alt+F12)</li>
                      <li>
                        Execute <code>npm install</code> para instalar as dependências
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Configure as variáveis de ambiente:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>
                        Crie um arquivo <code>.env.local</code> na raiz do projeto
                      </li>
                      <li>Adicione as variáveis necessárias (veja a seção "Arquivos")</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Configure o Node.js:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Vá para File &gt; Settings &gt; Languages & Frameworks &gt; Node.js</li>
                      <li>Verifique se o Node.js está configurado corretamente</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Inicie o servidor de desenvolvimento:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">npm run dev</div>
                  </li>
                  <li>
                    <strong>Prepare para produção:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">npm run build</div>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. Arquivos Principais para Edição</h3>
                <p className="mb-2">Os seguintes arquivos são essenciais para personalizar a aplicação:</p>

                <div className="space-y-3 ml-4">
                  <div>
                    <strong className="block mb-1">Página Inicial:</strong>
                    <code className="bg-muted px-2 py-1 rounded">app/page.tsx</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Este arquivo contém todo o conteúdo e estrutura da página inicial, incluindo textos, botões e
                      componentes.
                    </p>
                  </div>

                  <div>
                    <strong className="block mb-1">Navegação:</strong>
                    <code className="bg-muted px-2 py-1 rounded">components/navbar.tsx</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contém o cabeçalho e os links de navegação do site.
                    </p>
                  </div>

                  <div>
                    <strong className="block mb-1">Rodapé:</strong>
                    <code className="bg-muted px-2 py-1 rounded">components/footer.tsx</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contém o rodapé do site com links e informações de copyright.
                    </p>
                  </div>

                  <div>
                    <strong className="block mb-1">Estilos e Temas:</strong>
                    <code className="bg-muted px-2 py-1 rounded">styles/globals.css</code> e{" "}
                    <code className="bg-muted px-2 py-1 rounded">tailwind.config.js</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Estes arquivos controlam a aparência visual da aplicação, incluindo cores, fontes e animações.
                    </p>
                  </div>

                  <div>
                    <strong className="block mb-1">Configuração de Contratos:</strong>
                    <code className="bg-muted px-2 py-1 rounded">utils/constants.ts</code> e{" "}
                    <code className="bg-muted px-2 py-1 rounded">lib/networks.ts</code>
                    <p className="text-sm text-muted-foreground mt-1">
                      Definem os endereços dos contratos e as redes blockchain suportadas.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4. Preparando para Produção</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>
                    <strong>Verifique todas as configurações:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>Certifique-se de que todas as variáveis de ambiente estão configuradas</li>
                      <li>Verifique se os endereços dos contratos estão corretos</li>
                      <li>Teste todas as funcionalidades em ambiente de desenvolvimento</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Construa a aplicação:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">npm run build</div>
                  </li>
                  <li>
                    <strong>Teste a versão de produção localmente:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">npm start</div>
                  </li>
                  <li>
                    <strong>Prepare os arquivos para upload:</strong>
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>
                        A pasta <code>.next</code> contém os arquivos compilados
                      </li>
                      <li>
                        Você precisará dos arquivos <code>package.json</code> e <code>package-lock.json</code>
                      </li>
                      <li>
                        Não esqueça do arquivo <code>.env.local</code> com as variáveis de ambiente
                      </li>
                      <li>
                        Inclua a pasta <code>public</code> para recursos estáticos
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Faça upload para o servidor:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">
                      # Usando SCP (Secure Copy) scp -r .next package.json package-lock.json .env.local public
                      usuario@seu-servidor:/var/www/streetdogcoin/
                    </div>
                  </li>
                  <li>
                    <strong>Configure o PM2 no servidor:</strong>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs mt-1 mb-2">
                      # No servidor cd /var/www/streetdogcoin npm install --production pm2 start npm --name
                      "streetdogcoin" -- start pm2 save pm2 startup
                    </div>
                  </li>
                </ol>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Dica de Produtividade</AlertTitle>
                <AlertDescription>
                  Tanto o VS Code quanto o PHPStorm oferecem recursos de depuração integrados para Next.js. Configure os
                  pontos de interrupção e use o depurador para solucionar problemas complexos mais facilmente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert className="mt-8 bg-opacity-80 backdrop-blur-sm">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Instalação Concluída!</AlertTitle>
        <AlertDescription>
          Parabéns! Seu sistema de airdrop Street Dog Coin agora está instalado e configurado. Certifique-se de testar
          todas as funcionalidades antes de anunciar o lançamento oficial. Para qualquer problema, verifique os logs do
          servidor e da aplicação.
        </AlertDescription>
      </Alert>
    </motion.div>
  )
}

