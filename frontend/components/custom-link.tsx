// 'use client'

// import type React from 'react'

// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState, CSSProperties } from 'react'
// import type { ReactNode } from 'react'

// interface CustomLinkProps {
//   href: string
//   children: ReactNode
//   className?: string
//   style?: CSSProperties
//   onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
// }

// export default function CustomLink({
//   href,
//   children,
//   className,
//   style,
//   onClick,
// }: CustomLinkProps) {
//   const router = useRouter()
//   const [isPending, setIsPending] = useState(false)

//   const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
//     if (onClick) onClick(e) // <-- call the parent onClick first

//     e.preventDefault()
//     setIsPending(true)

//     // Use the native View Transitions API if available
//     if ('startViewTransition' in document) {
//       // @ts-ignore - TypeScript doesn't know about this API yet
//       document.startViewTransition(() => {
//         router.push(href)
//       })
//     } else {
//       // Fallback for browsers that don't support View Transitions
//       router.push(href)
//     }
//   }

//   useEffect(() => {
//     return () => {
//       setIsPending(false)
//     }
//   }, [])

//   return (
//     <Link href={href} onClick={handleClick} className={className} style={style}>
//       {children}
//     </Link>
//   )
// }

'use client'
import { useTransitionRouter } from 'next-view-transitions'
import Link from 'next/link'
import { ReactNode, MouseEvent, CSSProperties } from 'react'
import { usePathname } from 'next/navigation'

interface CustomLinkProps {
  href: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties & { [key: string]: any }
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export default function CustomLink({
  href,
  children,
  className,
  style,
  onClick,
}: CustomLinkProps) {
  const router = useTransitionRouter()
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Call the parent onClick first (like closing menus)
    if (onClick) onClick(e)

    // Only use the custom animation if on the homepage
    if (pathname === '/') {
      router.push(href, {
        onTransitionReady: pageAnimation,
      })
    } else {
      router.push(href)
    }
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
