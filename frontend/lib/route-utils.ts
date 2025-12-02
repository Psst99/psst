import {sectionThemes, subNavigation, type SectionKey} from './theme'

export interface SectionConfig {
  section: SectionKey
  theme: {
    bg: string
    accent: string
    border: string
  }
  hasSubNav?: boolean
  subNavItems?: Array<{label: string; href: string}>
}

export function getSectionFromPath(pathname: string): SectionKey {
  if (pathname === '/') return 'home'
  const segment = pathname.split('/')[1]
  return (segment in sectionThemes ? segment : 'home') as SectionKey
}

export function getSectionConfig(
  pathname: string,
  dynamicSubNavItems?: Array<{label: string; href: string}>,
): SectionConfig {
  const section = getSectionFromPath(pathname)
  const theme = sectionThemes[section]

  let subNavItems: Array<{label: string; href: string}> | undefined
  let hasSubNav = false

  // FOR PSST: Always use dynamic items if provided, ignore static
  if (section === 'psst' && dynamicSubNavItems && dynamicSubNavItems.length > 0) {
    subNavItems = dynamicSubNavItems
    hasSubNav = true
  }
  // FOR OTHER SECTIONS: Use static subnav from theme.ts
  else if (section in subNavigation) {
    const staticItems = subNavigation[section as keyof typeof subNavigation]
    subNavItems = staticItems ? [...staticItems] : undefined
    hasSubNav = !!subNavItems
  }
  // NO SUBNAV
  else {
    subNavItems = undefined
    hasSubNav = false
  }

  return {
    section,
    theme,
    hasSubNav,
    subNavItems,
  }
}
