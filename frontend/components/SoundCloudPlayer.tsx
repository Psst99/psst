'use client'

import { useEffect, useRef } from 'react'

export default function SoundCloudPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Only run on client
    const script = document.createElement('script')
    script.src = 'https://w.soundcloud.com/player/api.js'
    script.onload = () => {
      // @ts-ignore
      const widget = window.SC.Widget(iframeRef.current)
      widget.bind('ready', () => {
        console.log('SoundCloud widget ready')
      })
    }
    document.body.appendChild(script)
  }, [])

  return (
    <div className='fixed bottom-4 right-4 z-50 w-80 shadow-xl rounded-2xl overflow-hidden border border-neutral-200 bg-white'>
      <iframe
        ref={iframeRef}
        width='100%'
        height='120'
        scrolling='no'
        frameBorder='no'
        allow='autoplay'
        src='https://w.soundcloud.com/player/?url=https://soundcloud.com/soundcloud-hustle/sets/boomin-feel-good-hip-hop&color=%23ff5500&inverse=false&auto_play=false&show_user=true'
      ></iframe>
    </div>
  )
}
