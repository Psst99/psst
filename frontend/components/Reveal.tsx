'use client'

import {motion, useInView} from 'framer-motion'
import {useRef} from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  y?: number
  durationMs?: number
  delayMs?: number
  once?: boolean
}

export default function Reveal({
  children,
  className = '',
  style,
  y = 16,
  durationMs = 520,
  delayMs = 0,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once,
    margin: '0px 0px -100px 0px', // Trigger 100px before entering viewport
    amount: 0.1, // Trigger when 10% is visible (reduced from 12%)
  })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{opacity: 0, y}}
      animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y}}
      transition={{
        duration: durationMs / 1000,
        delay: delayMs / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
