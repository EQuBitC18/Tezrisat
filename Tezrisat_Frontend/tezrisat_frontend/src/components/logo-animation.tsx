"use client"

import { useEffect, useRef } from "react"

export function LogoAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 400

    // Load logo image
    const logo = new Image()
    logo.crossOrigin = "anonymous"
    logo.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tezrisat_Logo_Transparent-eBbmTKwKMpEqNCP1Uh8v8bv3bp1nhp.png"

    let scale = 1
    let growing = false
    let animationFrameId: number

    // Draw logo with glow effect
    const drawLogo = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update scale for breathing effect
      if (growing) {
        scale += 0.002
        if (scale >= 1.05) growing = false
      } else {
        scale -= 0.002
        if (scale <= 0.95) growing = true
      }

      // Center position
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw glow effect
      ctx.save()
      ctx.shadowColor = "rgba(20, 184, 166, 0.8)"
      ctx.shadowBlur = 20 * scale

      // Draw logo
      const logoWidth = 300 * scale
      const logoHeight = 300 * scale
      ctx.drawImage(logo, centerX - logoWidth / 2, centerY - logoHeight / 2, logoWidth, logoHeight)

      ctx.restore()

      // Request next frame
      animationFrameId = requestAnimationFrame(drawLogo)
    }

    // Start animation when image is loaded
    logo.onload = () => {
      drawLogo()
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-64 h-64 md:w-80 md:h-80" />
}

