import {psstPageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import CmsContent from '@/components/CmsContent'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function PsstContentAsync() {
  // await sleep(2000) // Simulate slow loading for testing
  const {data: page} = await sanityFetch({query: psstPageQuery})
  const {about, charter, legal} = page

  return (
    <>
      <CmsContent value={about} />
    </>
  )
}
