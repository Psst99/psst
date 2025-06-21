"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationProps {
  position: "top" | "bottom"
  showSubNav?: boolean
}

export default function Navigation({ position, showSubNav = false }: NavigationProps) {
  const pathname = usePathname()

  return (
    <div className={`w-full ${position === "top" ? "mb-4" : "mt-4"}`}>
      {/* Main Navigation */}
      <div className="flex w-full">
        <Link href="/" className="bg-[#dfff3d] text-black px-4 py-1 flex-1 font-bold border border-black text-center">
          PSST
        </Link>
        <Link
          href="/database"
          className="bg-[#6600ff] text-white px-4 py-1 flex-1 font-bold border border-black text-center"
        >
          DATABASE
        </Link>
        <Link
          href="/workshops"
          className="bg-[#f50806] text-white px-4 py-1 flex-1 font-bold border border-black text-center"
        >
          WORKSHOPS
        </Link>
        <Link
          href="/events"
          className="bg-[#00ffdd] text-black px-4 py-1 flex-1 font-bold border border-black text-center"
        >
          EVENTS
        </Link>
        <Link
          href="/pssound-system"
          className="bg-[#07f25b] text-black px-4 py-1 flex-1 font-bold border border-black text-center"
        >
          PSSOUND SYSTEM
        </Link>
        <Link
          href="/resources"
          className="bg-[#fe93e7] text-black px-4 py-1 flex-1 font-bold border border-black text-center"
        >
          RESOURCES
        </Link>
        <Link
          href="/archive"
          className="bg-[#81520a] text-white px-4 py-1 flex-1 font-bold border border-black text-center"
        >
          ARCHIVE
        </Link>
      </div>

      {/* Sub Navigation - Only shown on database page when position is top */}
      {showSubNav && pathname === "/database" && (
        <div className="flex border-b border-black">
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
          <Link href="/database/guidelines" className="bg-[#6600ff] text-white px-4 py-1 flex-1 font-bold text-center">
            GUIDELINES
          </Link>
        </div>
      )}
    </div>
  )
}
