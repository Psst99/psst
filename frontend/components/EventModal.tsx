'use client'

import {useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import CmsContent from '@/components/CmsContent'
import Tag from '@/components/Tag'
import {urlForImage} from '@/sanity/lib/utils'

interface EventModalProps {
  event: any
}

export default function EventModal({event}: EventModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const isUpcoming = event.dates?.some((date: string) => new Date(date) >= new Date())

  // fade-in transition + lock scroll
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

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-[#00ffdd]/50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal body */}
      <div
        className={`relative bg-white w-full max-w-3xl rounded-3xl p-8 sm:p-8 transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-[100vh]'
        }`}
      >
        <h1 className="text-[#4E4E4E] text-4xl font-bold mb-4 capitalize">{event.title}</h1>

        {/* Dates */}
        {event.dates?.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl mb-2 text-[#4E4E4E]">Dates</h2>
            <div className="flex flex-wrap gap-2">
              {event.dates.map((date: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-[#00ffdd] text-white py-0 font-mono font-normal px-1 text-lg"
                >
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cover Image */}
        {event.coverImage && (
          <div className="mb-6">
            <img
              src={urlForImage(event.coverImage)?.width(800).url() ?? ''}
              alt={event.title}
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <div className="text-[#4E4E4E] mb-8 text-lg leading-snug max-h-[30vh] overflow-y-auto no-scrollbar">
            <CmsContent value={event.description} section="events" />
          </div>
        </div>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-16">
            {event.tags.map((tag: any) => (
              <Tag key={tag._id} label={tag.title} size="sm" className="block w-fit" />
            ))}
          </div>
        )}

        {/* Close button */}
        <div className="absolute bottom-4 right-1/2 translate-x-1/2 rounded-full bg-[#00ffdd]">
          <button onClick={handleClose} className="text-[#fff] text-3xl">
            <IoMdClose className="h-12 w-12 mt-0 -mb-1 mx-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
