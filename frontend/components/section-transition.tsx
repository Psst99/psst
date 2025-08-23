"use client"

import type React from "react"
import { motion } from "framer-motion"

interface SectionTransitionProps {
  children: React.ReactNode
}

export default function SectionTransition({ children }: SectionTransitionProps) {
  // Simple fade transition for section-to-section
  const variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={variants} className="w-full min-h-screen">
      {children}
    </motion.div>
  )
}
