'use client'

import {useCallback, useEffect, useMemo, useState, type CSSProperties, useContext} from 'react'
import {useRouter} from 'next/navigation'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import Tag from './Tag'
import {ThemeContext} from '@/app/ThemeProvider'
import {getTheme} from '@/lib/theme/sections'

interface ArtistModalProps {
  artist: any
}

type CSSVars = CSSProperties & Record<`--${string}`, string>

type ArtistLink = {
  _key?: string
  url: string
  platform: string
}

function detectPlatform(url: string): string {
  const cleanUrl = url.toLowerCase()

  if (cleanUrl.includes('instagram.com')) return 'Instagram'
  if (cleanUrl.includes('soundcloud.com')) return 'SoundCloud'
  if (cleanUrl.includes('bandcamp.com')) return 'Bandcamp'
  if (cleanUrl.includes('spotify.com')) return 'Spotify'
  if (cleanUrl.includes('music.apple.com')) return 'Apple Music'
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) return 'YouTube'
  if (cleanUrl.includes('mixcloud.com')) return 'Mixcloud'
  if (cleanUrl.includes('residentadvisor.net')) return 'Resident Advisor'
  if (cleanUrl.includes('discogs.com')) return 'Discogs'
  if (cleanUrl.includes('beatport.com')) return 'Beatport'
  if (cleanUrl.includes('tiktok.com')) return 'TikTok'
  if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com')) return 'Twitter/X'
  if (cleanUrl.includes('facebook.com')) return 'Facebook'

  try {
    const domain = new URL(url).hostname.replace('www.', '')
    return domain.charAt(0).toUpperCase() + domain.slice(1)
  } catch {
    return 'Website'
  }
}

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
  const normalizedLinks = useMemo<ArtistLink[]>(() => {
    const rawLinks = artist?.links
    if (!rawLinks) return []

    if (Array.isArray(rawLinks)) {
      return rawLinks.reduce<ArtistLink[]>((acc, link, index) => {
          if (typeof link === 'string') {
            acc.push({_key: `link-${index}`, url: link, platform: detectPlatform(link)})
            return acc
          }

          if (link && typeof link === 'object' && 'url' in link) {
            const url = typeof link.url === 'string' ? link.url : ''
            if (!url) return acc

            const platform =
              typeof link.platform === 'string' && link.platform.trim()
                ? link.platform
                : detectPlatform(url)

            acc.push({
              _key: typeof link._key === 'string' ? link._key : `link-${index}`,
              url,
              platform,
            })

            return acc
          }

          return acc
        }, [])
    }

    if (typeof rawLinks === 'object') {
      const legacy = rawLinks as {instagram?: unknown; soundcloud?: unknown}
      const pairs: Array<{platform: string; url: unknown}> = [
        {platform: 'Instagram', url: legacy.instagram},
        {platform: 'SoundCloud', url: legacy.soundcloud},
      ]

      return pairs
        .filter((entry) => typeof entry.url === 'string' && entry.url.length > 0)
        .map((entry, index) => ({
          _key: `legacy-link-${index}`,
          url: entry.url as string,
          platform: entry.platform,
        }))
    }

    return []
  }, [artist?.links])

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
        <h1 className="panel-fg text-4xl sm:text-4xl mb-4">{artist.artistName}</h1>

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
        {normalizedLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {normalizedLinks.map((link, index) => (
              <a
                key={link._key ?? `${link.url}-${index}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-1 py-0 border-[var(--section-bg)] border text-[color:var(--section-bg)] rounded-md font-mono text-lg tracking-tighter leading-tight inline-flex items-center gap-x-2"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}

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
