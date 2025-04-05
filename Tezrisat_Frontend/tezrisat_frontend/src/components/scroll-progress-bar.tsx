"use client"

import { motion, type MotionValue } from "framer-motion"

interface ScrollProgressBarProps {
  scrollYProgress: MotionValue<number>
}

export function ScrollProgressBar({ scrollYProgress }: ScrollProgressBarProps) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-teal-500 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

