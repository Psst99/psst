import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import ResourceModal from '@/components/ResourceModal'
import {getResourceIdFromSlug} from '@/lib/resources'

const resourceByIdQuery = `
  *[_type == "resource" && approved == true && _id == $id][0]{
    _id,
    title,
    description,
    url,
    fileUrl,
    category,
    image,
    "tags": tags[]->{
      _id,
      title
    }
  }
`

export default async function ResourcePage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const routeSlug = (await params).slug
  const id = getResourceIdFromSlug(routeSlug)
  if (!id) return notFound()

  try {
    const {data: resource} = await sanityFetch({
      query: resourceByIdQuery,
      params: {id},
    })

    if (!resource) return notFound()
    return <ResourceModal resource={resource} />
  } catch (error) {
    console.error('Error fetching resource:', error)
    return notFound()
  }
}
