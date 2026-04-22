import React, {useState, useRef, useEffect} from 'react'
import {Control, Controller} from 'react-hook-form'
import {IoMdClose} from 'react-icons/io'
import {motion} from 'framer-motion'
import {isValidUrl, normalizeUrlInput} from '@/lib/url'

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
      const domain = new URL(normalizeUrlInput(url)).hostname.replace('www.', '')
      return domain.charAt(0).toUpperCase() + domain.slice(1)
    } catch {
      return 'Website'
    }
  }

  const validateUrl = (url: string): string | null => {
    if (!url.trim()) {
      setUrlError('')
      return null
    }

    const normalizedUrl = normalizeUrlInput(url)
    if (isValidUrl(normalizedUrl)) {
      setUrlError('')
      return normalizedUrl
    }

    setUrlError('Please enter a valid URL')
    return null
  }

  const close = () => {
    setIsOpen(false)
    setNewLinkUrl('')
    setUrlError('')
  }

  // Outside click + Escape close
  useEffect(() => {
    if (!isOpen) return

    const onClick = (e: MouseEvent) => {
      const root = rootRef.current
      if (!root) return
      if (!root.contains(e.target as Node)) close()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    window.addEventListener('click', onClick)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('click', onClick)
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
      render={({field: {value, onChange, onBlur}}) => {
        const addLinksFromText = (text: string) => {
          const rawLinks = text
            .split(/[\s,]+/)
            .map((link) => link.trim())
            .filter(Boolean)

          if (!rawLinks.length) return false

          const nextLinks = [...(value || [])]
          const invalidLinks: string[] = []

          rawLinks.forEach((rawLink) => {
            const normalizedUrl = validateUrl(rawLink)
            if (!normalizedUrl) {
              invalidLinks.push(rawLink)
              return
            }

            if (!nextLinks.includes(normalizedUrl)) {
              nextLinks.push(normalizedUrl)
            }
          })

          if (nextLinks.length !== (value?.length ?? 0)) {
            onChange(nextLinks)
          }

          if (invalidLinks.length > 0) {
            setNewLinkUrl(invalidLinks.join(' '))
            setUrlError('Please enter a valid URL')
            return false
          }

          setNewLinkUrl('')
          setUrlError('')
          return true
        }

        const addLink = () => {
          if (!newLinkUrl.trim()) return false
          return addLinksFromText(newLinkUrl)
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
          if (newLinkUrl.trim()) {
            addLink()
            return
          }

          if (!isOpen) {
            openInput()
            return
          }
          addLink()
        }

        const shouldShowInput = isOpen || !hasLinks

        return (
          <div ref={rootRef} className="bg-white p-4">
            {hasLinks && (
              <div className="flex items-center gap-2 py-2">
                <div className="flex flex-wrap gap-2 flex-1">
                  {value.map((url: string, index: number) => (
                    <span
                      key={index}
                      className="px-1 py-0 border-[var(--section-bg)] border text-[color:var(--section-bg)] rounded-md font-mono text-xl min-[69.375rem]:text-2xl tracking-tighter leading-tight inline-flex items-center gap-x-2"
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
                {shouldShowInput ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={newLinkUrl}
                    onFocus={() => setIsOpen(true)}
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
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData('text')
                      if (!pastedText.trim()) return

                      e.preventDefault()
                      addLinksFromText(pastedText)
                    }}
                    onBlur={() => {
                      if (newLinkUrl.trim()) {
                        addLink()
                      }
                      onBlur()
                    }}
                    placeholder="Paste your link(s)"
                    className="w-full bg-transparent outline-none text-[color:var(--section-bg)] font-normal text-xl min-[69.375rem]:text-3xl placeholder:opacity-60 border-0 border-b border-b-[color:var(--section-bg)] py-2"
                  />
                ) : null}
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
