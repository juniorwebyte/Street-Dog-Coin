"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface HashtagCopyButtonProps {
  hashtags: string
}

export function HashtagCopyButton({ hashtags }: HashtagCopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(hashtags)
    setCopied(true)

    toast({
      title: "Hashtags copiadas!",
      description: "As hashtags foram copiadas para a área de transferência.",
    })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copiado!
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copiar Hashtags
        </>
      )}
    </Button>
  )
}

