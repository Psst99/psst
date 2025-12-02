import { sanityFetch } from '@/sanity/lib/live'
import { pssoundAboutQuery } from '@/sanity/lib/queries'
import CmsContent from '@/components/CmsContent'

export default async function PssoundAboutContentAsync() {
  const { data } = await sanityFetch({ query: pssoundAboutQuery })
  const { settings } = data

  return (
    <div className='w-full'>
      {/* <h1 className='text-3xl md:text-4xl mb-6 text-center'>
        {settings?.title || 'About PSSoundSystem'}
      </h1> */}

      {settings?.description && (
        <div className='columns-1 xl:columns-2 gap-20 text-base leading-tight md:text-xl'>
          <CmsContent value={settings.description} section='pssound-system' />
        </div>
      )}
    </div>
  )
}
