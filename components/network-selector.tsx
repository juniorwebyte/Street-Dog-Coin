"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SUPPORTED_NETWORKS, type NetworkType, useWeb3 } from "@/hooks/use-web3"
import { cn } from "@/lib/utils"

export function NetworkSelector() {
  const { network, switchNetwork } = useWeb3()
  const [open, setOpen] = useState(false)

  const handleNetworkSelect = async (selectedNetwork: NetworkType) => {
    await switchNetwork(selectedNetwork.chainId)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {network ? (
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${network.isTestnet ? "bg-yellow-500" : "bg-green-500"}`} />
              {network.name}
            </div>
          ) : (
            "Selecionar Rede"
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar rede..." />
          <CommandList>
            <CommandEmpty>Nenhuma rede encontrada.</CommandEmpty>
            <CommandGroup>
              {SUPPORTED_NETWORKS.map((item) => (
                <CommandItem key={item.id} value={item.name} onSelect={() => handleNetworkSelect(item)}>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${item.isTestnet ? "bg-yellow-500" : "bg-green-500"}`} />
                    {item.name}
                  </div>
                  <Check
                    className={cn("ml-auto h-4 w-4", network?.chainId === item.chainId ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

