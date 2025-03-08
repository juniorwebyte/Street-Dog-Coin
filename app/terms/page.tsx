"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-2 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Termos de Uso</h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Termos e Condições do Street Dog Coin Airdrop
            </CardTitle>
            <CardDescription>Última atualização: 15 de Março de 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm">
            <p>
              Bem-vindo ao Street Dog Coin Airdrop. Estes Termos de Uso regem seu acesso e uso da plataforma Street Dog
              Coin Airdrop, incluindo todos os conteúdos, funcionalidades e serviços oferecidos através do site.
            </p>

            <h2 className="text-lg font-semibold mt-6">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou utilizar nossa plataforma, você concorda em ficar vinculado a estes Termos de Uso. Se você
              não concordar com qualquer parte destes termos, não poderá acessar o site ou utilizar nossos serviços.
            </p>

            <h2 className="text-lg font-semibold mt-6">2. Elegibilidade</h2>
            <p>Para participar do airdrop Street Dog Coin, você deve:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Ter pelo menos 18 anos de idade</li>
              <li>Possuir uma carteira de criptomoedas compatível</li>
              <li>Cumprir todos os requisitos de elegibilidade específicos do airdrop</li>
              <li>Não ser residente de jurisdições onde a distribuição de tokens é proibida por lei</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">3. Distribuição de Tokens</h2>
            <p>A distribuição de tokens $SDC está sujeita às seguintes condições:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                A elegibilidade para receber tokens será determinada exclusivamente pela equipe do Street Dog Coin
              </li>
              <li>A quantidade de tokens distribuídos pode variar com base em diversos fatores</li>
              <li>Os tokens serão distribuídos de acordo com o cronograma publicado na plataforma</li>
              <li>
                A equipe do Street Dog Coin reserva-se o direito de modificar os critérios de distribuição a qualquer
                momento
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">4. Responsabilidades do Usuário</h2>
            <p>Ao utilizar nossa plataforma, você concorda em:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Fornecer informações precisas e atualizadas</li>
              <li>Manter a segurança de sua carteira e chaves privadas</li>
              <li>Não utilizar a plataforma para atividades ilegais ou fraudulentas</li>
              <li>Não tentar manipular o sistema de distribuição de tokens</li>
              <li>Não utilizar bots, scripts ou outros meios automatizados para interagir com a plataforma</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">5. Riscos e Isenção de Responsabilidade</h2>
            <p>Você reconhece e aceita que:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Criptomoedas e tokens são ativos de alto risco e volatilidade</li>
              <li>O valor dos tokens $SDC pode flutuar significativamente</li>
              <li>Não oferecemos garantias sobre o valor futuro dos tokens</li>
              <li>Você é o único responsável pela segurança de sua carteira e tokens</li>
              <li>Transações em blockchain são irreversíveis</li>
              <li>Você deve realizar sua própria pesquisa antes de participar do airdrop</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">6. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo, design, gráficos, interfaces, código e materiais apresentados na plataforma são de
              propriedade do Street Dog Coin e estão protegidos por leis de propriedade intelectual. Você não tem
              permissão para reproduzir, modificar, distribuir ou criar trabalhos derivados sem autorização expressa.
            </p>

            <h2 className="text-lg font-semibold mt-6">7. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em
              vigor imediatamente após a publicação dos termos atualizados. O uso contínuo da plataforma após tais
              alterações constitui sua aceitação dos novos termos.
            </p>

            <h2 className="text-lg font-semibold mt-6">8. Lei Aplicável</h2>
            <p>
              Estes Termos de Uso são regidos e interpretados de acordo com as leis do Brasil, sem considerar seus
              princípios de conflito de leis.
            </p>

            <h2 className="text-lg font-semibold mt-6">9. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através dos canais oficiais
              listados em nossa plataforma.
            </p>

            <Separator className="my-6" />

            <p className="text-center">
              Ao utilizar a plataforma Street Dog Coin Airdrop, você confirma que leu, entendeu e concorda com estes
              Termos de Uso.
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

