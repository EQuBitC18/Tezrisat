"use client"

import { useEffect, useRef } from "react"

interface AnimatedBlobProps {
  className?: string
}

export function AnimatedBlob({ className = "" }: AnimatedBlobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = 300
      canvas.height = 300
    }

    setCanvasSize()

    // Blob parameters
    const points = 8
    const radius = 100
    const angleStep = (Math.PI * 2) / points
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Animation variables
    let animationFrameId: number
    let time = 0

    // Draw blob
    const drawBlob = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Start a new path
      ctx.beginPath()

      // Draw the blob
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep

        // Add some variation to the radius based on time
        const radiusVariation = Math.sin(time + i * 0.5) * 15
        const currentRadius = radius + radiusVariation

        const x = centerX + Math.cos(angle) * currentRadius
        const y = centerY + Math.sin(angle) * currentRadius

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          // Use quadratic curves for smoother blob
          const prevAngle = (i - 1) * angleStep
          const prevX = centerX + Math.cos(prevAngle) * (radius + Math.sin(time + (i - 1) * 0.5) * 15)
          const prevY = centerY + Math.sin(prevAngle) * (radius + Math.sin(time + (i - 1) * 0.5) * 15)

          const cpX = (prevX + x) / 2
          const cpY = (prevY + y) / 2

          ctx.quadraticCurveTo(prevX, prevY, cpX, cpY)
        }
      }

      // Fill the blob with a gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.5)
      gradient.addColorStop(0, "rgba(20, 184, 166, 0.4)") // teal-500 with opacity
      gradient.addColorStop(1, "rgba(13, 148, 136, 0.1)") // teal-600 with opacity

      ctx.fillStyle = gradient
      ctx.fill()

      // Update time for animation
      time += 0.01

      // Request next frame
      animationFrameId = requestAnimationFrame(drawBlob)
    }

    // Start animation
    drawBlob()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}

