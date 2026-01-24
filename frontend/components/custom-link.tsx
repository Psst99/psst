'use client'
import {useTransitionRouter} from 'next-view-transitions'
import Link from 'next/link'
import {ReactNode, MouseEvent, CSSProperties} from 'react'
import {usePathname} from 'next/navigation'

interface CustomLinkProps {
  href: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties & {[key: string]: any}
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function CustomLink({href, children, className, style, onClick}: CustomLinkProps) {
  const router = useTransitionRouter()
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call parent handler (closing menus etc.)
    if (onClick) onClick(e)

    // Only hijack navigation on the homepage where you want the custom transition
    if (pathname === '/') {
      e.preventDefault()
      router.push(href, {onTransitionReady: pageAnimation})
    }
    // Otherwise: DO NOT preventDefault.
    // Let Next <Link> perform a normal navigation (critical for @modal / parallel routes).
  }

  return (
    <Link href={href} onClick={handleClick} className={className} style={style}>
      {children}
    </Link>
  )
}

// Exact same animation function as the working example
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
    },
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
    },
  )
}
