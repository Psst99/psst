"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function AnimatedNavigation() {
  const pathname = usePathname()
  const isHomepage = pathname === "/"
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevPath, setPrevPath] = useState("/")

  // Track route changes for animation
  useEffect(() => {
    setPrevPath(pathname)
  }, [pathname])

  // Determine which section is active
  const getActiveSection = () => {
    if (pathname.startsWith("/database")) return "database"
    if (pathname.startsWith("/workshops")) return "workshops"
    if (pathname.startsWith("/events")) return "events"
    if (pathname.startsWith("/pssound-system")) return "pssound-system"
    if (pathname.startsWith("/resources")) return "resources"
    if (pathname.startsWith("/archive")) return "archive"
    return "home"
  }

  const activeSection = getActiveSection()

  // Determine if we should show the subnav
  const showSubNav = pathname.startsWith("/database") && !isHomepage

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isHomepage ? "home-nav" : "section-nav"}
        initial={{
          y: isHomepage ? 0 : "100%",
          position: "fixed",
          bottom: isHomepage ? 0 : "auto",
          top: isHomepage ? "auto" : 0,
          width: "100%",
          zIndex: 50,
        }}
        animate={{
          y: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.5,
          },
        }}
        exit={{
          y: isHomepage ? "100%" : "-100%",
          transition: { duration: 0.3 },
        }}
        className="w-full"
      >
        {/* Main Navigation */}
        <div className="flex w-full">
          <Link
            href="/"
            className={`bg-[#dfff3d] text-black px-4 py-1 flex-1 font-bold border border-black text-center ${activeSection === "home" ? "ring-2 ring-black" : ""}`}
            onClick={() => setIsAnimating(true)}
          >
            PSST
          </Link>
          <Link
            href="/database"
            className={`bg-[#6600ff] text-white px-4 py-1 flex-1 font-bold border border-black text-center ${activeSection === "database" ? "ring-2 ring-black" : ""}`}
            onClick={() => setIsAnimating(true)}
          >
            DATABASE
          </Link>
          <Link
            href="/workshops"
            className={`bg-[#f50806] text-white px-4 py-1 flex-1 font-bold border border-black text-center ${activeSection === "workshops" ? "ring-2 ring-black" : ""}`}
            onClick={() => setIsAnimating(true)}
          >
            WORKSHOPS
          </Link>
          <Link
            href="/events"
            className={`bg-[#00ffdd] text-black px-4 py-1 flex-1 font-bold border border-black text-center ${activeSection === "events" ? "ring-2 ring-black" : ""}`}
            onClick={() => setIsAnimating(true)}
          >
            EVENTS
          </Link>
          <Link
            href="/pssound-system"
            className={`bg-[#07f25b] text-black px-4 py-1 flex-1 font-bold border border-black text-center ${activeSection === "pssound-system" ? "ring-2 ring-black" : ""}`}
            onClick={() => setIsAnimating(true)}
          >
            PSSOUND SYSTEM
          </Link>
          <Link
            href="/resources"
            className={`bg-[#fe93e7] text-black px-4 py-1 flex-1 font-bold border border-black text-center ${activeSection === "resources" ? "ring-2 ring-black" : ""}`}
            onClick={() => setIsAnimating(true)}
          >
            RESOURCES
          </Link>
          <Link
            href="/archive"
            className={`bg-[#81520a] text-white px-4 py-1 flex-1 font-bold border border-black text-center ${activeSection === "archive" ? "ring-2 ring-black" : ""}`}
            onClick={() => setIsAnimating(true)}
          >
            ARCHIVE
          </Link>
        </div>

        {/* Sub Navigation - Only shown on database page when not on homepage */}
        {showSubNav && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex border-b border-black"
          >
            <Link
              href="/database"
              className="bg-[#dfff3d] text-black px-4 py-1 flex-1 font-bold border-r border-black text-center"
            >
              BROWSE
            </Link>
            <Link
              href="/database/register"
              className="bg-[#6600ff] text-white px-4 py-1 flex-1 font-bold border-r border-black text-center"
            >
              REGISTER
            </Link>
            <Link
              href="/database/guidelines"
              className="bg-[#6600ff] text-white px-4 py-1 flex-1 font-bold text-center"
            >
              GUIDELINES
            </Link>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
