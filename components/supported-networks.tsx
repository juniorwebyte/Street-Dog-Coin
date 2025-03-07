import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SUPPORTED_NETWORKS } from "@/hooks/use-web3"

export function SupportedNetworks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redes Suportadas</CardTitle>
        <CardDescription>O airdrop Street Dog Coin está disponível nas seguintes redes blockchain:</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUPPORTED_NETWORKS.map((network) => (
            <div key={network.id} className="flex items-center p-3 border rounded-md">
              <div className={`w-3 h-3 rounded-full mr-3 ${network.isTestnet ? "bg-yellow-500" : "bg-green-500"}`} />
              <div>
                <div className="font-medium">{network.name}</div>
                <div className="text-xs text-muted-foreground">{network.isTestnet ? "Testnet" : "Mainnet"}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

