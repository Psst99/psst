'use client'

import {useEffect, useRef, useState} from 'react'

declare global {
  interface Window {
    SC: {
      Widget: any
    }
  }
}

export default function CustomSoundcloudPlayer({playlistUrl}: {playlistUrl?: string}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [widget, setWidget] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [trackInfo, setTrackInfo] = useState<{
    title?: string
    artist?: string
    artwork?: string
    permalink_url?: string
  }>({})
  const [isExpanded, setIsExpanded] = useState(false)

  const SOUNDCLOUD_PLAYLIST_URL =
    playlistUrl || 'https://soundcloud.com/soundcloud-hustle/sets/boomin-feel-good-hip-hop'
  const SOUNDCLOUD_IFRAME_URL = `https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUNDCLOUD_PLAYLIST_URL)}&auto_play=false&show_artwork=true`

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
          if (sound) {
            setTrackInfo({
              title: sound.title,
              artist: sound.user?.username,
              artwork: sound.artwork_url,
              permalink_url: sound.permalink_url,
            })
          }
        })
      })
      w.bind(window.SC.Widget.Events.PLAY, () => setIsPlaying(true))
      w.bind(window.SC.Widget.Events.PAUSE, () => setIsPlaying(false))
      w.bind(window.SC.Widget.Events.PLAY, () => {
        w.getCurrentSound((sound: any) => {
          if (sound) {
            setTrackInfo({
              title: sound.title,
              artist: sound.user?.username,
              artwork: sound.artwork_url,
              permalink_url: sound.permalink_url,
            })
          }
        })
      })
    }
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

  return (
    <>
      {/* Hidden SoundCloud widget */}
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

      {/* Desktop version (unchanged) */}
      <div className="hidden min-[83rem]:flex fixed bottom-4 right-4 z-50 items-center gap-3 bg-[#cccccc] rounded-md px-4 py-2 border border-[#1D53FF]">
        {loading ? (
          <span className="animate-pulse text-[#1D53FF] font-bold">Loading...</span>
        ) : (
          <>
            <button onClick={prev} className="text-[#1D53FF] text-xl" aria-label="Previous">
              ⏮
            </button>
            <button
              onClick={playPause}
              className="text-[#1D53FF] text-xl"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={next} className="text-[#1D53FF] text-xl" aria-label="Next">
              ⏭
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
            <div>
              {trackInfo.permalink_url ? (
                <a
                  href={trackInfo.permalink_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#1D53FF] hover:underline"
                >
                  {trackInfo.title}
                </a>
              ) : (
                <div className="font-bold text-[#1D53FF]">{trackInfo.title}</div>
              )}
              <div className="text-[#1D53FF]">{trackInfo.artist}</div>
            </div>
          </>
        )}
      </div>

      {/* Mobile sliding drawer */}
      <div className="min-[83rem]:hidden fixed bottom-10 right-0 z-50">
        <div
          className={`
            bg-[#cccccc] border border-[#1D53FF] rounded-l-md
            transition-transform duration-300 ease-in-out
            ${isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-48px)]'}
            flex items-center
          `}
        >
          {/* Toggle button (always visible) */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-12 flex items-center justify-center text-[#1D53FF] text-xl bg-[#cccccc] border-r border-[#1D53FF] rounded-l-md flex-shrink-0"
            aria-label={isExpanded ? 'Collapse player' : 'Expand player'}
          >
            {isExpanded ? '→' : '←'}
          </button>

          {/* Player content (slides in/out) */}
          <div className="flex items-center gap-2 px-3 py-2 min-w-0">
            {loading ? (
              <span className="animate-pulse text-[#1D53FF] font-bold text-sm whitespace-nowrap">
                Loading...
              </span>
            ) : (
              <>
                {/* Controls */}
                <div className="flex items-center gap-1">
                  <button onClick={prev} className="text-[#1D53FF] text-lg" aria-label="Previous">
                    ⏮
                  </button>
                  <button
                    onClick={playPause}
                    className="text-[#1D53FF] text-lg"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button onClick={next} className="text-[#1D53FF] text-lg" aria-label="Next">
                    ⏭
                  </button>
                </div>

                {/* Track info */}
                <div className="flex items-center gap-2 min-w-0">
                  {trackInfo.artwork && trackInfo.permalink_url && (
                    <a
                      href={trackInfo.permalink_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                      title={trackInfo.title}
                    >
                      <img src={trackInfo.artwork} alt="" className="w-8 h-8 rounded" />
                    </a>
                  )}
                  <div className="min-w-0 max-w-[120px]">
                    {trackInfo.permalink_url ? (
                      <a
                        href={trackInfo.permalink_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#1D53FF] hover:underline text-xs truncate block"
                      >
                        {trackInfo.title}
                      </a>
                    ) : (
                      <div className="font-bold text-[#1D53FF] text-xs truncate">
                        {trackInfo.title}
                      </div>
                    )}
                    <div className="text-[#1D53FF] text-xs truncate">{trackInfo.artist}</div>
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
