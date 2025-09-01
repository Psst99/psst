// filepath: /Users/aymen/dev/psst/frontend/components/artist-modal.tsx
'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import { IoMdClose } from 'react-icons/io'
import Link from 'next/link'
import Tag from './Tag'

interface ArtistModalProps {
  artist: any
}

export default function ArtistModal({ artist }: ArtistModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      router.back()
    }, 300)
  }, [router])

  // Use it in your effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const modalContent = (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-[#6600ff]/50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Artist modal */}
      <div
        className={`relative bg-white w-full max-w-3xl rounded-3xl p-8 sm:p-8 transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <h1 className='text-[#6600ff] text-4xl sm:text-4xl font-bold mb-4'>
          {artist.artistName}
        </h1>

        {/* Categories */}
        <div className='flex flex-wrap gap-2 mb-4'>
          {artist.categories?.map((cat: any) => (
            <span
              key={cat._id}
              className='bg-[#6600ff] text-white py-0 font-mono font-normal px-1 text-lg uppercase'
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
        <p className='text-[#6600ff] mb-8 text-lg leading-snug max-h-[30vh] overflow-y-auto no-scrollbar'>
          {artist.description}
        </p>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mb-16'>
          {artist.tags?.map((tag: any) => (
            <Tag key={tag._id} label={tag.title} size='sm' />
          ))}
        </div>

        <div className='absolute bottom-4 right-1/2 translate-x-1/2 rounded-full bg-[#6600ff]'>
          <button onClick={handleClose} className='text-[#fff] text-3xl'>
            <IoMdClose
              className='h-12 w-12 mt-0 -mb-1 mx-0'
              aria-hidden='true'
            />
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
