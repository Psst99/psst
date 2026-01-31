'use client'

import {useState} from 'react'
import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {motion, AnimatePresence} from 'framer-motion'

import CustomLink from './CustomLink'
import SectionScope from './SectionScope'
import {getSectionConfig} from '@/lib/route-utils'
import type {SectionSlug, MainSectionSlug} from '@/lib/theme/sections'

const MAIN_MENU_ITEMS: ReadonlyArray<{path: string; section: MainSectionSlug}> = [
  {path: '/database', section: 'database'},
  {path: '/resources', section: 'resources'},
  {path: '/pssound-system', section: 'pssound-system'},
  {path: '/workshops', section: 'workshops'},
  {path: '/events', section: 'events'},
  {path: '/archive', section: 'archive'},
  {path: '/psst', section: 'psst'},
] as const

function getActiveSectionSlug(pathname: string): SectionSlug {
  for (const {path, section} of MAIN_MENU_ITEMS) {
    if (pathname.startsWith(path)) return section
  }
  return 'home'
}

type Props = {
  dynamicSubNavItems?: Array<{label: string; href: string}>
}

export default function MobileHeader({dynamicSubNavItems}: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  const pathname = usePathname()
  const activeSection: SectionSlug = getActiveSectionSlug(pathname)
  const isHome = activeSection === 'home'

  const {subNavItems} = getSectionConfig(pathname, dynamicSubNavItems)
  const hasSubMenu = Array.isArray(subNavItems) && subNavItems.length > 0

  const currentSubsection = (() => {
    if (!hasSubMenu) return null

    const exact = subNavItems?.find((sub) => sub.href === pathname)
    if (exact) return exact

    // PSST root: default to first
    if (pathname === '/psst') return subNavItems?.[0] ?? null

    // legacy special case
    if (pathname.includes('/artists/') && activeSection === 'database') {
      return subNavItems?.find((sub) => sub.href === '/database') ?? subNavItems?.[0] ?? null
    }

    return subNavItems?.[0] ?? null
  })()

  const toggleMenu = () => {
    setIsMenuOpen((v) => !v)
    setIsSubMenuOpen(false)
  }

  const toggleSubMenu = () => setIsSubMenuOpen((v) => !v)
  const handleOverlayClick = () => setIsSubMenuOpen(false)

  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsSubMenuOpen(false)
  }

  // HOME: bottom sheet
  if (isHome) {
    return (
      <div className="min-[83rem]:hidden">
        <motion.div
          className="fixed left-0 right-0 z-50 bottom-0 w-full h-svh"
          initial={{y: isMenuOpen ? 0 : 'calc(100% - 29px)'}}
          animate={{y: isMenuOpen ? 0 : 'calc(100% - 29px)'}}
          transition={{duration: 0.7, ease: [0.76, 0, 0.24, 1]}}
        >
          {/* Top Header */}
          <div className="flex w-full h-[29px] mb-0 bg-white">
            <SectionScope section="psst" variant="tab" asChild>
              <CustomLink
                href="/psst"
                className="px-4 pt-0 flex-1 border rounded-t-lg border-b-0 text-center pb-12 text-lg w-full section-bg section-fg section-border"
              >
                PSST
              </CustomLink>
            </SectionScope>

            {/* MENU button: legacy fixed colors */}
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
              {MAIN_MENU_ITEMS.filter((i) => i.section !== 'psst').map(({path, section}, idx) => (
                <SectionScope key={section} section={section} variant="tab" asChild>
                  <Link
                    href={path}
                    className={[
                      'flex items-center justify-center text-center text-4xl flex-1 border uppercase',
                      'section-bg section-fg section-border',
                      idx === 0 ? 'rounded-t-lg' : 'rounded-t-3xl',
                      idx > 0 ? '-mt-5' : '',
                    ].join(' ')}
                    onClick={closeMenus}
                  >
                    {section.replace(/-/g, ' ').toUpperCase()}
                  </Link>
                </SectionScope>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="h-[41px]" />
      </div>
    )
  }

  // NON-HOME: fixed top header
  return (
    <div className="h-[29px] bg-white fixed left-0 right-0 z-50 top-0 tracking-tighter min-[83rem]:hidden">
      {/* Top Header row */}
      <div className="flex w-full h-full mb-0">
        <SectionScope section="psst" variant="tab" asChild>
          <CustomLink
            href="/psst"
            className="px-4 pt-0 flex-1 border rounded-t-lg border-b-0 text-center pb-12 text-lg w-full section-bg section-fg section-border"
          >
            PSST
          </CustomLink>
        </SectionScope>

        {/* MENU button: legacy fixed colors */}
        <button
          onClick={toggleMenu}
          className="bg-[#D2D2D2] text-[#1D53FF] border-[#1D53FF] px-4 pt-0 flex-1 border rounded-t-lg border-b-0 text-center -ml-px text-lg z-50 pb-8 w-full"
        >
          {isMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* Special PSST bridge row (keep your structure) */}
      {activeSection === 'psst' && (
        <div className="flex w-full h-full mb-0 bg-[#D2D2D2] border-r-[#1D53FF] border-r border-l border-l-[#A20018]">
          <SectionScope section="psst" variant="tab" asChild>
            <CustomLink href="/psst" className="w-1/2 section-bg">
              &nbsp;
            </CustomLink>
          </SectionScope>

          <SectionScope section="psst" variant="tab" asChild>
            <button
              onClick={toggleMenu}
              className="flex-1 border rounded-tr-3xl border-l-0 border-b-0 text-center text-lg z-50 pb-0 w-full -mr-[1px] section-bg section-border"
            />
          </SectionScope>
        </div>
      )}

      {/* PSST subsection header row */}
      {activeSection === 'psst' && hasSubMenu && currentSubsection && (
        <SectionScope section="psst" variant="page" panelVariant="subtab" className="contents">
          <div className="fixed top-[35px] left-0 right-0 z-50 w-full overflow-visible">
            <div
              className="flex w-full relative bg-transparent border-0 -mt-1.5 overflow-visible"
              style={
                {
                  // Make the connector’s top line blend into the red background
                  '--subsection-underline-top': 'var(--panel-bg)',
                } as React.CSSProperties
              }
            >
              <div className="flex-1 text-lg px-4 py-0.5 text-center rounded-t-lg border border-b-0 relative subsection-vertical-border pb-[17px] panel-bg panel-fg panel-border">
                {currentSubsection.label.toUpperCase()}
              </div>

              <button
                onClick={toggleSubMenu}
                className="px-4 py-1 pb-2 border flex items-center justify-center w-1/2 rounded-tr-lg border-l-0 border-b-0 h-full mobile-subsection-underline mobile-subsection-underline--psst invert-panel invert-panel-border"
                aria-label="Open PSST tabs"
                style={
                  {
                    '--underline-color': 'var(--panel-bg)',
                  } as React.CSSProperties
                }
              >
                <span className="-mt-[0.12rem]">≡</span>
              </button>
            </div>
          </div>
        </SectionScope>
      )}

      {/* Section Header for non-home + non-psst pages */}
      {activeSection !== 'psst' && (
        <SectionScope section="psst" variant="page" asChild>
          <div className="fixed top-[36px] left-0 right-0 z-50 w-full -mt-2">
            <div className="flex w-full rounded-t-lg section-bg">
              {/* Left section label: uses ACTIVE SECTION page vars */}
              <SectionScope section={activeSection} variant="page" asChild>
                <div className="px-4 py-0.5 pb-1 flex-1 border border-b-0 text-center rounded-t-lg text-lg w-1/2 tab-inactive section-border">
                  {activeSection.replace(/-/g, ' ').toUpperCase()}
                </div>
              </SectionScope>

              {/* Right empty half (border connector) */}
              <SectionScope section={activeSection} variant="page" asChild>
                <div className="w-1/2 border-t border-r rounded-tr-lg section-border mobile-section-connector" />
              </SectionScope>
            </div>

            {/* Subsection Row */}
            {hasSubMenu && currentSubsection && (
              <SectionScope section={activeSection} variant="page" panelVariant="subtab" asChild>
                <div className="flex w-full -mt-1.5 -mb-8 relative bg-transparent">
                  {/* Left label: subtab colors (beige bg, purple fg) */}
                  <div className="flex-1 text-lg px-4 py-0.5 text-center rounded-t-lg border border-b-0 relative subsection-vertical-border pb-[17px] panel-bg panel-fg panel-border">
                    {currentSubsection.label.toUpperCase()}
                  </div>

                  {/* Right hamburger: inverted (purple bg, beige fg) */}
                  <button
                    onClick={toggleSubMenu}
                    className="relative px-4 py-1 pb-2 border flex items-center justify-center w-1/2 rounded-tr-lg border-l-0 border-b-0 mobile-subsection-underline h-full invert-panel invert-panel-border"
                    aria-label="Open subsection menu"
                  >
                    <span className="-mt-[0.12rem]">≡</span>
                  </button>
                </div>
              </SectionScope>
            )}
          </div>
        </SectionScope>
      )}

      {/* Submenu Overlay Click Handler */}
      {isSubMenuOpen && (
        <div
          className="fixed top-[36px] left-0 right-0 z-61 w-full h-[39px] cursor-pointer"
          onClick={handleOverlayClick}
          style={{background: 'transparent'}}
        />
      )}

      {/* Main Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="main-menu"
            initial={{y: '100%'}}
            animate={{y: 0}}
            exit={{y: '100%'}}
            transition={{duration: 0.7, ease: [0.76, 0, 0.24, 1]}}
            className="fixed inset-0 z-50 bg-transparent pt-[28px]"
            onClick={closeMenus}
          >
            <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
              {MAIN_MENU_ITEMS.filter((i) => i.section !== 'psst').map(({path, section}, idx) => (
                <SectionScope key={section} section={section} variant="tab" asChild>
                  <Link
                    href={path}
                    className={[
                      'flex items-center justify-center text-center text-4xl flex-1 border rounded-t-3xl uppercase first:rounded-t-lg',
                      'section-bg section-fg section-border',
                      idx > 0 ? '-mt-5' : '',
                    ].join(' ')}
                    onClick={closeMenus}
                  >
                    {section.replace(/-/g, ' ').toUpperCase()}
                  </Link>
                </SectionScope>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submenu Overlay */}
      <AnimatePresence>
        {isSubMenuOpen && hasSubMenu && (
          <div
            key="submenu-overlay"
            className="fixed left-0 right-0 bottom-0 top-[86px] z-60"
            onClick={handleOverlayClick}
          >
            <motion.div
              key="submenu"
              initial={{y: '100%'}}
              animate={{y: 0}}
              exit={{y: '100%'}}
              transition={{duration: 0.7, ease: [0.76, 0, 0.24, 1]}}
              className="fixed left-0 right-0 bottom-0 top-[86px] z-70"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {subNavItems?.map((subMenu, idx) => {
                  const isActive = pathname === subMenu.href
                  return (
                    <SectionScope key={subMenu.href} section={activeSection} variant="page" asChild>
                      <Link
                        href={subMenu.href}
                        className={[
                          'border flex items-center justify-center text-center text-4xl flex-1 rounded-t-lg uppercase',
                          'section-border',
                          isActive ? 'tab-active' : 'tab-inactive',
                          idx > 0 ? '-mt-2' : '',
                        ].join(' ')}
                        onClick={closeMenus}
                      >
                        {subMenu.label}
                      </Link>
                    </SectionScope>
                  )
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className={hasSubMenu ? 'h-[75px]' : 'h-[63px]'} />
    </div>
  )
}
