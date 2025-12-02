import {archivePageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import CoverImage from '@/components/CoverImage'
import CoverImageArchive from '../CoverImageArchive'

export default async function ArchiveContentAsync() {
  const {data: page} = await sanityFetch({query: archivePageQuery})
  const {archiveMedia} = page

  return (
    <div className="w-full">
      {/* 1. columns-1 md:columns-3: Creates the vertical masonry layout 
        2. gap-4: Adds space between columns
        3. space-y-4: Adds space between items vertically
      */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-0">
        {archiveMedia?.length > 0 ? (
          archiveMedia.map(
            (item: any) =>
              item.image && (
                // break-inside-avoid is CRITICAL. It stops an image
                // from being sliced in half across two columns.
                <div key={item._id} className="break-inside-avoid">
                  <CoverImageArchive
                    image={item.image}
                    alt={item.title || 'Archive media'}
                    priority={false}
                  />
                </div>
              ),
          )
        ) : (
          <p className="text-center text-gray-500">No archive media found.</p>
        )}
      </div>
    </div>
  )
}
