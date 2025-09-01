import { resourcesPageQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import CmsContent from '@/components/CmsContent'
import Tag from '../Tag'

type ResourceItem = {
  title: string
  date?: string
  tags: string[]
  url?: string
  description?: any
}

export default async function ResourcesContentAsync() {
  const { data: page } = await sanityFetch({ query: resourcesPageQuery })
  const { settings, resources } = page

  const items: ResourceItem[] =
    resources?.map((resource: any) => ({
      title: resource.title,
      date: resource.submittedAt // Changed from 'date' to 'submittedAt'
        ? new Date(resource.submittedAt).toLocaleDateString()
        : undefined,
      tags: resource.tags || [],
      url: resource.link, // Changed from 'url' to 'link' to match schema
      description: resource.description,
    })) || []

  return (
    <div className='p-6 text-[#FE93E7] md:mx-16'>
      <h1 className='text-3xl md:text-4xl mb-6 text-center'>
        {settings?.title}
      </h1>
      <CmsContent value={settings?.about} color='#FE93E7' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto mt-20'>
        {items.map((item, idx) => (
          <div key={idx} className='bg-white p-4 sm:p-2 sm:px-4 rounded-lg'>
            <h2 className='text-4xl md:text-3xl mb-2 text-[#1D53FF]'>
              {item.title}
            </h2>
            {item.date && (
              <span className='mt-1 bg-[#1D53FF] text-white px-1 py-0 text-sm font-mono block w-fit'>
                {item.date}
              </span>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {item.tags.map((tag: string, tagIdx: number) => (
                  <Tag
                    key={tagIdx}
                    label={tag}
                    size='sm'
                    className='block w-fit'
                  />
                ))}
              </div>
            )}
            {item.description && (
              <div className='mt-2'>
                <CmsContent value={item.description} />
              </div>
            )}
            {item.url && (
              <a
                href={item.url}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block mt-2 text-[#1D53FF] text-sm tracking-tighter xl:text-base'
              >
                View Resource
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
