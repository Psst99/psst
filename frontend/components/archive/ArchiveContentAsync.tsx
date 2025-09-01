import { archivePageQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import CmsContent from '../CmsContent'
import CoverImage from '@/components/CoverImage'

export default async function ArchiveContentAsync() {
  const { data: page } = await sanityFetch({ query: archivePageQuery })
  const { archiveMedia, settings } = page

  return (
    <div className='p-6 text-[#FFCC00] md:mx-16'>
      <h1 className='text-3xl md:text-4xl mb-6 text-center mt-16 md:mt-0'>
        {settings?.title}
      </h1>

      <CmsContent value={settings?.description} color='#FFCC00' />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto mt-16'>
        {archiveMedia?.length > 0 ? (
          archiveMedia.map((item: any) => (
            <div key={item._id} className='flex flex-col h-full'>
              {item.image && (
                <CoverImage
                  image={item.image}
                  alt={item.title || item.tags?.[0]?.title || 'Archive media'}
                  priority={false}
                  className='w-full h-full object-cover mb-4'
                />
              )}
              {/* {item.title && (
                <h2 className='text-xl font-bold mb-2 text-[#FFCC00]'>
                  {item.title}
                </h2>
              )} */}
              {item.description && (
                <div className='mb-2'>
                  <CmsContent value={item.description} />
                </div>
              )}
              {item.tags && item.tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-auto'>
                  {item.tags.map((tag: any) => (
                    <span
                      key={tag._id}
                      className='bg-[#1d53ff] text-white px-2 py-0.5 rounded-full text-xs block w-fit'
                    >
                      {tag.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500 col-span-3'>
            No archive media found.
          </p>
        )}
      </div>
    </div>
  )
}
