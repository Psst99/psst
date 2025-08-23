import { sectionThemes, subNavigation, type SectionKey } from './theme'

export function getSectionFromPath(pathname: string): SectionKey {
  if (pathname === '/') return 'home'
  const segment = pathname.split('/')[1]
  return (segment in sectionThemes ? segment : 'home') as SectionKey
}

export function getSectionConfig(pathname: string) {
  const section = getSectionFromPath(pathname)
  const theme = sectionThemes[section]
  const hasSubNav = section in subNavigation

  return {
    section,
    theme,
    hasSubNav,
    subNavItems: hasSubNav
      ? subNavigation[section as keyof typeof subNavigation]
      : undefined,
  }
}
