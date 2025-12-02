import { sanityFetch } from '@/sanity/lib/live'
import { pssoundManifestoQuery } from '@/sanity/lib/queries'
import CmsContent from '@/components/CmsContent'

export default async function PssoundManifestoContentAsync() {
  const { data } = await sanityFetch({ query: pssoundManifestoQuery })
  const { settings } = data

  return (
    <div className='w-full'>
      {/* <h1 className='text-3xl md:text-4xl mb-6 text-center'>
        {settings?.title || 'PSSoundSystem Manifesto'}
      </h1> */}

      {settings?.description && (
        <div className='columns-1 xl:columns-2 gap-20 text-base leading-tight md:text-xl'>
          <CmsContent value={settings.description} section='pssound-system' />
        </div>
      )}
    </div>
  )
}
