'use client'

import {useCallback, useEffect, useState, type CSSProperties, useContext} from 'react'
import {useRouter} from 'next/navigation'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import Link from 'next/link'
import Tag from './Tag'
import {ThemeContext} from '@/app/ThemeProvider'
import {getTheme} from '@/lib/theme/sections'

interface ArtistModalProps {
  artist: any
}

type CSSVars = CSSProperties & Record<`--${string}`, string>

export default function ArtistModal({artist}: ArtistModalProps) {
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

  // Use it in your effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose])

  const theme = getTheme('database', mode, ctx?.themeOverrides)
  const themeFg = theme.fg
  const themeBg = theme.bg
  const modalVars: CSSVars = {
    '--section-bg': themeBg,
    '--section-fg': themeFg,
    '--panel-bg': '#FFFFFF',
    '--panel-fg': mode === 'brand' ? themeBg : themeFg,
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

      {/* Artist modal */}
      <div
        className={`relative panel-bg panel-fg w-full max-w-3xl rounded-3xl p-8 sm:p-8 transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-[100vh]'
        }`}
      >
        <h1 className="panel-fg text-4xl sm:text-4xl font-bold mb-4">{artist.artistName}</h1>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {artist.categories?.map((cat: any) => (
            <span
              key={cat._id}
              className="invert-panel py-0 font-mono font-normal px-1 text-lg uppercase"
            >
              {cat.title}
            </span>
          ))}
        </div>

        {/* Social links */}
        <div className="flex gap-2 mb-6">
          {artist.links?.instagram && (
            <Link
              href={artist.links.instagram}
              target="_blank"
              className="border panel-border panel-fg px-3 py-1 rounded-full text-sm"
            >
              Instagram
            </Link>
          )}
          {artist.links?.soundcloud && (
            <Link
              href={artist.links.soundcloud}
              target="_blank"
              className="border panel-border panel-fg px-3 py-1 rounded-full text-sm"
            >
              Soundcloud
            </Link>
          )}
        </div>

        {/* Description */}
        <p className="panel-fg mb-8 text-lg leading-snug max-h-[30vh] overflow-y-auto no-scrollbar">
          {artist.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-16">
          {artist.tags?.map((tag: any) => (
            <Tag key={tag._id} label={tag.title} size="sm" />
          ))}
        </div>

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
