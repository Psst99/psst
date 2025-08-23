'use client'

import { useEffect, useState } from 'react'
import { X } from './icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ArtistModalProps {
  artist: any
  onClose?: () => void
}

export default function ArtistModal({ artist, onClose }: ArtistModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      if (onClose) onClose()
      // router.push('/database/browse')
      router.back()
    }, 300)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-[#6600ff]/50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Artist modal */}
      <div
        className={`relative bg-white w-full max-w-3xl rounded-lg p-4 sm:p-8 transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <h1 className='text-[#6600ff] text-3xl sm:text-4xl font-bold mb-4'>
          {artist.artistName}
        </h1>

        {/* Categories */}
        <div className='flex flex-wrap gap-2 mb-4'>
          {artist.categories?.map((cat: any) => (
            <span
              key={cat._id}
              className='bg-[#6600ff] text-white px-3 py-1 rounded-md text-sm'
            >
              {cat.title}
            </span>
          ))}
        </div>

        {/* Social links */}
        <div className='flex gap-2 mb-6'>
          {artist.links?.instagram && (
            <Link
              href={artist.links.instagram}
              target='_blank'
              className='border border-[#6600ff] text-[#6600ff] px-3 py-1 rounded-full text-sm'
            >
              Instagram
            </Link>
          )}
          {artist.links?.soundcloud && (
            <Link
              href={artist.links.soundcloud}
              target='_blank'
              className='border border-[#6600ff] text-[#6600ff] px-3 py-1 rounded-full text-sm'
            >
              Soundcloud
            </Link>
          )}
        </div>

        {/* Description */}
        <p className='text-[#6600ff] mb-8 text-base sm:text-lg'>
          {artist.description}
        </p>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mb-16 sm:mb-8'>
          {artist.tags?.map((tag: any) => (
            <span
              key={tag._id}
              className='bg-[#A20018] text-[#00FFDD] px-2 py-0.5 rounded-full text-xs'
            >
              {tag.title}
            </span>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className='absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-[#6600ff] text-white w-10 h-10 rounded-full flex items-center justify-center'
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
