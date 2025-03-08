"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface AddressDisplayProps {
  address: string | null
  className?: string
  showToggle?: boolean
}

export function AddressDisplay({ address, className = "", showToggle = true }: AddressDisplayProps) {
  const [showAddress, setShowAddress] = useState(true)

  if (!address) return null

  const toggleAddressVisibility = () => {
    setShowAddress(!showAddress)
  }

  const formatAddress = () => {
    if (showAddress) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    } else {
      return "••••••...••••"
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-mono">{formatAddress()}</span>
      {showToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={toggleAddressVisibility}
          title={showAddress ? "Esconder endereço" : "Mostrar endereço"}
        >
          {showAddress ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </Button>
      )}
    </div>
  )
}

