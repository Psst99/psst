'use client'

import {useState} from 'react'
import {usePathname} from 'next/navigation'
import {motion, AnimatePresence} from 'framer-motion'
import CustomLink from './custom-link'
import Link from 'next/link'
import {getSectionConfig} from '@/lib/route-utils'

// Types
type Section =
  | 'home'
  | 'psst'
  | 'database'
  | 'workshops'
  | 'events'
  | 'pssound-system'
  | 'resources'
  | 'archive'

type ConfigurableSection = Exclude<Section, 'home'>

// Configuration
const SECTION_CONFIG: Record<
  ConfigurableSection,
  {
    name: string
    color: string
    subMenus?: {path: string; name: string}[]
  }
> = {
  database: {
    name: 'DATABASE',
    color: 'bg-[#6600ff] text-[#D3CD7F] border-[#D3CD7F]',
    subMenus: [
      {path: '/database/browse', name: 'Browse'},
      {path: '/database/register', name: 'Register'},
      {path: '/database', name: 'Guidelines'},
    ],
  },

  psst: {
    name: 'PSST',
    color: 'bg-[#DFFF3D] text-[#A20018] border-[#A20018]',
  },

  workshops: {
    name: 'WORKSHOPS',
    color: 'bg-[#f50806] text-[#D2D2D2] border-[#D2D2D2]',
    subMenus: [
      {path: '/workshops', name: 'Browse'},
      {path: '/workshops/register', name: 'Register'},
    ],
  },
  events: {
    name: 'EVENTS',
    color: 'bg-[#00ffdd] text-[#4E4E4E] border-[#4E4E4E]',
  },
  'pssound-system': {
    name: 'PSSOUND SYSTEM',
    color: 'bg-[#07f25b] text-[#81520A] border-[#81520A]',
    subMenus: [
      {path: '/pssound-system', name: 'About'},
      {path: '/pssound-system/manifesto', name: 'Manifesto'},
      {path: '/pssound-system/request', name: 'Request'},
      // { path: '/pssound-system/membership', name: 'Membership' },
      {path: '/pssound-system/archive', name: 'Archive'},
    ],
  },
  resources: {
    name: 'RESOURCES',
    color: 'bg-[#fe93e7] text-[#1D53FF] border-[#1D53FF]',
    subMenus: [
      {path: '/resources', name: 'Guidelines'},
      {path: '/resources/browse', name: 'Browse'},
      {path: '/resources/submit', name: 'Submit'},
    ],
  },
  archive: {
    name: 'ARCHIVE',
    color: 'bg-[#81520a] text-[#FFCC00] border-[#FFCC00]',
  },
}

const MAIN_MENU_ITEMS = [
  {path: '/database', section: 'database' as const},
  {path: '/workshops', section: 'workshops' as const},
  {path: '/events', section: 'events' as const},
  {path: '/pssound-system', section: 'pssound-system' as const},
  {path: '/resources', section: 'resources' as const},
  {path: '/archive', section: 'archive' as const},
  {path: '/psst', section: 'psst' as const},
]

type Props = {
  dynamicSubNavItems?: Array<{label: string; href: string}>
}

