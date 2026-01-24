import {sanityFetch} from '@/sanity/lib/live'
import {psstSectionsQuery} from '@/sanity/lib/queries'
import DynamicLayout from './DynamicLayout'

export default async function PsstLayout({children}: {children: React.ReactNode}) {
  const {data} = await sanityFetch({query: psstSectionsQuery})

  const dynamicSubNavItems =
    data?.map((section: any) => ({
      label: section.title,
      href: `/psst/${section.slug}`,
    })) || []

  return <DynamicLayout dynamicSubNavItems={dynamicSubNavItems}>{children}</DynamicLayout>
}
