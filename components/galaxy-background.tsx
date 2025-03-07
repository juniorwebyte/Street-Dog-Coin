"use client"

import type React from "react"
import { useEffect, useRef } from "react"

const GalaxyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: Star[] = []
    const nebulae: Nebula[] = []
    const constellations: Constellation[] = []
    const planets: Planet[] = []
    const blackHoles: BlackHole[] = []
    const vortexes: Vortex[] = []

    // Create stars
    for (let i = 0; i < 200; i++) {
      stars.push(new Star(canvas))
    }

    // Create nebulae
    for (let i = 0; i < 3; i++) {
      nebulae.push(new Nebula(canvas))
    }

    // Create constellations
    for (let i = 0; i < 2; i++) {
      constellations.push(new Constellation(canvas))
    }

    // Create planets
    for (let i = 0; i < 3; i++) {
      planets.push(new Planet(canvas))
    }

    // Create black holes
    for (let i = 0; i < 1; i++) {
      blackHoles.push(new BlackHole(canvas))
    }

    // Create vortexes
    for (let i = 0; i < 2; i++) {
      vortexes.push(new Vortex(canvas))
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nebulae.forEach((nebula) => nebula.draw(ctx))
      stars.forEach((star) => star.draw(ctx))
      constellations.forEach((constellation) => constellation.draw(ctx))
      planets.forEach((planet) => planet.draw(ctx))
      blackHoles.forEach((blackHole) => blackHole.draw(ctx))
      vortexes.forEach((vortex) => vortex.draw(ctx))

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />
}

class Star {
  x: number
  y: number
  size: number
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 2
    this.canvas = canvas
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

class Nebula {
  x: number
  y: number
  size: number
  color: string
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 200 + 100
    this.color = `hsl(${Math.random() * 60 + 240}, 70%, 50%)`
    this.canvas = canvas
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.globalAlpha = 0.1
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

class Constellation {
  stars: { x: number; y: number }[]
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.stars = []
    for (let i = 0; i < 5; i++) {
      this.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      })
    }
    this.canvas = canvas
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.beginPath()
    ctx.moveTo(this.stars[0].x, this.stars[0].y)
    for (let i = 1; i < this.stars.length; i++) {
      ctx.lineTo(this.stars[i].x, this.stars[i].y)
    }
    ctx.closePath()
    ctx.stroke()

    ctx.fillStyle = "white"
    this.stars.forEach((star) => {
      ctx.beginPath()
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
      ctx.fill()
    })
  }
}

class Planet {
  x: number
  y: number
  size: number
  color: string
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 20 + 10
    this.color = `hsl(${Math.random() * 360}, 70%, 50%)`
    this.canvas = canvas
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()

    // Add a shadow to create a 3D effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    ctx.beginPath()
    ctx.arc(this.x - this.size / 4, this.y - this.size / 4, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

class BlackHole {
  x: number
  y: number
  size: number
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 30 + 20
    this.canvas = canvas
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)")
    gradient.addColorStop(0.8, "rgba(50, 0, 50, 0.5)")
    gradient.addColorStop(1, "rgba(100, 0, 100, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

class Vortex {
  x: number
  y: number
  size: number
  rotation: number
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 100 + 50
    this.rotation = 0
    this.canvas = canvas
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size)
    gradient.addColorStop(0, "rgba(255, 0, 255, 0.5)")
    gradient.addColorStop(1, "rgba(0, 0, 255, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(0, 0)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const x = Math.cos(angle) * this.size
      const y = Math.sin(angle) * this.size
      ctx.lineTo(x, y)
      ctx.lineTo(0, 0)
    }
    ctx.fill()

    ctx.restore()

    this.rotation += 0.01
  }
}

export default GalaxyBackground

