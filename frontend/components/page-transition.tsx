"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useNavigation } from "@/context/navigation-context"

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const { isComingFromHomepage } = useNavigation()

  // Only animate when coming from homepage
  const variants = isComingFromHomepage
    ? {
        initial: { y: "100%" }, // Start from bottom
        animate: {
          y: 0,
          transition: {
            type: "spring",
            damping: 20,
            stiffness: 100,
          },
        },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={variants} className="w-full min-h-screen">
      {children}
    </motion.div>
  )
}
