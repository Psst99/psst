'use client'

import {useCallback, useEffect, useState} from 'react'
import {useRouter} from 'next/navigation'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import CmsContent from '@/components/CmsContent'
import Tag from '@/components/Tag'
import {urlForImage} from '@/sanity/lib/utils'
import Link from 'next/link'

interface WorkshopModalProps {
  workshop: any
  isUpcoming?: boolean
}

export default function WorkshopModal({workshop, isUpcoming = false}: WorkshopModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  // const isUpcoming = workshop.dates?.some((date: string) => new Date(date) >= new Date())

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

  const handleRegister = () => {
    if (isUpcoming) {
      // router.push(`/workshops/register?workshop=${workshop.slug || workshop._id}`)
      window.location.href = `/workshops/register?workshop=${workshop.slug || workshop._id}`
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-[#f50806]/50 transition-opacity duration-300 ${
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
        <div className="flex flex-col min-[83rem]:flex-row justify-between space-y-2 min-[83rem]:space-y-0">
          <h1 className="text-[#f50806] text-2xl min-[83rem]:text-4xl font-bold capitalize tracking-tight">
            {workshop.title}
          </h1>

          {isUpcoming && (
            <button
              // href={`/workshops/register?workshop=${workshop.slug || workshop._id}`}
              // prefetch={false}
              onClick={handleRegister}
              className="inline-block bg-[#F50806] text-[#fff] px-2 py-0 rounded-none text-xl font-bold hover:opacity-90 transition-opacity text-center uppercase tracking-tighter cursor-pointer"
            >
              Register for this Workshop
            </button>
          )}
        </div>

        {/* Dates */}
        {workshop.dates?.length > 0 && (
          <div className="mb-4 mt-4">
            <div className="flex flex-wrap gap-2">
              {workshop.dates.map((date: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-[#f50806] text-white py-0 font-mono font-normal px-1 text-sm min-[83rem]:text-lg"
                >
                  {new Date(date).toLocaleDateString('en-US', {
                    // weekday: 'long',
                    month: 'numeric',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cover Image */}
        {workshop.coverImage && (
          <div className="mb-6">
            <img
              src={urlForImage(workshop.coverImage)?.width(800).url() ?? ''}
              alt={workshop.title}
              className="w-full rounded-lg max-h-64 object-contain"
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <div className="text-[#f50806] mb-8 text-lg leading-snug max-h-[30vh] overflow-y-auto no-scrollbar">
            <CmsContent value={workshop.description} />
          </div>
        </div>

        {/* Tags */}
        {workshop.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-16">
            {workshop.tags.map((tag: any) => (
              <Tag key={tag._id} label={tag.title} size="sm" className="block w-fit" />
            ))}
          </div>
        )}

        {/* Close button */}
        <div className="absolute bottom-4 right-1/2 translate-x-1/2 rounded-full bg-[#f50806]">
          <button onClick={handleClose} className="text-[#fff] text-3xl">
            <IoMdClose className="h-12 w-12 mt-0 -mb-1 mx-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
