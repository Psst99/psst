import {sanityFetch} from '@/sanity/lib/live'
import {pssoundAboutQuery} from '@/sanity/lib/queries'
import CmsContent from '@/components/CmsContent'

export default async function PssoundAboutContentAsync() {
  const {data} = await sanityFetch({query: pssoundAboutQuery})
  const {settings} = data

  if (!settings?.description) {
    return null
  }

  // Use columns layout if specified
  if (settings.layout === 'columns') {
    return (
      <div className="w-full">
        <div className="columns-1 xl:columns-2 gap-20 text-base leading-tight md:text-xl">
          <CmsContent value={settings.description} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[65vw] mx-auto">
      <CmsContent value={settings.description} />
    </div>
  )
}
