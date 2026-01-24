import {SECTION_THEMES, SECTIONS, type SectionSlug} from './sections'

export {SECTION_THEMES, SECTIONS}
export type {SectionSlug}

export function getTheme(slug: SectionSlug) {
  return SECTION_THEMES[slug]
}

export function getSection(slug: SectionSlug) {
  return SECTIONS[slug]
}
