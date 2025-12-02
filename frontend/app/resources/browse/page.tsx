import ResourcesBrowseContentAsync from '@/components/resources/ResourcesBrowseContentAsync'
import {sanityFetch} from '@/sanity/lib/live'
import Loading from './loading'

// This query gets initial resources and metadata
const initialResourcesQuery = `
{
  "resources": *[_type == "resource"] | order(publishedAt desc)[0...20] {
    _id,
    title,
    description,
    url,
    fileUrl,
    category,
    image,
    publishedAt,
    tags[] -> { _id, title }
  },
  "tags": *[_type == "tag"] {
    _id,
    title
  },
  "categories": ["text", "video", "sound", "website"]
}
`

export default async function ResourcesBrowsePage({searchParams}: {searchParams: any}) {
  const {data} = await sanityFetch({query: initialResourcesQuery})

  return (
    <>
      <ResourcesBrowseContentAsync searchParams={searchParams} />
    </>
  )
}
