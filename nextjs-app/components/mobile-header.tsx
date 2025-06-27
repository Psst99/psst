'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import CustomLink from './custom-link'

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

// Configuration
const SECTION_CONFIG = {
  database: {
    name: 'DATABASE',
    color: 'bg-[#6600ff] text-[#D3CD7F] border-[#D3CD7F]',
    subMenus: [
      { path: '/database', name: 'Browse' },
      { path: '/database/register', name: 'Register' },
      { path: '/database/guidelines', name: 'Guidelines' },
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
      { path: '/workshops', name: 'Browse' },
      { path: '/workshops/register', name: 'Register' },
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
      { path: '/pssound-system', name: 'Calendar' },
      { path: '/pssound-system/request', name: 'Request' },
      { path: '/pssound-system/guidelines', name: 'Guidelines' },
    ],
  },
  resources: {
    name: 'RESOURCES',
    color: 'bg-[#fe93e7] text-[#1D53FF] border-[#1D53FF]',
  },
  archive: {
    name: 'ARCHIVE',
    color: 'bg-[#81520a] text-[#FFCC00] border-[#FFCC00]',
  },
} as const

const MAIN_MENU_ITEMS = [
  { path: '/database', section: 'database' as const },
  { path: '/workshops', section: 'workshops' as const },
  { path: '/events', section: 'events' as const },
  { path: '/pssound-system', section: 'pssound-system' as const },
  { path: '/resources', section: 'resources' as const },
  { path: '/archive', section: 'archive' as const },
  { path: '/psst', section: 'psst' as const },
]

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
  const pathname = usePathname()

  const getActiveSection = (): Section => {
    for (const { path, section } of MAIN_MENU_ITEMS) {
      if (pathname.startsWith(path)) return section
    }
    return 'home'
  }

  const activeSection = getActiveSection()
  const sectionConfig = SECTION_CONFIG[activeSection]
  const hasSubMenu =
    sectionConfig?.subMenus && sectionConfig.subMenus.length > 0

  const getCurrentSubsection = () => {
    if (!hasSubMenu) return null
    return sectionConfig.subMenus?.find((sub) => sub.path === pathname)
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

  return (
    <div
      className={`fixed md:hidden left-0 right-0 z-50 ${isHome ? 'bottom-0' : 'top-0'}`}
    >
      {/* Top Header */}
      <div className='flex w-full border-4 border-black'>
        <CustomLink
          href='/psst'
          className={`bg-[#DFFF3D] text-[#A20018] border-[#A20018] px-4 pt-0 flex-1 border rounded-t-lg border-b-0 text-center pb-8 text-lg w-full ${activeSection !== 'home' ? '' : ''}`}
        >
          PSST
        </CustomLink>
        <button
          onClick={toggleMenu}
          className={`bg-[#D2D2D2] text-[#1D53FF] border-[#1D53FF] px-4 pt-0 flex-1 border rounded-t-lg border-b-0 text-center -ml-[1px] text-lg z-50 pb-8 w-full  ${activeSection !== 'home' ? '' : ''}`}
        >
          {isMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* Section Header */}
      {activeSection !== 'home' &&
        activeSection !== 'psst' &&
        sectionConfig && (
          <div className='fixed top-[36px] left-0 right-0 z-50 w-full -mt-2'>
            <div className='flex w-full bg-[#dfff3d] rounded-t-lg'>
              <div
                className={`${sectionConfig.color} px-4 py-0.5 pb-1 flex-1 border border-b-0 text-center rounded-t-lg text-lg w-1/2`}
              >
                {sectionConfig.name}
              </div>
              <div className='w-1/2 border-t border-r border-[#A20018] rounded-tr-lg'></div>
            </div>

            {/* Subsection Row */}
            {hasSubMenu && currentSubsection && (
              <div className='flex w-full -mt-1.5 -mb-8'>
                <div
                  className={`flex-1 text-lg ${subMenuColors.headerBg} ${subMenuColors.headerText} px-4 py-0.5 text-center rounded-t-lg border border-b-0 ${subMenuColors.headerBorder}`}
                >
                  {currentSubsection.name.toUpperCase()}
                </div>
                <button
                  onClick={toggleSubMenu}
                  className={`${subMenuColors.buttonBg} ${subMenuColors.buttonText} ${subMenuColors.hamburgerBorder} px-4 py-1 border flex items-center justify-center w-1/2 rounded-tr-lg border-l-0 border-b-0`}
                >
                  ≡
                </button>
              </div>
            )}
          </div>
        )}

      {/* Submenu Overlay Click Handler */}
      {isSubMenuOpen && (
        <div
          className='fixed top-[36px] left-0 right-0 z-[61] w-full h-[39px] cursor-pointer'
          onClick={handleOverlayClick}
          style={{ background: 'transparent' }}
        />
      )}

      {/* Main Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key='main-menu'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              duration: 0.7,
              ease: [0.76, 0, 0.24, 1],
            }}
            className='fixed inset-0 z-50 bg-transparent pt-[28px]'
            onClick={closeMenus}
          >
            <div
              className='flex flex-col h-full'
              onClick={(e) => e.stopPropagation()}
            >
              {MAIN_MENU_ITEMS.map(({ path, section }, index) => (
                <CustomLink
                  key={section}
                  href={path}
                  className={`${SECTION_CONFIG[section].color} flex items-center justify-center text-center text-4xl flex-1 border rounded-t-3xl uppercase ${
                    index > 0 ? '-mt-5' : ''
                  }`}
                  onClick={closeMenus}
                >
                  {SECTION_CONFIG[section].name}
                </CustomLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submenu */}
      <AnimatePresence>
        {isSubMenuOpen && hasSubMenu && (
          <div
            key='submenu-overlay'
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // exit={{ opacity: 0 }}
            // transition={{ duration: 0.2 }}
            className='fixed inset-0 z-[60]'
            onClick={handleOverlayClick}
          >
            <motion.div
              key='submenu'
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                duration: 0.7,
                ease: [0.76, 0, 0.24, 1],
              }}
              className='fixed inset-0 pt-[58px] z-[70]'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex flex-col h-full'>
                {sectionConfig.subMenus?.map((subMenu, index) => (
                  <CustomLink
                    key={subMenu.path}
                    href={subMenu.path}
                    className={`${
                      pathname === subMenu.path
                        ? subMenuColors.active
                        : subMenuColors.inactive
                    } border flex items-center justify-center text-center text-4xl flex-1 rounded-t-lg uppercase ${
                      index > 0 ? '-mt-2' : ''
                    }`}
                    onClick={toggleSubMenu}
                  >
                    {subMenu.name}
                  </CustomLink>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div
        className={
          activeSection === 'home'
            ? 'h-[41px]'
            : hasSubMenu
              ? 'h-[75px]'
              : 'h-[63px]' // shorter height for sections without submenu
        }
      />
    </div>
  )
}
