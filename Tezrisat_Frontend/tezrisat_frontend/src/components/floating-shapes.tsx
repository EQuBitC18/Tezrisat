"use client"

import { useEffect, useRef } from "react"

interface FloatingShapesProps {
  className?: string
}

export function FloatingShapes({ className = "" }: FloatingShapesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match parent
    const setCanvasSize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
      }
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Shape types
    type ShapeType = "circle" | "triangle" | "square"

    // Shape class
    class Shape {
      x: number
      y: number
      size: number
      type: ShapeType
      color: string
      speed: number
      angle: number
      rotation: number
      rotationSpeed: number

      constructor(x: number, y: number, size: number, type: ShapeType, color: string, speed: number, angle: number) {
        this.x = x
        this.y = y
        this.size = size
        this.type = type
        this.color = color
        this.speed = speed
        this.angle = angle
        this.rotation = 0
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
      }

      draw() {
        ctx!.save()
        ctx!.translate(this.x, this.y)
        ctx!.rotate(this.rotation)
        ctx!.fillStyle = this.color

        switch (this.type) {
          case "circle":
            ctx!.beginPath()
            ctx!.arc(0, 0, this.size / 2, 0, Math.PI * 2)
            ctx!.fill()
            break

          case "triangle":
            ctx!.beginPath()
            ctx!.moveTo(0, -this.size / 2)
            ctx!.lineTo(-this.size / 2, this.size / 2)
            ctx!.lineTo(this.size / 2, this.size / 2)
            ctx!.closePath()
            ctx!.fill()
            break

          case "square":
            ctx!.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
            break
        }

        ctx!.restore()
      }

      update() {
        // Move shape
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed

        // Rotate shape
        this.rotation += this.rotationSpeed

        // Bounce off edges
        if (this.x < -this.size) this.x = canvas!.width + this.size
        if (this.x > canvas!.width + this.size) this.x = -this.size
        if (this.y < -this.size) this.y = canvas!.height + this.size
        if (this.y > canvas!.height + this.size) this.y = -this.size

        this.draw()
      }
    }

    // Create shapes
    const shapes: Shape[] = []
    const shapeCount = Math.min(15, Math.floor((canvas.width * canvas.height) / 40000))

    const shapeTypes: ShapeType[] = ["circle", "triangle", "square"]
    const colors = [
      "rgba(20, 184, 166, 0.2)", // teal-500
      "rgba(13, 148, 136, 0.15)", // teal-600
      "rgba(45, 212, 191, 0.2)", // teal-400
      "rgba(94, 234, 212, 0.15)", // teal-300
    ]

    for (let i = 0; i < shapeCount; i++) {
      const size = Math.random() * 30 + 20
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const speed = Math.random() * 0.3 + 0.1
      const angle = Math.random() * Math.PI * 2

      shapes.push(new Shape(x, y, size, type, color, speed, angle))
    }

    // Animation loop
    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      shapes.forEach((shape) => {
        shape.update()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", setCanvasSize)
    }
  }, [])

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} />
}

