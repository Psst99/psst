'use client'

import type React from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, CSSProperties } from 'react'
import type { ReactNode } from 'react'

interface CustomLinkProps {
  href: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export default function CustomLink({
  href,
  children,
  className,
  style,
}: CustomLinkProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsPending(true)

    // Use the native View Transitions API if available
    if ('startViewTransition' in document) {
      // @ts-ignore - TypeScript doesn't know about this API yet
      document.startViewTransition(() => {
        router.push(href)
      })
    } else {
      // Fallback for browsers that don't support View Transitions
      router.push(href)
    }
  }

  useEffect(() => {
    return () => {
      setIsPending(false)
    }
  }, [])

  return (
    <Link href={href} onClick={handleClick} className={className} style={style}>
      {children}
    </Link>
  )
}
