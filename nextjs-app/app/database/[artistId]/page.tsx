'use client'

import { useEffect, use } from 'react'
import { getArtistById } from '@/data/artists'
import { useRouter } from 'next/navigation'
import ArtistModal from '@/components/artist-modal'
import DatabaseContent from '@/components/database-content'

export default function ArtistPage({
  params,
}: {
  params: Promise<{ artistId: string }>
}) {
  const router = useRouter()
  const { artistId } = use(params)
  const artist = getArtistById(artistId)

  useEffect(() => {
    // If we can't find the artist, redirect to the database page
    if (!artist) {
      router.push('/database')
    }
  }, [artist, router])

  if (!artist) {
    return null
  }

  const handleClose = () => {
    router.push('/database')
  }

  return (
    <>
      {/* Show the database content in the background */}
      <div className='opacity-100'>
        <DatabaseContent />
      </div>

      {/* Show the artist modal on top */}
      <ArtistModal artist={artist} onClose={handleClose} />
    </>
  )
}
