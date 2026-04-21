'use client'

import {useCallback, useEffect, useState} from 'react'
import Link from 'next/link'
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
  const eventDates = Array.isArray(event.dates) ? event.dates : event.date ? [event.date] : []
  const coverImage = event.image || event.coverImage

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
        className={`relative bg-white text-[#4E4E4E] w-full max-w-3xl rounded-3xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col min-h-0 ${
          isVisible ? 'translate-y-0' : 'translate-y-[100vh]'
        }`}
      >
        <div className="p-8 sm:p-8">
          <div className="min-w-0">
            <h1 className="text-2xl min-[69.375rem]:text-3xl tracking-tight">{event.title}</h1>

            {eventDates.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {eventDates.map((date: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-[#00ffdd] text-white py-0 font-mono font-normal px-2 text-sm min-[69.375rem]:text-lg"
                  >
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-8 pb-8 flex-1 min-h-0 overflow-y-auto no-scrollbar pr-2">
          {(event.location || event.url) && (
            <div className="mb-6 space-y-2 text-base min-[69.375rem]:text-xl leading-snug">
              {event.location && (
                <p className="flex items-start gap-2">
                  <span aria-hidden="true" className="translate-y-[0.05em]">
                    📍
                  </span>
                  <span>{event.location}</span>
                </p>
              )}
              {event.url && (
                <p className="flex items-start gap-2">
                  <span aria-hidden="true" className="translate-y-[0.05em]">
                    🔗
                  </span>
                  <Link
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 break-all"
                  >
                    {event.url}
                  </Link>
                </p>
              )}
            </div>
          )}

          {coverImage && (
            <div className="mb-6">
              <img
                src={urlForImage(coverImage)?.width(800).url() ?? ''}
                alt={event.title}
                className="w-full rounded-lg object-contain max-h-[40vh]"
              />
            </div>
          )}

          <div className="mb-6 text-lg leading-snug">
            <CmsContent value={event.description} />
          </div>

          {event.tags?.length > 0 && (
            <div className="flex flex-wrap gap-0 mb-16">
              {event.tags.map((tag: any) => (
                <Tag key={tag._id} label={tag.title} size="sm" className="block w-fit" />
              ))}
            </div>
          )}
        </div>

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
