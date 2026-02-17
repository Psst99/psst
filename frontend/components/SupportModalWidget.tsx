'use client'

import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent,
} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import {motion} from 'framer-motion'
import {ThemeContext} from '@/app/ThemeProvider'
import {getTheme} from '@/lib/theme/sections'
import {LINK_PILL_CLASS} from '@/lib/linkStyles'

type CSSVars = CSSProperties & Record<`--${string}`, string>
type SupportTab = 'donation' | 'newsletter'
type Point = {x: number; y: number}

type SupportContent = {
  floatingButtonLabel?: string
  modalTitle?: string
  modalSubtitle?: any[]
  shareButtonLabel?: string
  donationTabLabel?: string
  newsletterTabLabel?: string
  donationIntro?: any[]
  newsletterIntro?: any[]
  donationSubmitLabel?: string
  newsletterSubmitLabel?: string
  donationSuccessMessage?: string
  newsletterSuccessMessage?: string
} | null

interface SupportModalWidgetProps {
  content?: SupportContent
}

const SUPPORT_PARAM = 'support'
const SUPPORT_TAB_PARAM = 'supportTab'
const DONATION_STATUS_PARAM = 'donation'
const OPEN_VALUE = 'open'
const FLOATING_CTA_ROTATION_MS = 5_000
const MENU_TWEEN = {duration: 0.5, type: 'tween' as const, ease: [0.76, 0, 0.24, 1] as const}

const richTextComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="text-sm min-[83rem]:text-lg leading-snug">{children}</p>,
    h2: ({children}) => <h3 className="text-xl min-[83rem]:text-2xl leading-tight">{children}</h3>,
  },
  marks: {
    link: ({children, value}) => {
      const {linkType, href, openInNewTab} = value || {}
      if (linkType === 'href' && href) {
        return (
          <a
            href={href}
            target={openInNewTab ? '_blank' : '_self'}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
            className={LINK_PILL_CLASS}
          >
            {children}
          </a>
        )
      }
      return <span>{children}</span>
    },
  },
}

