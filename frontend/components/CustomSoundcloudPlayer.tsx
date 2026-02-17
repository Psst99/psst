'use client'

import {useContext, useEffect, useMemo, useRef, useState} from 'react'
import {usePathname} from 'next/navigation'
import {MdPause, MdPlayArrow, MdSkipNext, MdSkipPrevious} from 'react-icons/md'
import {ThemeContext} from '@/app/ThemeProvider'
import {getTheme, type MainSectionSlug, type SectionSlug} from '@/lib/theme/sections'
import {CgPlayList} from 'react-icons/cg'

declare global {
  interface Window {
    SC: {
      Widget: any
    }
  }
}

type TrackInfo = {
  title?: string
  artist?: string
  artwork?: string
  permalink_url?: string
}

type Point = {x: number; y: number}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

const MAIN_MENU_ITEMS: ReadonlyArray<{path: string; section: MainSectionSlug}> = [
  {path: '/database', section: 'database'},
  {path: '/resources', section: 'resources'},
  {path: '/pssound-system', section: 'pssound-system'},
  {path: '/workshops', section: 'workshops'},
  {path: '/events', section: 'events'},
  {path: '/archive', section: 'archive'},
  {path: '/psst', section: 'psst'},
] as const

function getActiveSectionSlug(pathname: string): SectionSlug {
  for (const {path, section} of MAIN_MENU_ITEMS) {
    if (pathname.startsWith(path)) return section
  }
  return 'home'
}

