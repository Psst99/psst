'use client'

import { useState } from 'react'
import CustomLink from './custom-link'
import { usePathname } from 'next/navigation'

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
  const pathname = usePathname()

  // Determine which section is active
  const getActiveSection = () => {
    if (pathname.startsWith('/database')) return 'database'
    if (pathname.startsWith('/workshops')) return 'workshops'
    if (pathname.startsWith('/events')) return 'events'
    if (pathname.startsWith('/pssound-system')) return 'pssound-system'
    if (pathname.startsWith('/resources')) return 'resources'
    if (pathname.startsWith('/archive')) return 'archive'
    return 'home'
  }

  const activeSection = getActiveSection()

  // Get section color
  const getSectionColor = () => {
    switch (activeSection) {
      case 'database':
        return 'bg-[#6600ff] text-white'
      case 'workshops':
        return 'bg-[#f50806] text-white'
      case 'events':
        return 'bg-[#00ffdd] text-black'
      case 'pssound-system':
        return 'bg-[#07f25b] text-black'
      case 'resources':
        return 'bg-[#fe93e7] text-black'
      case 'archive':
        return 'bg-[#81520a] text-white'
      default:
        return 'bg-[#dfff3d] text-black'
    }
  }

  // Get section name
  const getSectionName = () => {
    switch (activeSection) {
      case 'database':
        return 'DATABASE'
      case 'workshops':
        return 'WORKSHOPS'
      case 'events':
        return 'EVENTS'
      case 'pssound-system':
        return 'PSSOUND SYSTEM'
      case 'resources':
        return 'RESOURCES'
      case 'archive':
        return 'ARCHIVE'
      default:
        return ''
    }
  }

  // Toggle main menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsSubMenuOpen(false)
  }

  // Toggle submenu
  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen)
  }

  // Get current subsection for database
  const getDatabaseSubsection = () => {
    if (pathname === '/database') return 'BROWSE'
    if (pathname === '/database/register') return 'REGISTER'
    if (pathname === '/database/guidelines') return 'GUIDELINES'
    return 'BROWSE'
  }

  // Get current subsection for pssound-system
  const getPssoundSubsection = () => {
    if (pathname === '/pssound-system') return 'CALENDAR'
    if (pathname === '/pssound-system/request') return 'REQUEST'
    if (pathname === '/pssound-system/guidelines') return 'GUIDELINES'
    return 'CALENDAR'
  }

  return (
    <div className='md:hidden'>
      {/* Persistent top header - always visible */}
      <div className='fixed top-0 left-0 right-0 z-50 flex'>
        <CustomLink
          href='/'
          className='bg-[#DFFF3D] text-[#A20018] border-[#A20018] px-4 py-2 pt-1 flex-1 border rounded-t-lg border-b-0 text-center'
        >
          PSST
        </CustomLink>
        <button
          onClick={toggleMenu}
          className='bg-[#D2D2D2] text-[#1D53FF] border-[#1D53FF] px-4 py-2 flex-1 border rounded-t-lg border-b-0 text-center -ml-[1px]'
        >
          {isMenuOpen ? 'x' : 'MENU'}
        </button>
      </div>

      {/* Section header - only visible when menu is closed */}
      {activeSection !== 'home' && !isMenuOpen && (
        <div className='fixed top-[41px] left-0 right-0 z-40 flex'>
          <div
            className={`${getSectionColor()} px-4 py-2 flex-1 border text-center`}
          >
            {getSectionName()}
          </div>
          {(activeSection === 'database' ||
            activeSection === 'pssound-system') && (
            <button
              onClick={toggleSubMenu}
              className='bg-[#dfff3d] text-black px-4 py-2 w-12 border flex items-center justify-center'
            >
              ≡
            </button>
          )}
        </div>
      )}

      {/* Main menu overlay - covers everything except the top header */}
      {isMenuOpen && (
        <div className='fixed inset-0 z-50 bg-transparent pt-[41px] -mt-2'>
          <div className='flex flex-col h-full'>
            <CustomLink
              href='/database'
              className='bg-[#6600ff] text-[#D3CD7F] border-[#D3CD7F] flex items-center justify-center text-center text-4xl flex-1 border rounded-t-xl uppercase'
              onClick={toggleMenu}
            >
              Database
            </CustomLink>
            <CustomLink
              href='/workshops'
              className='bg-[#F50806] text-[#D2D2D2] border-[#D2D2D2] border rounded-t-xl flex items-center justify-center text-center text-4xl flex-1 -mt-2 uppercase'
              onClick={toggleMenu}
            >
              Workshops
            </CustomLink>
            <CustomLink
              href='/events'
              className='bg-[#00FFDD] text-[#4E4E4E] flex items-center justify-center text-center text-4xl flex-1 border-[#4E4E4E] border rounded-t-xl -mt-2 uppercase'
              onClick={toggleMenu}
            >
              Events
            </CustomLink>
            <CustomLink
              href='/pssound-system'
              className='bg-[#07F25B] text-[#81520A] flex items-center justify-center border-b text-center text-4xl flex-1 border-[#81520A] border rounded-t-xl -mt-2 uppercase'
              onClick={toggleMenu}
            >
              Pssound System
            </CustomLink>
            <CustomLink
              href='/resources'
              className='bg-[#FE93E7] text-[#1D53FF] flex items-center justify-center border-b text-center text-4xl flex-1 border-[#1D53FF] border rounded-t-xl -mt-2 uppercase'
              onClick={toggleMenu}
            >
              Resources
            </CustomLink>
            <CustomLink
              href='/archive'
              className='bg-[#81520A] text-[#FFCC00] flex items-center justify-center text-center text-4xl flex-1 border-[#FFCC00] border rounded-t-xl -mt-2 uppercase'
              onClick={toggleMenu}
            >
              Archive
            </CustomLink>
          </div>
        </div>
      )}

      {/* Database submenu */}
      {isSubMenuOpen && activeSection === 'database' && (
        <div className='fixed inset-0 z-30 bg-white pt-[82px]'>
          <div className='flex flex-col h-full'>
            {/* Each item takes 1/3 of the available height */}
            <CustomLink
              href='/database'
              className='bg-[#d3cd7f] text-[#6600ff] flex items-center justify-center border-b text-center text-4xl h-1/3'
              onClick={toggleSubMenu}
            >
              BROWSE
            </CustomLink>
            <CustomLink
              href='/database/register'
              className='bg-[#6600ff] text-white flex items-center justify-center border-b text-center text-4xl h-1/3'
              onClick={toggleSubMenu}
            >
              REGISTER
            </CustomLink>
            <CustomLink
              href='/database/guidelines'
              className='bg-[#6600ff] text-white flex items-center justify-center text-center text-4xl h-1/3'
              onClick={toggleSubMenu}
            >
              GUIDELINES
            </CustomLink>
          </div>
        </div>
      )}

      {/* PSSOUND SYSTEM submenu */}
      {isSubMenuOpen && activeSection === 'pssound-system' && (
        <div className='fixed inset-0 z-30 bg-white pt-[82px]'>
          <div className='flex flex-col h-full'>
            {/* Each item takes 1/3 of the available height */}
            <CustomLink
              href='/pssound-system'
              className='bg-[#07f25b] text-black flex items-center justify-center border-b text-center text-4xl h-1/3'
              onClick={toggleSubMenu}
            >
              CALENDAR
            </CustomLink>
            <CustomLink
              href='/pssound-system/request'
              className='bg-[#07f25b] text-black flex items-center justify-center border-b text-center text-4xl h-1/3'
              onClick={toggleSubMenu}
            >
              REQUEST
            </CustomLink>
            <CustomLink
              href='/pssound-system/guidelines'
              className='bg-[#07f25b] text-black flex items-center justify-center text-center text-4xl h-1/3'
              onClick={toggleSubMenu}
            >
              GUIDELINES
            </CustomLink>
          </div>
        </div>
      )}

      {/* Spacer for fixed headers */}
      <div className={activeSection === 'home' ? 'h-[41px]' : 'h-[82px]'}></div>
    </div>
  )
}
