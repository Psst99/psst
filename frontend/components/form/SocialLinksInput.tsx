import React, {useState, useRef, useEffect} from 'react'
import {Control, Controller} from 'react-hook-form'
import {IoMdClose} from 'react-icons/io'
import {motion} from 'framer-motion'

interface SocialLinksInputProps {
  name: string
  control: Control<any>
}

export const SocialLinksInput: React.FC<SocialLinksInputProps> = ({name, control}) => {
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [urlError, setUrlError] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  const rootRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const detectPlatform = (url: string): string => {
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

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError('')
      return false
    }

    try {
      new URL(url)
      setUrlError('')
      return true
    } catch {
      setUrlError('Please enter a valid URL')
      return false
    }
  }

  const close = () => {
    setIsOpen(false)
    setNewLinkUrl('')
    setUrlError('')
  }

  // Outside click + Escape close
  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (e: PointerEvent) => {
      const root = rootRef.current
      if (!root) return
      if (!root.contains(e.target as Node)) close()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (!isOpen) return
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [isOpen])

  return (
    <Controller
      name={name}
      control={control}
      render={({field: {value, onChange}}) => {
        const addLink = () => {
          if (!newLinkUrl.trim()) return

          if (validateUrl(newLinkUrl)) {
            onChange([...(value || []), newLinkUrl])
            setNewLinkUrl('')
            setUrlError('')
          }
        }

        const removeLink = (index: number) => {
          onChange(value?.filter((_: string, i: number) => i !== index) || [])
        }

        const hasLinks = (value?.length ?? 0) > 0

        const openInput = () => {
          setIsOpen(true)
          requestAnimationFrame(() => inputRef.current?.focus())
        }

        const handlePrimaryClick = () => {
          if (!isOpen) {
            openInput()
            return
          }
          addLink()
        }

        return (
          <div ref={rootRef} className="bg-white p-4">
            {hasLinks && (
              <div className="flex items-center gap-2 py-2">
                <div className="flex flex-wrap gap-2 flex-1">
                  {value.map((url: string, index: number) => (
                    <span
                      key={index}
                      className="px-1 py-0 border-[var(--section-bg)] border text-[color:var(--section-bg)] rounded-md font-mono text-2xl tracking-tighter leading-tight inline-flex items-center gap-x-2"
                    >
                      {detectPlatform(url)}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeLink(index)
                        }}
                        className="text-current"
                      >
                        <IoMdClose className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsOpen((v) => {
                      const next = !v
                      if (v === true && next === false) close()
                      if (v === false && next === true) openInput()
                      return next
                    })
                  }}
                  className="text-[color:var(--section-bg)] text-lg select-none flex-shrink-0 cursor-pointer"
                  animate={{rotate: isOpen ? 180 : 0}}
                  transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}
                  aria-label={isOpen ? 'Close' : 'Open'}
                >
                  ▼
                </motion.button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1">
                {!isOpen ? (
                  !hasLinks ? (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={openInput}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          openInput()
                        }
                      }}
                      className="w-full text-left bg-transparent py-2 cursor-pointer"
                    >
                      <span className="font-normal text-2xl md:text-3xl text-[color:var(--section-bg)] opacity-60">
                        Paste your link(s)
                      </span>
                    </div>
                  ) : null
                ) : (
                  <input
                    ref={inputRef}
                    type="text"
                    value={newLinkUrl}
                    onChange={(e) => {
                      setNewLinkUrl(e.target.value)
                      if (urlError) setUrlError('')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.preventDefault()
                        close()
                        return
                      }
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addLink()
                      }
                    }}
                    onBlur={() => {
                      if (newLinkUrl.trim()) {
                        validateUrl(newLinkUrl)
                      }
                    }}
                    placeholder="Paste your link(s)"
                    className="w-full bg-transparent outline-none text-[color:var(--section-bg)] font-normal text-2xl md:text-3xl placeholder:opacity-60 border-0 border-b border-b-[color:var(--section-bg)] py-2"
                  />
                )}
              </div>

              {!hasLinks ? (
                <button
                  type="button"
                  onClick={handlePrimaryClick}
                  className="w-10 h-10 rounded-full bg-[var(--section-bg)] text-[color:var(--section-fg)] flex items-center justify-center text-2xl font-light hover:opacity-90 transition-opacity flex-shrink-0"
                  aria-label="Add link"
                >
                  +
                </button>
              ) : isOpen ? (
                <button
                  type="button"
                  onClick={addLink}
                  className="w-10 h-10 rounded-full bg-[var(--section-bg)] text-[color:var(--section-fg)] flex items-center justify-center text-2xl font-light hover:opacity-90 transition-opacity flex-shrink-0"
                  aria-label="Add link"
                >
                  +
                </button>
              ) : null}
            </div>

            {urlError && isOpen && (
              <p className="text-red-500 text-lg mt-2 ml-1">
                <span className="mr-0.5">*</span>
                {urlError}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
