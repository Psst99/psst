import {notFound} from 'next/navigation'
import {artistBySlugQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import ArtistModal from '@/components/ArtistModal'
import {buildPageMetadata} from '@/lib/seo'

export async function generateMetadata({params}: {params: Promise<{slug: string}>}) {
  const slug = (await params).slug
  const {data: artist} = await sanityFetch({
    query: artistBySlugQuery,
    params: {slug},
    stega: false,
  })

  return buildPageMetadata({
    title: artist?.artistName,
    description: artist?.description,
    path: `/database/artists/${slug}`,
  })
}

export default async function ArtistPage({params}: {params: Promise<{slug: string}>}) {
  const slug = (await params).slug

  try {
    const {data: artist} = await sanityFetch({
      query: artistBySlugQuery,
      params: {slug},
    })

    if (!artist) return notFound()

    return <ArtistModal artist={artist} />
  } catch (error) {
    console.error('Error fetching artist:', error)
    return notFound()
  }
}
