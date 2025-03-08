"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

interface ConfettiCelebrationProps {
  trigger?: boolean
  duration?: number
}

export function ConfettiCelebration({ trigger = false, duration = 3000 }: ConfettiCelebrationProps) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true)

      // Configuração para uma celebração mais elaborada
      const end = Date.now() + duration

      // Função para criar confetes coloridos
      const launchConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#9333ea", "#4f46e5", "#06b6d4", "#10b981", "#f59e0b"],
          zIndex: 9999,
        })
      }

      // Lançar confetes iniciais
      launchConfetti()

      // Lançar confetes em intervalos para criar um efeito contínuo
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval)
          setIsActive(false)
          return
        }

        // Alternar entre diferentes padrões de confetes
        if (Math.random() > 0.5) {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: ["#9333ea", "#4f46e5", "#06b6d4"],
            zIndex: 9999,
          })
        } else {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: ["#10b981", "#f59e0b", "#ef4444"],
            zIndex: 9999,
          })
        }
      }, 250)

      return () => {
        clearInterval(interval)
      }
    }
  }, [trigger, duration, isActive])

  return null
}

