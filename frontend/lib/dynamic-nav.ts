import {sanityFetch} from '@/sanity/lib/live'
import {psstSectionsQuery} from '@/sanity/lib/queries'
import type {SectionKey} from './theme'

type SubNavItem = {label: string; href: string}

export async function fetchDynamicSubNav(section: SectionKey): Promise<SubNavItem[]> {
  switch (section) {
    case 'psst': {
      try {
        const {data} = await sanityFetch({query: psstSectionsQuery})
        return (
          data?.map((section: any) => ({
            label: section.title,
            href: `/psst/${section.slug}`,
          })) || []
        )
      } catch (error) {
        console.error('Error fetching psst sections:', error)
        return []
      }
    }

    // Add other dynamic sections here in the future
    case 'workshops': {
      // This could be dynamic too if needed
      return [{label: 'Browse', href: '/workshops'}]
    }

    // Add more cases as needed
    default:
      return []
  }
}

// Helper to get initial data for SSR
export async function getInitialSubNavData(section: SectionKey): Promise<SubNavItem[] | undefined> {
  if (section === 'psst') {
    return await fetchDynamicSubNav(section)
  }
  return undefined
}
