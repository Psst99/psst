'use client'

import {useState} from 'react'
import {usePathname} from 'next/navigation'
import Link from 'next/link'
import {motion, AnimatePresence} from 'framer-motion'

import CustomLink from './CustomLink'
import SectionScope from './SectionScope'
import {getSectionConfig, type DynamicSubNavItemsBySection} from '@/lib/route-utils'
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
  dynamicSubNavItemsBySection?: DynamicSubNavItemsBySection
}

export default function MobileHeader({dynamicSubNavItemsBySection}: Props) {
  const mobileHeaderRowHeight = 30
  const mobileHeaderTopOffset = `${mobileHeaderRowHeight}px`
  const mobileHeaderStackWithSubmenu = `${mobileHeaderRowHeight * 3}px`
  const mobileHeaderStackWithoutSubmenu = `${mobileHeaderRowHeight * 2}px`
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)

  const pathname = usePathname()
  const activeSection: SectionSlug = getActiveSectionSlug(pathname)
  const isHome = activeSection === 'home'

  const {subNavItems} = getSectionConfig(pathname, dynamicSubNavItemsBySection)
  const hasSubMenu = Array.isArray(subNavItems) && subNavItems.length > 0

  const currentSubsection = (() => {
    if (!hasSubMenu) return null

    const exact = subNavItems?.find((sub) => sub.href === pathname)
    if (exact) return exact

    // PSST root: default to first
    if (pathname === '/psst') return subNavItems?.[0] ?? null

    // legacy special case
    if (pathname.includes('/artists/') && activeSection === 'database') {
      return (
        subNavItems?.find((sub) => sub.href === '/database/browse') ??
        subNavItems?.find((sub) => sub.href === '/database') ??
        subNavItems?.[0] ??
        null
      )
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
          initial={{y: isMenuOpen ? 0 : `calc(100% - ${mobileHeaderRowHeight}px)`}}
          animate={{y: isMenuOpen ? 0 : `calc(100% - ${mobileHeaderRowHeight}px)`}}
          transition={{duration: 0.7, ease: [0.76, 0, 0.24, 1]}}
        >
          {/* Top Header */}
          <div className="flex w-full mb-0 bg-transparent" style={{height: mobileHeaderRowHeight}}>
            <SectionScope section="psst" variant="tab" asChild>
              <CustomLink
                href="/psst"
                className="intercalaire-tab intercalaire-tab--first relative px-4 pt-1 flex-1 text-center pb-1 text-lg w-full section-bg section-fg z-10 h-full flex items-center justify-center border-none"
                style={
                  {
                    '--intercalaire-notch': '14px',
                    '--intercalaire-radius': '14px',
                    borderTopRightRadius: '14px',
                  } as React.CSSProperties
                }
              >
                <span>PSST</span>
                <span
                  className="intercalaire-tab-extension pointer-events-none"
                  aria-hidden="true"
                />
              </CustomLink>
            </SectionScope>

            {/* MENU button: legacy fixed colors */}
            <button
              onClick={toggleMenu}
              className="bg-[#D2D2D2] text-[#1D53FF] px-4 pt-1 flex-1 text-center text-lg pb-1 w-full z-0 relative -ml-[14px] pl-[calc(1rem+14px)] flex items-center justify-center"
              style={{borderTopRightRadius: '0', borderTopLeftRadius: '0'}}
            >
              {isMenuOpen ? 'CLOSE' : 'MENU'}
            </button>
          </div>

          {isMenuOpen && (
            <div className="flex w-full -mb-[14px] relative z-[1]" style={{height: 14}}>
              <SectionScope section="psst" variant="tab" asChild>
                <div className="w-1/2 section-bg" />
              </SectionScope>
              <div className="flex-1 bg-[#D2D2D2]" />
            </div>
          )}

          {/* Main Menu */}
          <div className="bg-transparent h-full relative z-50">
            <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
              {MAIN_MENU_ITEMS.filter((i) => i.section !== 'psst').map(({path, section}, idx) => (
                <SectionScope key={section} section={section} variant="tab" asChild>
                  <Link
                    href={path}
                    className={[
                      'flex items-center justify-center text-center text-4xl flex-1 uppercase',
                      'section-bg section-fg',
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

        <div style={{height: mobileHeaderRowHeight + 12}} />
      </div>
    )
  }

  // NON-HOME: fixed top header
  return (
    <div
      className="bg-white fixed left-0 right-0 z-50 top-0 tracking-tighter min-[83rem]:hidden"
      style={{height: mobileHeaderRowHeight}}
    >
      {/* Top Header row */}
      <div
        className="flex w-full mb-0 relative bg-transparent"
        style={{height: mobileHeaderRowHeight}}
      >
        <SectionScope section="psst" variant="tab" asChild>
          <CustomLink
            href="/psst"
            className="intercalaire-tab intercalaire-tab--first relative px-4 pt-1 flex-1 text-center pb-1 text-lg w-full section-bg section-fg z-10 h-full flex items-center justify-center border-none"
            style={
              {
                '--intercalaire-notch': '14px',
                '--intercalaire-radius': '14px',
                borderTopRightRadius: '14px',
              } as React.CSSProperties
            }
          >
            <span>PSST</span>
            <span className="intercalaire-tab-extension pointer-events-none" aria-hidden="true" />
          </CustomLink>
        </SectionScope>

        {/* MENU button: legacy fixed colors */}
        <button
          onClick={toggleMenu}
          className="bg-[#D2D2D2] text-[#1D53FF] px-4 pt-1 flex-1 text-center text-lg z-0 pb-1 w-full relative -ml-[14px] pl-[calc(1rem+14px)] flex items-center justify-center"
          style={{borderTopRightRadius: '0', borderTopLeftRadius: '0'}}
        >
          {isMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* Special PSST bridge row (keep your structure) */}
      {activeSection === 'psst' && (
        <div className="flex w-full h-full mb-0 bg-[#D2D2D2]">
          <SectionScope section="psst" variant="tab" asChild>
            <CustomLink href="/psst" className="w-1/2 section-bg">
              &nbsp;
            </CustomLink>
          </SectionScope>

          <SectionScope section="psst" variant="tab" asChild>
            <button
              onClick={toggleMenu}
              className="flex-1 rounded-tr-3xl text-center text-lg z-50 pb-0 w-full -mr-[1px] section-bg"
            />
          </SectionScope>
        </div>
      )}

      {/* PSST subsection header row */}
      {activeSection === 'psst' && hasSubMenu && currentSubsection && (
        <SectionScope section="psst" variant="page" panelVariant="subtab" className="contents">
          <div
            className="fixed left-0 right-0 z-50 w-full overflow-visible"
            style={{top: mobileHeaderTopOffset}}
          >
            <div
              className="flex w-full relative bg-transparent overflow-visible"
              style={
                {
                  // Make the connector’s top line blend into the red background
                  '--subsection-underline-top': 'var(--panel-bg)',
                } as React.CSSProperties
              }
            >
              <div
                className="intercalaire-tab intercalaire-tab--first flex-1 text-lg px-4 py-0.5 text-center relative panel-bg panel-fg border-none outline-none z-10 flex items-center justify-center"
                style={
                  {
                    '--intercalaire-notch': '14px',
                    '--intercalaire-radius': '14px',
                    '--section-bg': 'var(--panel-bg)',
                    '--section-fg': 'var(--panel-fg)',
                    borderTopRightRadius: '14px',
                    minHeight: mobileHeaderRowHeight,
                  } as React.CSSProperties
                }
              >
                {currentSubsection.label.toUpperCase()}
              </div>

              <button
                onClick={toggleSubMenu}
                className="px-4 py-1 pb-2 flex items-center justify-center w-1/2 rounded-tr-lg h-full invert-panel border-none outline-none relative z-0 -ml-[14px] pl-[calc(1rem+14px)]"
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
          <div className="fixed left-0 right-0 z-50 w-full" style={{top: mobileHeaderTopOffset}}>
            <div className="flex w-full section-bg" style={{height: mobileHeaderRowHeight}}>
              {/* Left section label: uses ACTIVE SECTION page vars */}
              <SectionScope section={activeSection} variant="page" asChild>
                <div
                  className="intercalaire-tab intercalaire-tab--first relative px-4 pt-1 flex-1 text-center pb-1 text-lg w-full section-bg section-fg z-10 h-full flex items-center justify-center border-none"
                  style={
                    {
                      '--intercalaire-notch': '14px',
                      '--intercalaire-radius': '14px',
                      borderTopRightRadius: '14px',
                    } as React.CSSProperties
                  }
                >
                  {activeSection.replace(/-/g, ' ').toUpperCase()}
                </div>
              </SectionScope>

              {/* Right half exists to receive the notch cut, matching the top row geometry */}
              <div
                aria-hidden="true"
                className="flex-1 section-bg relative z-0 -ml-[14px] pl-[calc(1rem+14px)]"
              />
            </div>

            {/* Subsection Row */}
            {hasSubMenu && currentSubsection && (
              <SectionScope section={activeSection} variant="page" panelVariant="subtab" asChild>
                <div
                  className="flex w-full relative bg-transparent"
                  style={{height: mobileHeaderRowHeight}}
                >
                  {/* Left label: subtab colors */}
                  <div
                    className="intercalaire-tab intercalaire-tab--first relative px-4 pt-0 flex-1 text-center text-lg w-full panel-bg panel-fg z-10 h-full flex items-center justify-center border-none"
                    style={
                      {
                        '--intercalaire-notch': '14px',
                        '--intercalaire-radius': '14px',
                        '--section-bg': 'var(--panel-bg)',
                        borderTopRightRadius: '14px',
                      } as React.CSSProperties
                    }
                  >
                    {currentSubsection.label.toUpperCase()}
                  </div>

                  {/* Right hamburger: inverted */}
                  <button
                    onClick={toggleSubMenu}
                    className="relative px-4 pt-0 flex-1 flex items-center justify-center h-full invert-panel border-none outline-none z-0 -ml-[14px] pl-[calc(1rem+14px)]"
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
          className="fixed left-0 right-0 z-61 w-full cursor-pointer"
          onClick={handleOverlayClick}
          style={{
            background: 'transparent',
            top: mobileHeaderTopOffset,
            height: mobileHeaderStackWithoutSubmenu,
          }}
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
            className="fixed inset-0 z-50 bg-transparent"
            style={{paddingTop: mobileHeaderTopOffset}}
            onClick={closeMenus}
          >
            <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
              {MAIN_MENU_ITEMS.filter((i) => i.section !== 'psst').map(({path, section}, idx) => (
                <SectionScope key={section} section={section} variant="tab" asChild>
                  <Link
                    href={path}
                    className={[
                      'flex items-center justify-center text-center text-4xl flex-1 rounded-t-3xl uppercase first:rounded-t-lg',
                      'section-bg section-fg',
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
            className="fixed left-0 right-0 bottom-0 z-60"
            style={{top: mobileHeaderStackWithSubmenu}}
            onClick={handleOverlayClick}
          >
            <motion.div
              key="submenu"
              initial={{y: '100%'}}
              animate={{y: 0}}
              exit={{y: '100%'}}
              transition={{duration: 0.7, ease: [0.76, 0, 0.24, 1]}}
              className="fixed left-0 right-0 bottom-0 z-70"
              style={{top: mobileHeaderStackWithSubmenu}}
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
                          'flex items-center justify-center text-center text-4xl flex-1 rounded-t-lg uppercase border-t border-[color:var(--section-fg)]',
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
      <div
        style={{
          height: hasSubMenu ? mobileHeaderStackWithSubmenu : mobileHeaderStackWithoutSubmenu,
        }}
      />
    </div>
  )
}
