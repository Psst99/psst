import {buildThemeOverrides, type ThemeSectionColors} from '@/lib/theme/overrides'
import type {EmailTemplateKey} from './defaults'
import {emailSanityClient} from './sanity-client'
import {createEmailTheme} from './theme'

const themeSettingsQuery =
  'coalesce(*[_id == "drafts.themeSettings"][0], *[_id == "themeSettings"][0]){sectionColors}'

const fetchThemeOverrides = async () => {
  if (!emailSanityClient) {
    return buildThemeOverrides(null)
  }

  const settings = await emailSanityClient
    .fetch<{sectionColors?: ThemeSectionColors} | null>(themeSettingsQuery)
    .catch(() => null)

  return buildThemeOverrides(settings?.sectionColors ?? null)
}

export async function getResolvedEmailTheme(key: EmailTemplateKey) {
  return createEmailTheme(key, await fetchThemeOverrides())
}