function SupportRichText({value}: {value?: any[]}) {
  if (!value || value.length === 0) return null
  return <PortableText value={value} components={richTextComponents} />
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function getFloatingOffsets() {
  if (typeof window === 'undefined') return {left: 16, bottom: 24}
  const isLarge = window.matchMedia('(min-width: 83rem)').matches
  return {left: isLarge ? 32 : 16, bottom: isLarge ? 32 : 24}
}

function LabelLines({label}: {label: string}) {
  return (
    <>
      {label.split('\n').map((line, index) => (
        <span key={`${line}-${index}`} className="block">
          {line}
        </span>
      ))}
    </>
  )
}

export default function SupportModalWidget({content = null}: SupportModalWidgetProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ctx = useContext(ThemeContext)
  const mode = ctx?.mode ?? 'brand'
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<SupportTab>('donation')
  const [donationAmount, setDonationAmount] = useState('15')
  const [donationName, setDonationName] = useState('')
  const [donationEmail, setDonationEmail] = useState('')
  const [donationMessage, setDonationMessage] = useState('')
  const [donationError, setDonationError] = useState<string | null>(null)
  const [isDonationSubmitting, setIsDonationSubmitting] = useState(false)
  const [newsletterName, setNewsletterName] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState<'idle' | 'success' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle')
  const [floatingPos, setFloatingPos] = useState<Point | null>(null)
  const [floatingCtaTab, setFloatingCtaTab] = useState<SupportTab>('donation')
  const floatingContainerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    dragging: boolean
    didDrag: boolean
    startPointer: Point
    startPos: Point
    bounds: {maxX: number; maxY: number}
  }>({
    dragging: false,
    didDrag: false,
    startPointer: {x: 0, y: 0},
    startPos: {x: 0, y: 0},
    bounds: {maxX: 0, maxY: 0},
  })

  const isOpen = searchParams.get(SUPPORT_PARAM) === OPEN_VALUE
  const donationStatus = searchParams.get(DONATION_STATUS_PARAM)
  const tabFromUrl = searchParams.get(SUPPORT_TAB_PARAM)
  const donationSuccess = donationStatus === 'success'
  const donationFailed =
    donationStatus === 'failed' ||
    donationStatus === 'canceled' ||
    donationStatus === 'cancelled' ||
    donationStatus === 'expired'
  const showDonationResultScreen = donationSuccess || donationFailed
  const modalTitle = content?.modalTitle?.trim() || 'Support PSST'
  const shareButtonLabel = content?.shareButtonLabel?.trim() || 'Share'
  const donationTabLabel = content?.donationTabLabel?.trim() || 'Make a donation'
  const newsletterTabLabel = content?.newsletterTabLabel?.trim() || 'Newsletter'
  const donationSubmitLabel = content?.donationSubmitLabel?.trim() || 'Continue to payment'
  const newsletterSubmitLabel = content?.newsletterSubmitLabel?.trim() || 'Subscribe'
  const donationSuccessMessage =
    content?.donationSuccessMessage?.trim() ||
    'Donation payment completed. Thank you for supporting PSST.'
  const newsletterSuccessMessage =
    content?.newsletterSuccessMessage?.trim() || 'Thanks, you are subscribed.'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (tabFromUrl === 'donation' || tabFromUrl === 'newsletter') {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (isOpen) {
      timer = setTimeout(() => setIsVisible(true), 100)
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      document.body.style.overflow = ''
      setDonationError(null)
      setShareState('idle')
    }

    return () => {
      if (timer) clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const updateSearchParams = useCallback(
    (update: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString())
      update(next)
      const query = next.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {scroll: false})
    },
    [pathname, router, searchParams],
  )

  const openModal = useCallback(
    (tab: SupportTab) => {
      setActiveTab(tab)
      setFloatingCtaTab(tab)
      updateSearchParams((next) => {
        next.set(SUPPORT_PARAM, OPEN_VALUE)
        next.set(SUPPORT_TAB_PARAM, tab)
        next.delete(DONATION_STATUS_PARAM)
      })
    },
    [updateSearchParams],
  )

  const closeModal = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      updateSearchParams((next) => {
        next.delete(SUPPORT_PARAM)
        next.delete(SUPPORT_TAB_PARAM)
        next.delete(DONATION_STATUS_PARAM)
      })
    }, 300)
  }, [updateSearchParams])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeModal, isOpen])

  const theme = getTheme('home', mode, ctx?.themeOverrides)
  const successTheme = getTheme('pssound-system', mode, ctx?.themeOverrides)
  const failedTheme = getTheme('workshops', mode, ctx?.themeOverrides)
  const floatingButtonBg = theme.fg
  const floatingButtonFg = theme.bg
  const modalVars: CSSVars = useMemo(
    () => ({
      '--section-bg': theme.bg,
      '--section-fg': theme.fg,
      '--panel-bg': '#FFFFFF',
      '--panel-fg': '#111111',
    }),
    [theme.bg, theme.fg],
  )

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const params = new URLSearchParams()
    params.set(SUPPORT_PARAM, OPEN_VALUE)
    params.set(SUPPORT_TAB_PARAM, activeTab)
    return `${window.location.origin}/?${params.toString()}`
  }, [activeTab])

  const onDonationSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setDonationError(null)

      const amount = Number(donationAmount)
      if (!Number.isFinite(amount) || amount <= 0) {
        setDonationError('Please enter a valid donation amount.')
        return
      }

      setIsDonationSubmitting(true)
      try {
        const redirectPath = `${pathname}?${new URLSearchParams({
          [SUPPORT_PARAM]: OPEN_VALUE,
          [SUPPORT_TAB_PARAM]: 'donation',
          [DONATION_STATUS_PARAM]: 'success',
        }).toString()}`

        const response = await fetch('/api/payments/mollie/donation', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            amount,
            name: donationName,
            email: donationEmail,
            message: donationMessage,
            redirectPath,
          }),
        })

        const payload = (await response.json()) as {
          success: boolean
          checkoutUrl?: string
          error?: string
        }
        if (!response.ok || !payload.success || !payload.checkoutUrl) {
          setDonationError(payload.error ?? 'Unable to start payment.')
          return
        }

        window.location.href = payload.checkoutUrl
      } catch (error) {
        setDonationError(error instanceof Error ? error.message : 'Unable to start payment.')
      } finally {
        setIsDonationSubmitting(false)
      }
    },
    [donationAmount, donationEmail, donationMessage, donationName, pathname],
  )

  const onNewsletterSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setNewsletterState('idle')
      setNewsletterMessage('')
      setIsNewsletterSubmitting(true)

      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            name: newsletterName,
            email: newsletterEmail,
            sourcePath: pathname,
          }),
        })

        const payload = (await response.json()) as {success: boolean; error?: string}
        if (!response.ok || !payload.success) {
          setNewsletterState('error')
          setNewsletterMessage(payload.error ?? 'Unable to subscribe right now.')
          return
        }

        setNewsletterState('success')
        setNewsletterMessage(newsletterSuccessMessage)
        setNewsletterEmail('')
        setNewsletterName('')
      } catch (error) {
        setNewsletterState('error')
        setNewsletterMessage(
          error instanceof Error ? error.message : 'Unable to subscribe right now.',
        )
      } finally {
        setIsNewsletterSubmitting(false)
      }
    },
    [newsletterEmail, newsletterName, newsletterSuccessMessage, pathname],
  )

  const onCopyShareLink = useCallback(async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareState('copied')
    } catch {
      setShareState('error')
    }
  }, [shareUrl])

  const retryDonation = useCallback(() => {
    setActiveTab('donation')
    updateSearchParams((next) => {
      next.set(SUPPORT_PARAM, OPEN_VALUE)
      next.set(SUPPORT_TAB_PARAM, 'donation')
      next.delete(DONATION_STATUS_PARAM)
    })
  }, [updateSearchParams])

  useEffect(() => {
    if (!isMounted) return
    const container = floatingContainerRef.current
    if (!container) return

    const updateInitialOrClamp = () => {
      const rect = container.getBoundingClientRect()
      const maxX = Math.max(0, window.innerWidth - rect.width)
      const maxY = Math.max(0, window.innerHeight - rect.height)

      setFloatingPos((prev) => {
        if (!prev) {
          const {left, bottom} = getFloatingOffsets()
          return {
            x: clamp(left, 0, maxX),
            y: clamp(window.innerHeight - bottom - rect.height, 0, maxY),
          }
        }
        return {x: clamp(prev.x, 0, maxX), y: clamp(prev.y, 0, maxY)}
      })
    }

    updateInitialOrClamp()
    window.addEventListener('resize', updateInitialOrClamp)
    return () => window.removeEventListener('resize', updateInitialOrClamp)
  }, [isMounted])

  const onFloatingPointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (isOpen || !floatingPos) return

      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)

      const container = floatingContainerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const maxX = Math.max(0, window.innerWidth - rect.width)
      const maxY = Math.max(0, window.innerHeight - rect.height)

      dragRef.current = {
        dragging: true,
        didDrag: false,
        startPointer: {x: e.clientX, y: e.clientY},
        startPos: {x: floatingPos.x, y: floatingPos.y},
        bounds: {maxX, maxY},
      }

      document.body.style.userSelect = 'none'
    },
    [floatingPos, isOpen],
  )

  const onFloatingPointerMove = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.dragging) return
    e.preventDefault()

    const dx = e.clientX - dragRef.current.startPointer.x
    const dy = e.clientY - dragRef.current.startPointer.y

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.didDrag = true
    }

    const nextX = clamp(dragRef.current.startPos.x + dx, 0, dragRef.current.bounds.maxX)
    const nextY = clamp(dragRef.current.startPos.y + dy, 0, dragRef.current.bounds.maxY)

    setFloatingPos({x: nextX, y: nextY})
  }, [])

  const onFloatingPointerUp = useCallback((e: PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.dragging) return
    dragRef.current.dragging = false
    document.body.style.userSelect = ''

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }, [])

  const onFloatingClick = useCallback(() => {
    if (dragRef.current.didDrag) {
      dragRef.current.didDrag = false
      return
    }
    openModal(floatingCtaTab)
  }, [floatingCtaTab, openModal])

  useEffect(() => {
    const id = window.setInterval(() => {
      setFloatingCtaTab((prev) => (prev === 'donation' ? 'newsletter' : 'donation'))
    }, FLOATING_CTA_ROTATION_MS)

    return () => window.clearInterval(id)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <div
        ref={floatingContainerRef}
        className="support-widget-fixed fixed z-[51]"
        style={floatingPos ? {left: floatingPos.x, top: floatingPos.y} : {left: 16, bottom: 24}}
      >
        <button
          type="button"
          onClick={onFloatingClick}
          onPointerDown={onFloatingPointerDown}
          onPointerMove={onFloatingPointerMove}
          onPointerUp={onFloatingPointerUp}
          onPointerCancel={onFloatingPointerUp}
          className={`cursor-pointer touch-none select-none w-36 h-36 min-[83rem]:w-48 min-[83rem]:h-48 rounded-full text-[18px] min-[83rem]:text-[28px] leading-[1.05] text-center px-4 font-medium transition-opacity ${
            isOpen ? 'pointer-events-none' : ''
          }`}
          style={{
            backgroundColor: floatingButtonBg,
            color: floatingButtonFg,
            border: mode === 'accessible' ? `1px solid ${floatingButtonFg}` : undefined,
          }}
        >
          <span className="sr-only">
            {floatingCtaTab === 'donation' ? donationTabLabel : newsletterTabLabel}
          </span>
          <span className="relative block h-[2.3em] overflow-hidden" aria-hidden="true">
            <motion.span
              className="absolute inset-0 block h-[200%]"
              animate={{top: floatingCtaTab === 'donation' ? '0%' : '-100%'}}
              transition={MENU_TWEEN}
            >
              <span className="flex h-1/2 items-center justify-center overflow-hidden">
                <LabelLines label={donationTabLabel} />
              </span>
              <span className="flex h-1/2 items-center justify-center overflow-hidden">
                <LabelLines label={newsletterTabLabel} />
              </span>
            </motion.span>
          </span>
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={modalVars}
          >
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                isVisible ? 'opacity-55' : 'opacity-0'
              }`}
              style={{backgroundColor: 'var(--panel-fg)'}}
              onClick={closeModal}
            />

            <div
              className={`relative panel-bg panel-fg w-full max-w-3xl rounded-3xl p-6 min-[83rem]:p-8 transition-transform duration-300 ease-out ${
                isVisible ? 'translate-y-0' : 'translate-y-[100vh]'
              }`}
              style={
                showDonationResultScreen
                  ? {
                      backgroundColor: donationSuccess ? successTheme.bg : failedTheme.bg,
                      color: donationSuccess ? '#111111' : failedTheme.fg,
                    }
                  : undefined
              }
            >
              {showDonationResultScreen ? (
                <div className="min-h-[320px] min-[83rem]:min-h-[420px] pb-14 min-[83rem]:pb-16 flex flex-col items-center justify-center text-center px-4">
                  <h2 className="text-4xl min-[83rem]:text-6xl tracking-tight">Thank you</h2>
                  <p className="mt-4 text-lg min-[83rem]:text-2xl max-w-xl leading-tight">
                    {donationSuccess
                      ? donationSuccessMessage
                      : 'Payment not completed. If you want, you can try again.'}
                  </p>
                  {donationFailed && (
                    <button
                      type="button"
                      onClick={retryDonation}
                      className="mt-8 border rounded-full px-6 py-2 text-base min-[83rem]:text-lg cursor-pointer"
                      style={{
                        borderColor: failedTheme.fg,
                        color: failedTheme.fg,
                      }}
                    >
                      Try again
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="min-w-0">
                      <h2 className="text-2xl min-[83rem]:text-4xl tracking-tight">{modalTitle}</h2>
                      <div className="mt-2 space-y-2 text-[color:var(--panel-fg)]">
                        <SupportRichText value={content?.modalSubtitle} />
                      </div>
                    </div>

                    {/* <button
                      type="button"
                      onClick={onCopyShareLink}
                      className="border panel-border rounded-full px-4 py-1 text-sm min-[83rem]:text-base cursor-pointer whitespace-nowrap"
                    >
                      {shareState === 'copied'
                        ? 'Link copied'
                        : shareState === 'error'
                          ? 'Copy failed'
                          : shareButtonLabel}
                    </button> */}
                  </div>

                  <div className="flex gap-2 mb-5">
                    <button
                      type="button"
                      onClick={() => openModal('donation')}
                      className={`border panel-border rounded-full px-4 py-1 text-sm min-[83rem]:text-base cursor-pointer ${
                        activeTab === 'donation' ? 'invert-panel' : ''
                      }`}
                    >
                      {donationTabLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => openModal('newsletter')}
                      className={`border panel-border rounded-full px-4 py-1 text-sm min-[83rem]:text-base cursor-pointer ${
                        activeTab === 'newsletter' ? 'invert-panel' : ''
                      }`}
                    >
                      {newsletterTabLabel}
                    </button>
                  </div>

                  {activeTab === 'donation' ? (
                    <form onSubmit={onDonationSubmit} className="space-y-3 pb-14 min-[83rem]:pb-16">
                      <div className="space-y-2 text-[color:var(--panel-fg)]">
                        {content?.donationIntro?.length ? (
                          <SupportRichText value={content.donationIntro} />
                        ) : (
                          <p className="text-sm min-[83rem]:text-lg leading-snug">
                            Donations now. Tickets and merch later.
                          </p>
                        )}
                      </div>

                      <div className="text-sm min-[83rem]:text-base">Donation amount (EUR)</div>
                      <div className="flex flex-wrap gap-2">
                        {[5, 10, 20, 50].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setDonationAmount(String(preset))}
                            className={`border panel-border rounded-full px-4 py-1 cursor-pointer ${
                              donationAmount === String(preset) ? 'invert-panel' : ''
                            }`}
                          >
                            {preset} EUR
                          </button>
                        ))}
                      </div>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full border panel-border rounded-md px-3 py-2 bg-transparent"
                        placeholder="Amount in EUR"
                        required
                      />

                      <input
                        type="text"
                        value={donationName}
                        onChange={(e) => setDonationName(e.target.value)}
                        className="w-full border panel-border rounded-md px-3 py-2 bg-transparent"
                        placeholder="Name (optional)"
                      />

                      <input
                        type="email"
                        value={donationEmail}
                        onChange={(e) => setDonationEmail(e.target.value)}
                        className="w-full border panel-border rounded-md px-3 py-2 bg-transparent"
                        placeholder="Email (optional, for confirmation)"
                      />

                      <textarea
                        value={donationMessage}
                        onChange={(e) => setDonationMessage(e.target.value)}
                        className="w-full border panel-border rounded-md px-3 py-2 bg-transparent min-h-24"
                        placeholder="Message (optional)"
                        maxLength={500}
                      />

                      {donationError && (
                        <p className="text-red-600 text-sm min-[83rem]:text-base">
                          {donationError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isDonationSubmitting}
                        className="invert-panel w-full rounded-full px-6 py-3 text-lg cursor-pointer disabled:opacity-60"
                      >
                        {isDonationSubmitting ? 'Redirecting to Mollie...' : donationSubmitLabel}
                      </button>
                    </form>
                  ) : (
                    <form
                      onSubmit={onNewsletterSubmit}
                      className="space-y-3 pb-14 min-[83rem]:pb-16"
                    >
                      <div className="space-y-2 text-[color:var(--panel-fg)]">
                        {content?.newsletterIntro?.length ? (
                          <SupportRichText value={content.newsletterIntro} />
                        ) : (
                          <p className="text-sm min-[83rem]:text-lg leading-snug">
                            Subscribe to receive updates about events, merch, and presales.
                          </p>
                        )}
                      </div>

                      <input
                        type="text"
                        value={newsletterName}
                        onChange={(e) => setNewsletterName(e.target.value)}
                        className="w-full border panel-border rounded-md px-3 py-2 bg-transparent"
                        placeholder="Name (optional)"
                      />

                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="w-full border panel-border rounded-md px-3 py-2 bg-transparent"
                        placeholder="Email"
                        required
                      />

                      {newsletterState !== 'idle' && (
                        <p
                          className={`text-sm min-[83rem]:text-base ${
                            newsletterState === 'success' ? 'text-green-700' : 'text-red-600'
                          }`}
                        >
                          {newsletterMessage}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isNewsletterSubmitting}
                        className="invert-panel w-full rounded-full px-6 py-3 text-lg cursor-pointer disabled:opacity-60"
                      >
                        {isNewsletterSubmitting ? 'Submitting...' : newsletterSubmitLabel}
                      </button>
                    </form>
                  )}
                </>
              )}

              <div className="absolute bottom-4 right-1/2 translate-x-1/2 rounded-full invert-panel">
                <button onClick={closeModal} className="text-3xl cursor-pointer" type="button">
                  <IoMdClose className="h-12 w-12 mt-0 -mb-1 mx-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
