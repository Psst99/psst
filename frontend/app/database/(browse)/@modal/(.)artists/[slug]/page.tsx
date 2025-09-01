import { notFound } from 'next/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { artistBySlugQuery } from '@/sanity/lib/queries'
import ArtistModal from '@/components/ArtistModal'

export default async function ModalSlugRoute({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  console.log('slug:', slug)

  try {
    const { data: artist } = await sanityFetch({
      query: artistBySlugQuery,
      params: { slug },
    })

    if (!artist) return notFound()

    return <ArtistModal artist={artist} />
  } catch (error) {
    console.error('Error fetching artist:', error)
    return notFound()
  }
}
