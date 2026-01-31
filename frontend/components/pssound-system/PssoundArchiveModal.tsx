'use client'

import {useCallback, useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import CmsContent from '@/components/CmsContent'
import Tag from '@/components/Tag'
import {urlForImage} from '@/sanity/lib/utils'

interface PssoundArchiveModalProps {
  archive: any
  onClose: () => void
}

export default function PssoundArchiveModal({archive, onClose}: PssoundArchiveModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Animation and scroll lock effect
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
      onClose()
    }, 300)
  }, [onClose])

  // ESC key handler
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
        className={`absolute inset-0 bg-[#07f25b]/50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white w-full max-w-3xl rounded-3xl p-8 sm:p-8 transition-transform duration-300 ease-out max-h-[90vh] overflow-hidden ${
          isVisible ? 'translate-y-0' : 'translate-y-[100vh]'
        }`}
      >
        {/* Scrollable content area */}
        <div className="overflow-y-auto max-h-full no-scrollbar">
          <h1 className="text-[#07f25b] text-4xl sm:text-4xl font-bold mb-4 capitalize">
            {archive.title}
          </h1>

          {/* Date */}
          {archive.date && (
            <div className="mb-4">
              <span className="bg-[#07f25b] text-white py-0 font-mono font-normal px-1 text-lg">
                {archive.date}
              </span>
            </div>
          )}

          {/* Cover Image - with max height constraint */}
          {archive.coverImage && (
            <div className="mb-6">
              <img
                src={
                  urlForImage(archive.coverImage)?.width(800).height(600).fit('crop').url() ?? ''
                }
                alt={archive.title}
                className="w-full rounded-lg max-h-[400px] object-cover"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl mb-2 text-[#07f25b]">About</h2>
            <div className="text-[#07f25b] mb-8 text-lg leading-snug max-h-[30vh] overflow-y-auto no-scrollbar">
              <CmsContent value={archive.description} />
            </div>
          </div>

          {/* Tags */}
          {archive.tags && archive.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-16">
              {archive.tags.map((tag: any) => (
                <Tag key={tag._id} label={tag.title} size="sm" className="block w-fit" />
              ))}
            </div>
          )}
        </div>

        {/* Close button - positioned outside scrollable area */}
        <div className="absolute bottom-4 right-1/2 translate-x-1/2 rounded-full bg-[#07f25b] z-10">
          <button onClick={handleClose} className="text-[#fff] text-3xl">
            <IoMdClose className="h-12 w-12 mt-0 -mb-1 mx-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
