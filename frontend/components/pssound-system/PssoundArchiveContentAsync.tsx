import {pssoundArchiveQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import CmsContent from '@/components/CmsContent'
import PssoundArchiveGrid from './PssoundArchiveGrid'

export default async function PssoundArchiveContentAsync() {
  const {data} = await sanityFetch({query: pssoundArchiveQuery})
  const {settings, archive} = data

  // Format archive items for display
  const items =
    archive?.map((item: any) => {
      const dateObj = item.date ? new Date(item.date) : null

      return {
        _id: item._id,
        title: item.title,
        date: item.date
          ? new Date(item.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
          : null,
        dateObj,
        tags: item.tags || [],
        coverImage: item.coverImage,
        description: item.description,
      }
    }) || []

  return (
    <div className="p-6 md:mx-16">
      <h1 className="text-3xl md:text-4xl mb-6 text-center">
        {settings?.title || 'PSSoundArchive'}
      </h1>

      {settings?.description && <CmsContent value={settings.description} />}

      <PssoundArchiveGrid items={items} />
    </div>
  )
}
