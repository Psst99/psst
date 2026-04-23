'use client'

import {useCallback, useContext, useEffect, useState, type CSSProperties} from 'react'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import CmsContent from '@/components/CmsContent'
import Tag from '@/components/Tag'
import {urlForImage} from '@/sanity/lib/utils'
import {ThemeContext} from '@/app/ThemeProvider'
import {MODAL_CLOSE_BUTTON_CLASS} from '@/lib/modalStyles'
import {getTheme} from '@/lib/theme/sections'

interface PssoundArchiveModalProps {
  archive: any
  onClose: () => void
}

type CSSVars = CSSProperties & Record<`--${string}`, string>

export default function PssoundArchiveModal({archive, onClose}: PssoundArchiveModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ctx = useContext(ThemeContext)
  const mode = ctx?.mode ?? 'brand'
  const theme = getTheme('pssound-system', mode, ctx?.themeOverrides)
  const themeFg = theme.fg
  const themeBg = theme.bg
  const panelBg = '#FFFFFF'
  const panelFg = mode === 'brand' ? themeBg : themeFg
  const modalVars: CSSVars = {
    '--section-bg': themeBg,
    '--section-fg': themeFg,
    '--panel-bg': panelBg,
    '--panel-fg': panelFg,
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={modalVars}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        style={{backgroundColor: 'var(--panel-fg)'}}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative panel-bg panel-fg w-full max-w-3xl rounded-3xl p-8 sm:p-8 transition-transform duration-300 ease-out max-h-[90vh] overflow-hidden ${
          isVisible ? 'translate-y-0' : 'translate-y-[100vh]'
        }`}
      >
        {/* Scrollable content area */}
        <div className="overflow-y-auto max-h-full no-scrollbar">
          <h1 className="panel-fg text-4xl sm:text-4xl mb-4 capitalize">{archive.title}</h1>

          {/* Date */}
          {archive.date && (
            <div className="mb-4">
              <span className="invert-panel py-0 font-mono font-normal px-2 text-lg">
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
            <h2 className="text-xl mb-2 panel-fg">About</h2>
            <div className="panel-fg mb-8 text-lg leading-snug max-h-[30vh] overflow-y-auto no-scrollbar">
              <CmsContent value={archive.description} bulletTone="sectionBg" />
            </div>
          </div>

          {/* Tags */}
          {archive.tags && archive.tags.length > 0 && (
            <div className="flex flex-wrap gap-0 mb-16">
              {archive.tags.map((tag: any) => (
                <Tag key={tag._id} label={tag.title} size="sm" className="block w-fit" />
              ))}
            </div>
          )}
        </div>

        {/* Close button - positioned outside scrollable area */}
        <div className="absolute bottom-4 right-1/2 translate-x-1/2 rounded-full invert-panel z-10">
          <button
            onClick={handleClose}
            className={`text-3xl ${MODAL_CLOSE_BUTTON_CLASS}`}
            type="button"
            aria-label="Close PSSound archive modal"
          >
            <IoMdClose className="h-12 w-12 mt-0 -mb-1 mx-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
