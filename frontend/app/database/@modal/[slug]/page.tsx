import ArtistModal from '@/components/artist-modal'
import { sanityFetch } from '@/sanity/lib/live'
import { artistBySlugQuery } from '@/sanity/lib/queries'

export default async function ArtistModalRoute({
  params,
}: {
  params: { slug: string }
}) {
  const { data: artist } = await sanityFetch({
    query: artistBySlugQuery,
    params: { slug: params.slug },
  })

  if (!artist) return null // or a fallback

  return <ArtistModal artist={artist} />
}
