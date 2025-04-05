"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl bg-white/40 backdrop-blur-sm p-6 border border-teal-200/50 hover:border-teal-100 transition-all duration-300 shadow-lg"
      whileHover={{ y: -5, boxShadow: "0 15px 30px -10px rgba(0, 64, 64, 0.3)" }}
    >
      <div className="absolute top-0 left-0 h-1 w-0 bg-gradient-to-r from-teal-900 to-teal-700 group-hover:w-full transition-all duration-700" />
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-teal-900 mb-2">{title}</h3>
      <p className="text-teal-800">{description}</p>
    </motion.div>
  )
}

