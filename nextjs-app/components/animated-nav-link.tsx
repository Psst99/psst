'use client'
import { useTransitionRouter } from 'next-view-transitions'
import Link from 'next/link'
import { ReactNode, MouseEvent } from 'react'

interface AnimatedNavLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function AnimatedNavLink({
  href,
  children,
  className,
  onClick,
  ...props
}: AnimatedNavLinkProps) {
  const router = useTransitionRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Call any additional onClick handler
    if (onClick) {
      onClick()
    }

    router.push(href, {
      onTransitionReady: pageAnimation,
    })
  }

  return (
    <Link href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </Link>
  )
}

// Same animation function
const pageAnimation = () => {
  document.documentElement.animate(
    [
      {
        opacity: 1,
        scale: 1,
        transform: 'translateY(0)',
      },
      {
        opacity: 0.5,
        scale: 0.9,
        transform: 'translateY(-100px)',
      },
    ],
    {
      duration: 1000,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    }
  )

  document.documentElement.animate(
    [
      {
        transform: 'translateY(100%)',
      },
      {
        transform: 'translateY(0)',
      },
    ],
    {
      duration: 1000,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    }
  )
}