export default function MobileHeader({dynamicSubNavItems}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
  const pathname = usePathname()

  const getActiveSection = (): Section => {
    for (const {path, section} of MAIN_MENU_ITEMS) {
      if (pathname.startsWith(path)) return section
    }
    return 'home'
  }

  const activeSection: Section = getActiveSection()
  const sectionConfig = activeSection !== 'home' ? SECTION_CONFIG[activeSection] : null

  const {subNavItems} = getSectionConfig(pathname, dynamicSubNavItems)
  const hasSubMenu = Array.isArray(subNavItems) && subNavItems.length > 0

  const getCurrentSubsection = () => {
    if (!hasSubMenu) return null
    // exact match
    const exact = subNavItems?.find((sub) => sub.href === pathname)
    if (exact) return exact

    // PSST: when on /psst (root), default to first tab
    if (pathname === '/psst') {
      return subNavItems?.[0] ?? null
    }

    // existing special case
    if (pathname.includes('/artists/') && activeSection === 'database') {
      return subNavItems?.find((sub) => sub.href === '/database/browse') ?? null
    }

    // fallback: first item for any section with tabs
    return subNavItems?.[0] ?? null
  }

  const currentSubsection = getCurrentSubsection()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsSubMenuOpen(false)
  }

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen)
  }

  const handleOverlayClick = () => {
    setIsSubMenuOpen(false)
  }

  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsSubMenuOpen(false)
  }

  const getSubMenuColors = (section: Section) => {
    switch (section) {
      case 'psst':
        return {
          active: 'bg-[#A20018] text-[#DFFF3D] border-[#DFFF3D]',
          inactive: 'bg-[#DFFF3D] text-[#A20018] border-[#A20018]',
          headerBg: 'bg-[#DFFF3D]',
          headerText: 'text-[#A20018]',
          headerBorder: 'border-[#A20018]',
          hamburgerBorder: 'border-[#A20018]',
          buttonBg: 'bg-[#A20018]',
          buttonText: 'text-[#DFFF3D]',
        }

      case 'database':
        return {
          active: 'bg-[#d3cd7f] text-[#6600ff] border-[#6600ff]', // Border matches text
          inactive: 'bg-[#6600ff] text-[#d3cd7f] border-[#d3cd7f]', // Border matches text
          headerBg: 'bg-[#D3CD7F]',
          headerText: 'text-[#6600ff]',
          headerBorder: 'border-[#6600ff]',
          hamburgerBorder: 'border-[#D3CD7F]',
          buttonBg: 'bg-[#6600ff]',
          buttonText: 'text-[#D3CD7F]',
        }
      case 'workshops':
        return {
          active: 'bg-[#D2D2D2] text-[#f50806] border-[#f50806]', // Border matches text
          inactive: 'bg-[#f50806] text-[#D2D2D2] border-[#D2D2D2]', // Border matches text
          headerBg: 'bg-[#D2D2D2]',
          headerText: 'text-[#f50806]',
          headerBorder: 'border-[#f50806]',
          hamburgerBorder: 'border-[#D2D2D2]',
          buttonBg: 'bg-[#f50806]',
          buttonText: 'text-[#D2D2D2]',
        }
      case 'resources':
        return {
          active: 'bg-[#1D53FF] text-[#fe93e7] border-[#fe93e7]', // Border matches text
          inactive: 'bg-[#fe93e7] text-[#1D53FF] border-[#1D53FF]', // Border matches text
          headerBg: 'bg-[#1D53FF]',
          headerText: 'text-[#fe93e7]',
          headerBorder: 'border-[#fe93e7]',
          hamburgerBorder: 'border-[#1D53FF]',
          buttonBg: 'bg-[#fe93e7]',
          buttonText: 'text-[#1D53FF]',
        }
      case 'pssound-system':
        return {
          active: 'bg-[#81520A] text-[#07f25b] border-[#07f25b]', // Border matches text
          inactive: 'bg-[#07f25b] text-[#81520A] border-[#81520A]', // Border matches text
          headerBg: 'bg-[#81520A]',
          headerText: 'text-[#07f25b]',
          headerBorder: 'border-[#07f25b]',
          hamburgerBorder: 'border-[#81520A]',
          buttonBg: 'bg-[#07f25b]',
          buttonText: 'text-[#81520A]',
        }
      default:
        return {
          active: 'bg-white text-black border-black',
          inactive: 'bg-black text-white border-white',
          headerBg: 'bg-white',
          headerText: 'text-black',
          headerBorder: 'border-black',
          buttonBg: 'bg-black',
          buttonText: 'text-white',
        }
    }
  }

  const subMenuColors = getSubMenuColors(activeSection)

  const isHome = activeSection === 'home'

  // Home page implementation with unified animation
  if (isHome) {
    return (
      <div className="min-[83rem]:hidden">
        <motion.div
          className="fixed left-0 right-0 z-50 bottom-0 w-full h-svh"
          initial={{y: isMenuOpen ? 0 : 'calc(100% - 29px)'}}
          animate={{y: isMenuOpen ? 0 : 'calc(100% - 29px)'}}
          transition={{
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          {/* Top Header */}
          <div className="flex w-full h-[29px] mb-0 bg-white">
            <CustomLink
              href="/psst"
              className="bg-[#DFFF3D] text-[#A20018] border-[#A20018] px-4 pt-0 flex-1 border rounded-t-lg border-b-0 text-center pb-12 text-lg w-full"
            >
              PSST
            </CustomLink>
            <button
              onClick={toggleMenu}
              className="bg-[#D2D2D2] text-[#1D53FF] border-[#1D53FF] px-4 pt-0 flex-1 border rounded-t-lg border-b-0 text-center -ml-px text-lg pb-16 w-full z-0"
            >
              {isMenuOpen ? 'CLOSE' : 'MENU'}
            </button>
          </div>

          {/* Main Menu */}
          <div className="bg-transparent h-full relative z-50">
            <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
              {MAIN_MENU_ITEMS.filter((item) => item.section !== 'psst').map(
                ({path, section}, index) => (
                  <Link
                    key={section}
                    href={path}
                    className={`${SECTION_CONFIG[section].color} flex items-center justify-center text-center text-4xl flex-1 border rounded-t-3xl uppercase first:rounded-t-lg ${
                      index > 0 ? '-mt-5' : ''
                    }`}
                    onClick={closeMenus}
                  >
                    {SECTION_CONFIG[section].name}
                  </Link>
                ),
              )}
            </div>
          </div>
        </motion.div>

        {/* Spacer for bottom */}
        <div className="h-[41px]" />
      </div>
    )
  }

  // Regular implementation for non-home pages
  return (
    <div
      className={`h-[29px] bg-white fixed left-0 right-0 z-50 ${isHome ? 'bottom-0' : 'top-0 tracking-tighter'}`}
    >
      {/* Top Header */}
      <div className="flex w-full h-full mb-0">
        <CustomLink
          href="/psst"
          className={`bg-[#DFFF3D] text-[#A20018] border-[#A20018] px-4 pt-0 flex-1 border rounded-t-lg border-b-0 text-center pb-12 text-lg w-full`}
        >
          PSST
        </CustomLink>
        <button
          onClick={toggleMenu}
          className={`bg-[#D2D2D2] text-[#1D53FF] border-[#1D53FF] px-4 pt-0 flex-1 border rounded-t-lg border-b-0 text-center -ml-px text-lg z-50 pb-8 w-full`}
        >
          {isMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>
      {activeSection === 'psst' && (
        <div className="flex w-full h-full mb-0 bg-[#D2D2D2] border-r-[#1D53FF] border-r border-l border-l-[#A20018]">
          <CustomLink href="/psst" className="w-1/2 bg-[#DFFF3D]">
            &nbsp;
          </CustomLink>
          <button
            onClick={toggleMenu}
            className="border-[#A20018] bg-[#DFFF3D] flex-1 border rounded-t-0 rounded-tr-3xl border-l-0 border-b-0 text-center  text-lg z-50 pb-0 w-full -mr-[1px]"
          ></button>
        </div>
      )}

      {activeSection === 'psst' && hasSubMenu && currentSubsection && (
        <div
          className="fixed top-[35px] left-0 right-0 z-50 w-full"
          style={
            {
              '--subsection-bg': subMenuColors.headerBg.match(/bg-\[([^\]]+)\]/)?.[1] || '#DFFF3D',
              '--subsection-border':
                subMenuColors.headerBorder.match(/border-\[([^\]]+)\]/)?.[1] || '#A20018',
            } as React.CSSProperties
          }
        >
          <div className="flex w-full relative bg-transparent border-0 -mt-1.5">
            <div
              className={`flex-1 text-lg ${subMenuColors.headerBg} ${subMenuColors.headerText} px-4 py-0.5 text-center rounded-t-lg border border-b-0 relative subsection-vertical-border pb-[17px] ${subMenuColors.headerBorder}`}
            >
              {currentSubsection.label.toUpperCase()}
            </div>
            <button
              onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
              className={`${subMenuColors.buttonBg} ${subMenuColors.buttonText} ${subMenuColors.hamburgerBorder} px-4 py-1 pb-2 border flex items-center justify-center w-1/2 rounded-tr-lg border-l-0 border-b-0 mobile-subsection-underline h-full`}
              aria-label="Open PSST tabs"
            >
              <span className="-mt-[0.12rem]">≡</span>
            </button>
          </div>
        </div>
      )}

      {/* Section Header */}
      {(activeSection as Section) !== 'home' && activeSection !== 'psst' && sectionConfig && (
        <div
          className="fixed top-[36px] left-0 right-0 z-50 w-full -mt-2"
          style={
            {
              '--section-bg': sectionConfig.color.match(/bg-\[([^\]]+)\]/)?.[1] || '#00ffdd',
              '--section-border':
                sectionConfig.color.match(/border-\[([^\]]+)\]/)?.[1] || '#4e4e4e',
            } as React.CSSProperties
          }
        >
          <div className="flex w-full bg-[#dfff3d] rounded-t-lg">
            <div
              className={`${sectionConfig.color} px-4 py-0.5 pb-1 flex-1 border border-b-0 text-center rounded-t-lg text-lg w-1/2`}
            >
              {sectionConfig.name}
            </div>
            <div
              className={`w-1/2 border-t border-r border-[#A20018] rounded-tr-lg ${!hasSubMenu ? 'mobile-section-underline' : ''}`}
            ></div>
          </div>

          {/* Subsection Row */}
          {hasSubMenu && currentSubsection && (
            <div
              className="flex w-full -mt-1.5 -mb-8 relative bg-transparent"
              style={
                {
                  '--subsection-bg':
                    subMenuColors.headerBg.match(/bg-\[([^\]]+)\]/)?.[1] || '#ffffff',
                  '--subsection-border':
                    subMenuColors.headerBorder.match(/border-\[([^\]]+)\]/)?.[1] || '#000000',
                } as React.CSSProperties
              }
            >
              <div
                className={`flex-1 text-lg ${subMenuColors.headerBg} ${subMenuColors.headerText} px-4 py-0.5 text-center rounded-t-lg border border-b-0 relative subsection-vertical-border pb-[17px] ${subMenuColors.headerBorder}`}
              >
                {currentSubsection.label.toUpperCase()}
              </div>
              <button
                onClick={toggleSubMenu}
                className={`${subMenuColors.buttonBg} ${subMenuColors.buttonText} ${subMenuColors.hamburgerBorder} px-4 py-1 pb-2 border flex items-center justify-center w-1/2 rounded-tr-lg border-l-0 border-b-0 mobile-subsection-underline h-full`}
              >
                <span className="-mt-[0.12rem]">≡</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Submenu Overlay Click Handler */}
      {isSubMenuOpen && (
        <div
          className="fixed top-[36px] left-0 right-0 z-61 w-full h-[39px] cursor-pointer"
          onClick={handleOverlayClick}
          style={{background: 'transparent'}}
        />
      )}

      {/* Main Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="main-menu"
            initial={{y: '100%'}}
            animate={{y: 0}}
            exit={{y: '100%'}}
            transition={{
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-50 bg-transparent pt-[28px]"
            onClick={closeMenus}
          >
            <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
              {MAIN_MENU_ITEMS.filter((item) => item.section !== 'psst').map(
                ({path, section}, index) => (
                  <Link
                    key={section}
                    href={path}
                    className={`${SECTION_CONFIG[section].color} flex items-center justify-center text-center text-4xl flex-1 border rounded-t-3xl uppercase first:rounded-t-lg ${
                      index > 0 ? '-mt-5' : ''
                    }`}
                    onClick={closeMenus}
                  >
                    {SECTION_CONFIG[section].name}
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submenu */}
      <AnimatePresence>
        {isSubMenuOpen && hasSubMenu && (
          <div key="submenu-overlay" className="fixed inset-0 z-60" onClick={handleOverlayClick}>
            <motion.div
              key="submenu"
              initial={{y: '100%'}}
              animate={{y: 0}}
              exit={{y: '100%'}}
              transition={{
                duration: 0.7,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="fixed inset-0 pt-[56px] z-70"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {subNavItems?.map((subMenu, index) => (
                  <Link
                    key={subMenu.href}
                    href={subMenu.href}
                    className={`${pathname === subMenu.href ? subMenuColors.active : subMenuColors.inactive} border flex items-center justify-center text-center text-4xl flex-1 rounded-t-lg uppercase ${index > 0 ? '-mt-2' : ''}`}
                    onClick={closeMenus}
                  >
                    {subMenu.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div
        className={
          (activeSection as Section) === 'home' ? 'h-[41px]' : hasSubMenu ? 'h-[75px]' : 'h-[63px]' // shorter height for sections without submenu
        }
      />
    </div>
  )
}
