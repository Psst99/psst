'use client'

import {useContext, useEffect, useMemo, useRef, useState} from 'react'
import {usePathname} from 'next/navigation'
import {MdPause, MdPlayArrow, MdPushPin, MdSkipNext, MdSkipPrevious} from 'react-icons/md'
import {ThemeContext} from '@/app/ThemeProvider'
import {getTheme, type MainSectionSlug, type SectionSlug} from '@/lib/theme/sections'

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

const DESKTOP_PLAYER_WIDTH = 360
const DESKTOP_PLAYER_MARGIN = 16
const DOCKED_PLAYER_SIZE = 48
const DOCKED_PLAYER_RADIUS = 6

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function getDesktopPlayerWidth() {
  if (typeof window === 'undefined') return DESKTOP_PLAYER_WIDTH
  return Math.min(DESKTOP_PLAYER_WIDTH, window.innerWidth - DESKTOP_PLAYER_MARGIN * 2)
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
  const [isDetached, setIsDetached] = useState(false)
  const [dockEdge, setDockEdge] = useState<'left' | 'right'>('right')
  const [mobileBottom, setMobileBottom] = useState(40)

  // Drag state
  const [pos, setPos] = useState<Point>({x: 0, y: 80}) // interpreted as actual pixel offsets from bottom/right
  const [isDragging, setIsDragging] = useState(false)
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

  const getExpandedDockRightOffset = (edge: 'left' | 'right') => {
    if (edge === 'right') return 0
    return Math.max(0, window.innerWidth - getDesktopPlayerWidth())
  }

  const expandDesktopPlayer = () => {
    setIsDetached(true)
    setPos((prev) => ({
      x: getExpandedDockRightOffset(dockEdge),
      y: prev.y,
    }))
  }

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

  const togglePinned = () => {
    if (!containerRef.current) return

    if (isDetached) {
      const rect = containerRef.current.getBoundingClientRect()
      const rightOffset = Math.max(0, pos.x)
      const leftOffset = window.innerWidth - rightOffset - rect.width
      const nextEdge = leftOffset < rightOffset ? 'left' : 'right'

      setDockEdge(nextEdge)
      setIsDetached(false)
      setPos((prev) => ({x: nextEdge === 'left' ? window.innerWidth - rect.width : 0, y: prev.y}))
      return
    }

    let startX = 16
    if (dockEdge === 'left' && containerRef.current) {
      startX = Math.max(
        16,
        window.innerWidth - containerRef.current.getBoundingClientRect().width - 16,
      )
    }

    setIsDetached(true)
    setPos((prev) => ({x: startX, y: prev.y}))
  }

  // Pointer-based dragging: handle-only
  const onDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent drag if clicking on interactive controls when un-docked
    const target = e.target as HTMLElement
    if (isDetached && (target.closest('button[data-interactive="true"]') || target.closest('a'))) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    e.currentTarget.setPointerCapture(e.pointerId)

    let startingX = pos.x
    if (!isDetached) {
      // Calculate real starting pixel offset relative to right edge
      if (dockEdge === 'left') {
        startingX =
          window.innerWidth -
          (containerRef.current?.getBoundingClientRect().width || DOCKED_PLAYER_SIZE)
      } else {
        startingX = 0
      }
    }

    dragRef.current = {
      dragging: true,
      startPointer: {x: e.clientX, y: e.clientY},
      startPos: {x: startingX, y: pos.y},
      bounds: {maxX: 0, maxY: 0},
    }
    setIsDragging(true)
    document.body.style.userSelect = 'none'
  }

  const onDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return
    e.preventDefault()

    const dx = e.clientX - dragRef.current.startPointer.x
    const dy = e.clientY - dragRef.current.startPointer.y

    const nextX = dragRef.current.startPos.x - dx
    const nextY = dragRef.current.startPos.y - dy

    setPos({x: nextX, y: nextY})

    // Auto-unsnap if dragged away from edge
    if (!isDetached) {
      if (dockEdge === 'right' && dx < -5) {
        // dragging left away from right edge
        setIsDetached(true)
      } else if (dockEdge === 'left' && dx > 5) {
        // dragging right away from left edge
        setIsDetached(true)
        // The element grows in width when detached. Since we anchor via "right",
        // decrease the right offset by the expansion delta so it stays under the cursor.
        const expansionDelta = getDesktopPlayerWidth() - DOCKED_PLAYER_SIZE
        dragRef.current.startPos.x -= expansionDelta
        setPos({x: nextX - expansionDelta, y: nextY})
      }
    }
  }

  const onDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return
    dragRef.current.dragging = false
    setIsDragging(false)
    document.body.style.userSelect = ''
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }

    const dx = Math.abs(e.clientX - dragRef.current.startPointer.x)
    const dy = Math.abs(e.clientY - dragRef.current.startPointer.y)
    const isClick = dx < 5 && dy < 5

    if (containerRef.current) {
      if (isClick && !isDetached) {
        // Open the deluxe player and start playback when clicking the docked player.
        expandDesktopPlayer()
        playPause()
        return
      }

      const rect = containerRef.current.getBoundingClientRect()

      const maxBottom = window.innerHeight - rect.height - 16
      const minBottom = 80 // Keep it from going lower than 80px to avoid bottom nav
      let nextX = pos.x
      let nextY = clamp(pos.y, minBottom, maxBottom)
      const distRight = nextX
      const distLeft = window.innerWidth - nextX - rect.width

      if (!isClick) {
        if (distRight < 24) {
          // Snap back to right margin
          nextX = 0
          setIsDetached(false)
          setDockEdge('right')
        } else if (distLeft < 24) {
          // Snap to left margin
          // We anchor to right, so x offset from right = windowWidth - rect.width
          nextX = window.innerWidth - rect.width
          setIsDetached(false)
          setDockEdge('left')
        } else {
          setIsDetached(true)
          // Ensure it doesn't go off the screen
          const maxRight = window.innerWidth - rect.width - 16
          nextX = clamp(nextX, 16, maxRight)
        }
      }

      setPos({x: nextX, y: nextY})
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
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        className={`soundcloud-player-fixed hidden md:flex fixed z-50 items-center justify-center cursor-grab active:cursor-grabbing ${
          !isDragging ? 'transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]' : ''
        } ${
          isDetached
            ? 'rounded-md px-4 py-2 gap-3 shadow-md min-w-[200px]'
            : 'w-12 h-12 shadow-md'
        }`}
        style={{
          ...(isDetached
            ? {right: pos.x}
            : dockEdge === 'left'
              ? {left: 0, right: 'auto'}
              : {right: 0, left: 'auto'}),
          bottom: pos.y,
          backgroundColor: theme.bg,
          color: theme.fg,
          borderRadius: isDetached
            ? `${DOCKED_PLAYER_RADIUS}px`
            : dockEdge === 'left'
              ? `0 ${DOCKED_PLAYER_RADIUS}px ${DOCKED_PLAYER_RADIUS}px 0`
              : `${DOCKED_PLAYER_RADIUS}px 0 0 ${DOCKED_PLAYER_RADIUS}px`,
          overflow: 'hidden',
        }}
        title={isDetached ? 'Drag to move, or snap to edges' : 'Click to play and expand'}
      >
        {!isDetached ? (
          // Docked minimal view
          <div
            className="flex items-center justify-center pointer-events-none w-full h-full transition-transform hover:scale-105"
            style={{color: theme.fg}}
          >
            {isPlaying ? <MdPause size={28} /> : <MdPlayArrow size={28} />}
          </div>
        ) : loading ? (
          <span className="animate-pulse px-2" style={{color: theme.fg}}>
            Loading...
          </span>
        ) : (
          <>
            <div className={`flex items-center overflow-hidden gap-2`}>
              <button
                data-interactive="true"
                onClick={prev}
                className="flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{color: theme.fg}}
                aria-label="Previous"
              >
                <MdSkipPrevious size={24} />
              </button>
            </div>

            <button
              data-interactive="true"
              onClick={playPause}
              className="flex items-center justify-center hover:scale-110 transition-transform flex-shrink-0"
              style={{color: theme.fg}}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <MdPause size={28} /> : <MdPlayArrow size={28} />}
            </button>

            <div className={`flex items-center overflow-hidden gap-2`}>
              <button
                data-interactive="true"
                onClick={next}
                className="flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{color: theme.fg}}
                aria-label="Next"
              >
                <MdSkipNext size={24} />
              </button>
            </div>

            <button
              data-interactive="true"
              onClick={togglePinned}
              className="flex items-center justify-center hover:opacity-70 transition-opacity flex-shrink-0"
              style={{color: theme.fg}}
              aria-label={isDetached ? 'Pin player to edge' : 'Unpin player'}
              title={isDetached ? 'Pin to nearest edge' : 'Unpin player'}
            >
              <MdPushPin size={18} />
            </button>

            {trackInfo.artwork && trackInfo.permalink_url && (
              <a
                href={trackInfo.permalink_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity ml-1"
                title={trackInfo.title}
              >
                <img
                  src={trackInfo.artwork}
                  alt=""
                  className="rounded w-10 h-10 transition-all duration-300"
                />
              </a>
            )}

            <div className="min-w-0 flex flex-col justify-center overflow-hidden max-w-[180px] ml-1 select-none pointer-events-none">
              <div className="truncate text-sm font-semibold" style={{color: theme.fg}}>
                {trackInfo.title}
              </div>
              <div className="truncate text-xs opacity-80" style={{color: theme.fg}}>
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
            rounded-l-md
            transition-transform duration-300 ease-in-out
            ${isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-40px)]'}
            flex items-center
            max-w-[calc(100vw-8px)]
          `}
          style={{backgroundColor: theme.bg, color: theme.fg}}
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
            ♪
          </button>

          {/* Player content (slides in/out) */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 min-w-0 max-w-[220px] overflow-hidden">
            {loading ? (
              <span className="animate-pulse text-sm whitespace-nowrap" style={{color: theme.fg}}>
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
