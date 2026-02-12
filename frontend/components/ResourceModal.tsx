'use client'

import {useCallback, useEffect, useState, type CSSProperties, useContext} from 'react'
import {useRouter} from 'next/navigation'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import {ThemeContext} from '@/app/ThemeProvider'
import {getTheme} from '@/lib/theme/sections'
import Tag from '@/components/Tag'
import {urlForImage} from '@/sanity/lib/utils'

interface ResourceModalProps {
  resource: any
}

type CSSVars = CSSProperties & Record<`--${string}`, string>

export default function ResourceModal({resource}: ResourceModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const ctx = useContext(ThemeContext)
  const mode = ctx?.mode ?? 'brand'

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const theme = getTheme('resources', mode, ctx?.themeOverrides)
  const themeFg = theme.fg
  const themeBg = theme.bg
  const modalVars: CSSVars = {
    '--section-bg': themeBg,
    '--section-fg': themeFg,
    '--panel-bg': '#FFFFFF',
    '--panel-fg': mode === 'brand' ? themeBg : themeFg,
  }

  const linkTarget = resource?.url || resource?.fileUrl
  const hasDescription = typeof resource?.description === 'string' && resource.description.trim().length > 0

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={modalVars}>
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        style={{backgroundColor: 'var(--panel-fg)'}}
        onClick={handleClose}
      />

      <div
        className={`relative panel-bg panel-fg w-full max-w-3xl rounded-3xl p-8 sm:p-8 transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-[100vh]'
        }`}
      >
        <h1 className="panel-fg text-4xl sm:text-4xl mb-4">{resource.title}</h1>

        {resource.category && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="invert-panel py-0 font-mono font-normal px-1 text-lg uppercase">
              {resource.category}
            </span>
          </div>
        )}

        {linkTarget && (
          <div className="mb-6">
            <a
              href={linkTarget}
              target="_blank"
              rel="noopener noreferrer"
              className="px-1 py-0 border-[var(--section-bg)] border text-[color:var(--section-bg)] rounded-md font-mono text-lg tracking-tighter leading-tight inline-flex items-center gap-x-2"
            >
              Visit Resource
            </a>
          </div>
        )}

        {resource.image && (
          <div className="mb-6">
            <img
              src={urlForImage(resource.image)?.width(1200).url() ?? ''}
              alt={resource.title}
              className="w-full rounded-lg object-contain max-h-[35vh]"
            />
          </div>
        )}

        {hasDescription && (
          <p className="panel-fg mb-8 text-lg leading-snug max-h-[30vh] overflow-y-auto no-scrollbar">
            {resource.description}
          </p>
        )}

        {resource.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-16">
            {resource.tags.map((tag: any, idx: number) => (
              <Tag key={tag._id || `tag-${idx}`} label={tag.title} size="sm" />
            ))}
          </div>
        )}

        <div className="absolute bottom-4 right-1/2 translate-x-1/2 rounded-full invert-panel ">
          <button onClick={handleClose} className="text-3xl cursor-pointer">
            <IoMdClose className="h-12 w-12 mt-0 -mb-1 mx-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
