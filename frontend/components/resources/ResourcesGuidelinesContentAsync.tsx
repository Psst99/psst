import {resourcesGuidelinesQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import CmsContent from '../CmsContent'

export default async function ResourcesGuidelinesContentAsync() {
  const {data: guidelines} = await sanityFetch({
    query: resourcesGuidelinesQuery,
  })

  if (!guidelines?.content) {
    return null
  }

  // Use columns layout if specified (default for backwards compatibility)
  if (guidelines.layout === 'columns' || !guidelines.layout) {
    return (
      <div className="w-full">
        <div className="columns-1 xl:columns-2 gap-20 text-base leading-tight md:text-xl">
          <CmsContent value={guidelines.content} section="resources" />
        </div>
      </div>
    )
  }

  // Default single-column layout
  return (
    <div className="w-full max-w-[65vw] mx-auto">
      <CmsContent value={guidelines.content} section="resources" />
    </div>
  )
}
