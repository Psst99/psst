'use client'

import {useCallback, useEffect, useState, type CSSProperties, useContext} from 'react'
import {useRouter} from 'next/navigation'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import CmsContent from '@/components/CmsContent'
import Tag from '@/components/Tag'
import {urlForImage} from '@/sanity/lib/utils'
import {getTheme} from '@/lib/theme/sections'
import {ThemeContext} from '@/app/ThemeProvider'

interface WorkshopModalProps {
  workshop: any
  isUpcoming?: boolean
}

type CSSVars = CSSProperties & Record<`--${string}`, string>

export default function WorkshopModal({workshop, isUpcoming = false}: WorkshopModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const ctx = useContext(ThemeContext)
  const mode = ctx?.mode ?? 'brand'
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

  const theme = getTheme('workshops', mode, ctx?.themeOverrides)
  const themeFg = theme.fg
  const themeBg = theme.bg
  const panelBg = themeBg
  const panelFg = themeFg
  const modalVars: CSSVars = {
    '--section-bg': themeBg,
    '--section-fg': themeFg,
    '--panel-bg': panelBg,
    '--panel-fg': panelFg,
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={modalVars}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        style={{backgroundColor: 'var(--panel-fg)'}}
        onClick={handleClose}
      />

      {/* Modal body */}
      <div
        className={`relative panel-bg panel-fg w-full max-w-3xl rounded-3xl transition-transform duration-300 ease-out
        max-h-[85vh] flex flex-col min-h-0 ${isVisible ? 'translate-y-0' : 'translate-y-[100vh]'}`}
      >
        {/* Header */}
        <div className="p-8 sm:p-8 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h1 className="panel-fg text-2xl min-[83rem]:text-3xl tracking-tight">
              {workshop.title}
            </h1>

            {/* Dates (right under title) */}
            {workshop.dates?.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {workshop.dates.map((date: string, idx: number) => (
                    <span
                      key={idx}
                      className="invert-panel py-0 font-mono font-normal px-2 text-sm min-[83rem]:text-lg"
                    >
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Register */}
          {isUpcoming && (
            <button
              onClick={handleRegister}
              className="shrink-0 w-32 h-32 rounded-full text-2xl font-medium cursor-pointer invert-panel 
             hover:opacity-80 transition-opacity"
            >
              Register
            </button>
          )}
        </div>

        {/* Scrollable content */}
        <div className="px-8 pb-8 flex-1 min-h-0 overflow-y-auto no-scrollbar pr-2">
          {/* Cover Image */}
          {workshop.coverImage && (
            <div className="mb-6">
              <img
                src={urlForImage(workshop.coverImage)?.width(800).url() ?? ''}
                alt={workshop.title}
                className="w-full rounded-lg object-contain max-h-[40vh]"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-6 panel-fg text-lg leading-snug">
            <CmsContent value={workshop.description} />
          </div>

          {/* Tags */}
          {workshop.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-16">
              {workshop.tags.map((tag: any) => (
                <Tag key={tag._id} label={tag.title} size="sm" className="block w-fit" />
              ))}
            </div>
          )}
        </div>

        {/* Close button */}
        <div className="absolute bottom-4 right-1/2 translate-x-1/2 rounded-full invert-panel">
          <button onClick={handleClose} className="text-3xl">
            <IoMdClose className="h-12 w-12 mt-0 -mb-1 mx-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