export default function CustomSoundcloudPlayer({playlistUrl}: {playlistUrl?: string}) {
  const pathname = usePathname()
  const ctx = useContext(ThemeContext)
  const mode = ctx?.mode ?? 'brand'
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mobileContainerRef = useRef<HTMLDivElement>(null)

  const [widget, setWidget] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [trackInfo, setTrackInfo] = useState<TrackInfo>({})
  const [isExpanded, setIsExpanded] = useState(false)
  const [mobileBottom, setMobileBottom] = useState(40)

  // Drag state
  const [pos, setPos] = useState<Point>({x: 0, y: 0}) // interpreted as offsets from bottom/right
  const dragRef = useRef<{
    dragging: boolean
    startPointer: Point
    startPos: Point
    bounds: {maxX: number; maxY: number}
  }>({
    dragging: false,
    startPointer: {x: 0, y: 0},
    startPos: {x: 0, y: 0},
    bounds: {maxX: 0, maxY: 0},
  })
  const mobileDragRef = useRef<{
    dragging: boolean
    didDrag: boolean
    startY: number
    startBottom: number
    maxBottom: number
  }>({
    dragging: false,
    didDrag: false,
    startY: 0,
    startBottom: 40,
    maxBottom: 0,
  })

  const SOUNDCLOUD_PLAYLIST_URL =
    playlistUrl || 'https://soundcloud.com/soundcloud-hustle/sets/boomin-feel-good-hip-hop'
  const activeSection = getActiveSectionSlug(pathname)
  const theme = getTheme(activeSection, mode, ctx?.themeOverrides)

  const SOUNDCLOUD_IFRAME_URL = useMemo(() => {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(
      SOUNDCLOUD_PLAYLIST_URL,
    )}&auto_play=false&show_artwork=true`
  }, [SOUNDCLOUD_PLAYLIST_URL])

  useEffect(() => {
    if (!window.SC || !window.SC.Widget) {
      const script = document.createElement('script')
      script.src = 'https://w.soundcloud.com/player/api.js'
      script.onload = setupWidget
      document.body.appendChild(script)
    } else {
      setupWidget()
    }

    function setupWidget() {
      if (!iframeRef.current) return
      const w = window.SC.Widget(iframeRef.current)
      setWidget(w)

      w.bind(window.SC.Widget.Events.READY, () => {
        setLoading(false)
        w.getCurrentSound((sound: any) => {
          if (!sound) return
          setTrackInfo({
            title: sound.title,
            artist: sound.user?.username,
            artwork: sound.artwork_url,
            permalink_url: sound.permalink_url,
          })
        })
      })

      w.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true))
      w.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false))

      w.bind(window.SC.Widget.Events.PLAY, () => {
        w.getCurrentSound((sound: any) => {
          if (!sound) return
          setTrackInfo({
            title: sound.title,
            artist: sound.user?.username,
            artwork: sound.artwork_url,
            permalink_url: sound.permalink_url,
          })
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playPause = () => {
    if (!widget) return
    widget.isPaused((paused: boolean) => {
      if (paused) widget.play()
      else widget.pause()
    })
  }
  const next = () => widget && widget.next()
  const prev = () => widget && widget.prev()

  // Pointer-based dragging: handle-only
  const onDragStart = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    e.currentTarget.setPointerCapture(e.pointerId)

    dragRef.current = {
      dragging: true,
      startPointer: {x: e.clientX, y: e.clientY},
      startPos: {x: pos.x, y: pos.y},
      bounds: {maxX: 0, maxY: 0}, // not used anymore
    }

    document.body.style.userSelect = 'none'
  }

  const onDragMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.dragging) return
    e.preventDefault()

    const dx = e.clientX - dragRef.current.startPointer.x
    const dy = e.clientY - dragRef.current.startPointer.y

    // Because we are using bottom/right offsets:
    // moving pointer right decreases "right offset" (x), moving left increases it.
    // Allow free movement without viewport constraints
    const nextX = dragRef.current.startPos.x - dx
    const nextY = dragRef.current.startPos.y - dy

    setPos({x: nextX, y: nextY})
  }

  const onDragEnd = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.dragging) return
    dragRef.current.dragging = false
    document.body.style.userSelect = ''
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const onMobileTogglePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const container = mobileContainerRef.current
    if (!container) return

    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)

    const rect = container.getBoundingClientRect()
    const maxBottom = Math.max(40, window.innerHeight - rect.height - 8)
    mobileDragRef.current = {
      dragging: true,
      didDrag: false,
      startY: e.clientY,
      startBottom: mobileBottom,
      maxBottom,
    }
    document.body.style.userSelect = 'none'
  }

  const onMobileTogglePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!mobileDragRef.current.dragging) return
    e.preventDefault()

    const dy = e.clientY - mobileDragRef.current.startY
    if (Math.abs(dy) > 3) {
      mobileDragRef.current.didDrag = true
    }

    const nextBottom = clamp(
      mobileDragRef.current.startBottom - dy,
      8,
      mobileDragRef.current.maxBottom,
    )
    setMobileBottom(nextBottom)
  }

  const onMobileTogglePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!mobileDragRef.current.dragging) return
    mobileDragRef.current.dragging = false
    document.body.style.userSelect = ''
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const onMobileToggleClick = () => {
    if (mobileDragRef.current.didDrag) {
      mobileDragRef.current.didDrag = false
      return
    }
    setIsExpanded((prev) => !prev)
  }

  useEffect(() => {
    const clampMobileBottom = () => {
      const container = mobileContainerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const maxBottom = Math.max(40, window.innerHeight - rect.height - 8)
      setMobileBottom((prev) => clamp(prev, 8, maxBottom))
    }

    clampMobileBottom()
    window.addEventListener('resize', clampMobileBottom)
    return () => window.removeEventListener('resize', clampMobileBottom)
  }, [])

  return (
    <>
      <iframe
        ref={iframeRef}
        src={SOUNDCLOUD_IFRAME_URL}
        style={{display: 'none'}}
        width={0}
        height={0}
        tabIndex={-1}
        aria-hidden="true"
        allow="autoplay; encrypted-media"
      />

      {/* Draggable desktop player */}
      <div
        ref={containerRef}
        className="soundcloud-player-fixed hidden md:flex fixed z-50 items-center gap-3 rounded-md px-4 py-2 border shadow-sm"
        style={{
          right: 16 + pos.x,
          bottom: 16 + pos.y,
          backgroundColor: theme.bg,
          borderColor: theme.fg,
          color: theme.fg,
        }}
      >
        {/* Drag handle (separate from controls) */}
        <button
          type="button"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          className="mr-0 flex items-center justify-center w-6 h-10 rounded
             cursor-grab active:cursor-grabbing select-none touch-none"
          style={{color: theme.fg}}
          aria-label="Drag player"
          title="Drag"
        >
          ⠿
        </button>

        {loading ? (
          <span className="animate-pulse font-bold" style={{color: theme.fg}}>
            Loading...
          </span>
        ) : (
          <>
            <button
              onClick={prev}
              className="flex items-center justify-center"
              style={{color: theme.fg}}
              aria-label="Previous"
            >
              <MdSkipPrevious size={24} />
            </button>
            <button
              onClick={playPause}
              className="flex items-center justify-center"
              style={{color: theme.fg}}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
            </button>
            <button
              onClick={next}
              className="flex items-center justify-center"
              style={{color: theme.fg}}
              aria-label="Next"
            >
              <MdSkipNext size={24} />
            </button>

            {trackInfo.artwork && trackInfo.permalink_url && (
              <a
                href={trackInfo.permalink_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
                title={trackInfo.title}
              >
                <img src={trackInfo.artwork} alt="" className="w-10 h-10 rounded" />
              </a>
            )}

            <div className="min-w-0">
              <div className="font-bold truncate max-w-[220px]" style={{color: theme.fg}}>
                {trackInfo.title}
              </div>
              <div className="truncate max-w-[220px]" style={{color: theme.fg}}>
                {trackInfo.artist}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile sliding drawer */}
      <div
        ref={mobileContainerRef}
        className="md:hidden fixed right-0 z-50"
        style={{bottom: mobileBottom}}
      >
        <div
          className={`
            border rounded-l-md
            transition-transform duration-300 ease-in-out
            ${isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'}
            flex items-center
            max-w-[calc(100vw-8px)]
          `}
          style={{backgroundColor: theme.bg, borderColor: theme.fg, color: theme.fg}}
        >
          {/* Toggle button (always visible) */}
          <button
            onClick={onMobileToggleClick}
            onPointerDown={onMobileTogglePointerDown}
            onPointerMove={onMobileTogglePointerMove}
            onPointerUp={onMobileTogglePointerUp}
            onPointerCancel={onMobileTogglePointerUp}
            className="w-10 h-10 flex items-center justify-center text-lg border-r-0 rounded-l-md flex-shrink-0 touch-none select-none"
            style={{backgroundColor: theme.bg, borderColor: theme.fg, color: theme.fg}}
            aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
          >
            ♪{/* <CgPlayList /> */}
          </button>

          {/* Player content (slides in/out) */}
          <div
            className="flex items-center gap-1.5 px-2 py-1.5 border-l border-black min-w-0 max-w-[220px] overflow-hidden"
            style={{borderColor: theme.fg}}
          >
            {loading ? (
              <span
                className="animate-pulse font-bold text-sm whitespace-nowrap"
                style={{color: theme.fg}}
              >
                Loading...
              </span>
            ) : (
              <>
                {/* Controls */}
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={prev}
                    className="flex items-center justify-center"
                    style={{color: theme.fg}}
                    aria-label="Previous"
                  >
                    <MdSkipPrevious size={20} />
                  </button>
                  <button
                    onClick={playPause}
                    className="flex items-center justify-center"
                    style={{color: theme.fg}}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <MdPause size={20} /> : <MdPlayArrow size={20} />}
                  </button>
                  <button
                    onClick={next}
                    className="flex items-center justify-center"
                    style={{color: theme.fg}}
                    aria-label="Next"
                  >
                    <MdSkipNext size={20} />
                  </button>
                </div>

                {/* Track info */}
                <div className="flex items-center gap-1.5 min-w-0">
                  {trackInfo.artwork && trackInfo.permalink_url && (
                    <a
                      href={trackInfo.permalink_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                      title={trackInfo.title}
                    >
                      <img src={trackInfo.artwork} alt="" className="w-7 h-7 rounded" />
                    </a>
                  )}
                  <div className="min-w-0 max-w-[128px]">
                    <div className="font-bold text-sm truncate" style={{color: theme.fg}}>
                      {trackInfo.title && trackInfo.title.length > 16
                        ? `${trackInfo.title.substring(0, 16)}...`
                        : trackInfo.title}
                    </div>
                    <div className="text-sm truncate" style={{color: theme.fg}}>
                      {trackInfo.artist}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
