import {notFound} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import ResourceModal from '@/components/ResourceModal'
import {getResourceIdFromSlug} from '@/lib/resources'
import {buildPageMetadata} from '@/lib/seo'

const resourceByIdQuery = `
  *[_type == "resource" && approved == true && _id == $id][0]{
    _id,
    title,
    description,
    url,
    fileUrl,
    category,
    "categories": categories[]->{
      _id,
      title,
      "slug": slug.current
    },
    image,
    "tags": tags[]->{
      _id,
      title
    }
  }
`

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const routeSlug = (await params).slug
  const id = getResourceIdFromSlug(routeSlug)
  if (!id) return {}

  const {data: resource} = await sanityFetch({
    query: resourceByIdQuery,
    params: {id},
    stega: false,
  })

  return buildPageMetadata({
    title: resource?.title,
    description: resource?.description,
    image: resource?.image,
    path: `/resources/items/${routeSlug}`,
  })
}

export default async function ResourcePage({params}: {params: Promise<{slug: string}>}) {
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
