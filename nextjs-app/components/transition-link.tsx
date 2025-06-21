"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { startViewTransition } from "next-view-transitions"
import type { ReactNode } from "react"

interface TransitionLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export default function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const isTargetHomepage = href === "/"
  const isArtistLink =
    href.startsWith("/database/") &&
    href !== "/database" &&
    href !== "/database/register" &&
    href !== "/database/guidelines"

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Determine transition type
    let transitionClass = ""
    if (isHomepage && !isTargetHomepage) {
      // Going from homepage to section
      transitionClass = "home-to-section"
    } else if (!isHomepage && !isTargetHomepage && !isArtistLink) {
      // Going from section to section
      transitionClass = "section-to-section"
    }

    // Apply the transition class to the document
    if (transitionClass) {
      document.documentElement.classList.add(transitionClass)
    }

    // Start the view transition
    startViewTransition(() => {
      window.location.href = href
    })

    // Clean up the class after transition
    setTimeout(() => {
      document.documentElement.classList.remove("home-to-section", "section-to-section")
    }, 1000)
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
