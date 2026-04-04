import {sanityFetch} from '@/sanity/lib/live'
import {psstSectionsQuery} from '@/sanity/lib/queries'
import DynamicLayout from './DynamicLayout'

export default async function PsstLayout({children}: {children: React.ReactNode}) {
  const {data} = await sanityFetch({query: psstSectionsQuery})

  const validSections = (data || []).filter((section: any) => Boolean(section?.slug))
  const dynamicSubNavItems = validSections.map((section: any, index: number) => ({
    label: section.title,
    href: index === 0 ? '/psst' : `/psst/${section.slug}`,
  }))

  return <DynamicLayout dynamicSubNavItems={dynamicSubNavItems}>{children}</DynamicLayout>
}
