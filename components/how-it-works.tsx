import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Wallet, Gift, Clock } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Wallet,
      title: "Conecte sua carteira",
      description: "Conecte sua carteira Ethereum para verificar sua elegibilidade para o airdrop.",
    },
    {
      icon: CheckCircle,
      title: "Verifique elegibilidade",
      description: "O sistema verificará automaticamente se você atende aos critérios para receber tokens.",
    },
    {
      icon: Gift,
      title: "Reivindique tokens",
      description: "Se você for elegível, poderá reivindicar seus tokens $SDC com apenas um clique.",
    },
    {
      icon: Clock,
      title: "Aguarde confirmação",
      description: "Após a reivindicação, os tokens serão transferidos para sua carteira em breve.",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {steps.map((step, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <step.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Passo {index + 1}</CardTitle>
              <CardDescription>{step.title}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>{step.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

