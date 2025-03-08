"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Política de Privacidade do Street Dog Coin Airdrop
            </CardTitle>
            <CardDescription>Última atualização: 15 de Março de 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <p>
              A Street Dog Coin ("nós", "nosso" ou "nossa") está comprometida em proteger sua privacidade. Esta Política
              de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você
              utiliza nossa plataforma de airdrop.
            </p>

            <h2 className="text-lg font-semibold mt-6">1. Informações que Coletamos</h2>
            <p>Podemos coletar os seguintes tipos de informações:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <strong>Informações da Carteira:</strong> Endereço público da sua carteira blockchain, histórico de
                transações públicas e saldo de tokens.
              </li>
              <li>
                <strong>Informações de Uso:</strong> Dados sobre como você interage com nossa plataforma, incluindo
                páginas visitadas, tempo gasto no site e ações realizadas.
              </li>
              <li>
                <strong>Informações do Dispositivo:</strong> Tipo de navegador, sistema operacional, endereço IP e
                informações sobre o dispositivo utilizado para acessar nossa plataforma.
              </li>
              <li>
                <strong>Informações de Redes Sociais:</strong> Se você optar por conectar suas contas de redes sociais
                para verificação de tarefas, podemos coletar informações públicas dessas contas.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">2. Como Usamos Suas Informações</h2>
            <p>Utilizamos as informações coletadas para:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Verificar sua elegibilidade para o airdrop</li>
              <li>Processar a distribuição de tokens</li>
              <li>Verificar o cumprimento de tarefas e requisitos</li>
              <li>Melhorar e otimizar nossa plataforma</li>
              <li>Prevenir fraudes e abusos</li>
              <li>Comunicar informações importantes sobre o airdrop</li>
              <li>Cumprir obrigações legais</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">3. Compartilhamento de Informações</h2>
            <p>Podemos compartilhar suas informações nas seguintes circunstâncias:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <strong>Prestadores de Serviços:</strong> Compartilhamos informações com terceiros que nos auxiliam na
                operação da plataforma, como provedores de hospedagem e serviços de análise.
              </li>
              <li>
                <strong>Requisitos Legais:</strong> Podemos divulgar suas informações quando exigido por lei, processo
                judicial ou solicitação governamental.
              </li>
              <li>
                <strong>Proteção de Direitos:</strong> Podemos compartilhar informações para proteger nossos direitos,
                privacidade, segurança ou propriedade, bem como os de nossos usuários ou do público.
              </li>
              <li>
                <strong>Transações Corporativas:</strong> Em caso de fusão, aquisição ou venda de ativos, suas
                informações podem ser transferidas como parte dos ativos comerciais.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">4. Blockchain e Privacidade</h2>
            <p>
              É importante entender que as transações em blockchain são públicas por natureza. Quando você interage com
              nosso contrato inteligente, as seguintes informações se tornam publicamente visíveis na blockchain:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Seu endereço de carteira</li>
              <li>Detalhes da transação, incluindo valores e timestamps</li>
              <li>Interações com o contrato inteligente</li>
            </ul>
            <p className="mt-2">
              Não temos controle sobre estas informações uma vez que são registradas na blockchain.
            </p>

            <h2 className="text-lg font-semibold mt-6">5. Segurança de Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso
              não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela
              internet ou armazenamento eletrônico é 100% seguro, e não podemos garantir segurança absoluta.
            </p>

            <h2 className="text-lg font-semibold mt-6">6. Seus Direitos</h2>
            <p>Dependendo da sua localização, você pode ter os seguintes direitos em relação aos seus dados:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Acessar e receber uma cópia das suas informações</li>
              <li>Retificar informações imprecisas</li>
              <li>Solicitar a exclusão de suas informações</li>
              <li>Restringir ou opor-se ao processamento de suas informações</li>
              <li>Retirar seu consentimento a qualquer momento</li>
            </ul>
            <p className="mt-2">
              Para exercer estes direitos, entre em contato conosco através dos canais oficiais listados em nossa
              plataforma.
            </p>

            <h2 className="text-lg font-semibold mt-6">7. Cookies e Tecnologias Semelhantes</h2>
            <p>
              Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, entender como nossa plataforma
              é utilizada e personalizar nosso conteúdo. Você pode configurar seu navegador para recusar todos os
              cookies ou para indicar quando um cookie está sendo enviado.
            </p>

            <h2 className="text-lg font-semibold mt-6">8. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre
              disponível em nossa plataforma, com a data da última atualização. Recomendamos que você revise esta
              política regularmente.
            </p>

            <h2 className="text-lg font-semibold mt-6">9. Contato</h2>
            <p>
              Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de dados,
              entre em contato conosco através dos canais oficiais listados em nossa plataforma.
            </p>

            <Separator className="my-6" />

            <p className="text-center">
              Ao utilizar a plataforma Street Dog Coin Airdrop, você confirma que leu, entendeu e concorda com esta
              Política de Privacidade.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/">
            <Button>Voltar para a Página Inicial</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

