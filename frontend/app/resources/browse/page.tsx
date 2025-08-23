import { resourcesPageQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import CmsContent from '@/components/CmsContent'
import { Suspense } from 'react'
import ResourcesSkeleton from '@/components/resources/ResourcesSkeleton'
import ResourcesContentAsync from '@/components/resources/ResourcesContentAsync'

export default async function ResourcesBrowsePage() {
  const { data: page } = await sanityFetch({ query: resourcesPageQuery })
  const { settings, resources } = page

  const items =
    resources?.map((resource: any) => ({
      title: resource.title,
      date: resource.date
        ? new Date(resource.date).toLocaleDateString()
        : undefined,
      tags: resource.tags || [],
      url: resource.url,
      description: resource.description,
    })) || []

  return (
    <main>
      <Suspense fallback={<ResourcesSkeleton />}>
        <ResourcesContentAsync />
      </Suspense>
    </main>
  )
}
