// import { useEffect, use } from 'react'
// import { getArtistById } from '@/data/artists'
// import { sanityFetch } from '@/sanity/lib/live'
// import { artistBySlugQuery } from '@/sanity/lib/queries'

// import { useRouter } from 'next/navigation'
// import ArtistModal from '@/components/artist-modal'
// import DatabaseContent from '@/components/database/database-content'
// import DatabaseBrowseContentAsync from '@/components/database/DatabaseBrowseContentAsync'

// export default async function ArtistPage({
//   params,
// }: {
//   params: Promise<{ artistId: string }>
// }) {
//   // const router = useRouter()
//   const { data: artist } = await sanityFetch({
//     query: artistBySlugQuery,
//     params: { slug: params.slug },
//   })

//   // const { artistId } = use(params)
//   // const artist = getArtistById(artistId)

//   // useEffect(() => {
//   //   // If we can't find the artist, redirect to the database page
//   //   if (!artist) {
//   //     router.push('/database')
//   //   }
//   // }, [artist, router])

//   if (!artist) {
//     return null
//   }

//   // const handleClose = () => {
//   //   router.push('/database')
//   // }

//   return (
//     <>
//       {/* Show the database content in the background */}
//       <div className='opacity-100'>
//         <DatabaseBrowseContentAsync />
//       </div>

//       {/* Show the artist modal on top */}
//       <ArtistModal artist={artist} />
//     </>
//   )
// }

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

  return <ArtistModal artist={artist} />
}
