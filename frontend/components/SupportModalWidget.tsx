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
import {SiMinutemailer} from 'react-icons/si'
import {motion} from 'framer-motion'
import {useForm} from 'react-hook-form'
import {ThemeContext} from '@/app/ThemeProvider'
import {FormField} from '@/components/form/FormField'
import {TextInput} from '@/components/form/TextInput'
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

type NewsletterFormValues = {
  newsletterName: string
  newsletterEmail: string
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
  const [activeTab, setActiveTab] = useState<SupportTab>('newsletter')
  const [donationAmount, setDonationAmount] = useState('15')
  const [donationName, setDonationName] = useState('')
  const [donationEmail, setDonationEmail] = useState('')
  const [donationMessage, setDonationMessage] = useState('')
  const [donationError, setDonationError] = useState<string | null>(null)
  const [isDonationSubmitting, setIsDonationSubmitting] = useState(false)
  const [newsletterState, setNewsletterState] = useState<'idle' | 'success' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle')
  const [floatingPos, setFloatingPos] = useState<Point | null>(null)
  const [floatingCtaTab, setFloatingCtaTab] = useState<SupportTab>('newsletter')
  const floatingContainerRef = useRef<HTMLButtonElement>(null)
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
      '--panel-bg': '#D2D2D2',
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

  const {
    register: registerNewsletter,
    handleSubmit: handleNewsletterSubmit,
    reset: resetNewsletterForm,
    formState: {
      errors: newsletterFormErrors,
      touchedFields: newsletterTouchedFields,
      isSubmitted: isNewsletterSubmitted,
    },
  } = useForm<NewsletterFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      newsletterName: '',
      newsletterEmail: '',
    },
  })

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
    async ({newsletterName, newsletterEmail}: NewsletterFormValues) => {
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
        resetNewsletterForm()
      } catch (error) {
        setNewsletterState('error')
        setNewsletterMessage(
          error instanceof Error ? error.message : 'Unable to subscribe right now.',
        )
      } finally {
        setIsNewsletterSubmitting(false)
      }
    },
    [newsletterSuccessMessage, pathname, resetNewsletterForm],
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
      const MARGIN = 16

      setFloatingPos((prev) => {
        if (!prev) {
          // Init at bottom left on mobile.
          return {
            x: MARGIN,
            y: clamp(maxY - MARGIN, 0, maxY),
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

      // Disable transition while dragging but keep transform
      container.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease'
      container.style.transform = 'scale(1.05)'
      container.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'

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

    if (floatingContainerRef.current) {
      floatingContainerRef.current.style.left = `${nextX}px`
      floatingContainerRef.current.style.top = `${nextY}px`
    }
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

    if (dragRef.current.didDrag && floatingContainerRef.current) {
      const container = floatingContainerRef.current
      container.style.transition =
        'left 0.3s ease, top 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease'
      container.style.transform = 'scale(1)'
      container.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)'

      const {maxX, maxY} = dragRef.current.bounds
      const MARGIN = 16

      const rect = container.getBoundingClientRect()
      const midX = window.innerWidth / 2
      const midY = window.innerHeight / 2

      const dx = e.clientX - dragRef.current.startPointer.x
      const dy = e.clientY - dragRef.current.startPointer.y
      const FLICK_THRESHOLD = 30

      // Default target based on center of the screen
      let targetX = rect.left + rect.width / 2 < midX ? MARGIN : maxX - MARGIN
      let targetY = rect.top + rect.height / 2 < midY ? MARGIN : maxY - MARGIN

      // Override with flick direction if moved purposefully
      if (dx > FLICK_THRESHOLD) targetX = maxX - MARGIN
      else if (dx < -FLICK_THRESHOLD) targetX = MARGIN

      if (dy > FLICK_THRESHOLD) targetY = maxY - MARGIN
      else if (dy < -FLICK_THRESHOLD) targetY = MARGIN

      container.style.left = `${targetX}px`
      container.style.top = `${targetY}px`

      setFloatingPos({x: targetX, y: targetY})
    } else if (floatingContainerRef.current) {
      const container = floatingContainerRef.current
      container.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease'
      container.style.transform = 'scale(1)'
      container.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)'
    }
  }, [])

  const onFloatingClick = useCallback(() => {
    if (dragRef.current.didDrag) {
      dragRef.current.didDrag = false
      return
    }
    openModal('newsletter')
  }, [openModal])

  if (!isMounted) return null

  return createPortal(
    <>
      {/* Background Dimmer when open */}
      <div
        className={`fixed inset-0 z-[10000] bg-[var(--panel-fg)] transition-opacity duration-300 ${isOpen ? 'opacity-55' : 'opacity-0 pointer-events-none'}`}
        onClick={closeModal}
      />

      {/* Floating anchor button for Mobile */}
      {!isOpen && (
        <button
          ref={floatingContainerRef}
          className="min-[83rem]:hidden fixed z-[10002] flex items-center justify-center w-[40px] h-[40px] rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.15)] cursor-pointer select-none"
          style={{
            backgroundColor: 'var(--panel-fg)',
            color: 'var(--panel-bg)',
            left: floatingPos?.x,
            top: floatingPos?.y,
            touchAction: 'none',
          }}
          onPointerDown={onFloatingPointerDown}
          onPointerMove={onFloatingPointerMove}
          onPointerUp={onFloatingPointerUp}
          onClick={onFloatingClick}
        >
          <SiMinutemailer size={22} />
        </button>
      )}

      <div
        className={`hidden min-[83rem]:fixed min-[83rem]:z-[10001] min-[83rem]:flex min-[83rem]:max-h-[85vh] min-[83rem]:h-auto min-[83rem]:flex-col min-[83rem]:right-0 min-[83rem]:top-[15vh] xl:min-[83rem]:top-[20vh] min-[83rem]:max-w-md lg:min-[83rem]:max-w-lg min-[83rem]:w-full min-[83rem]:shadow-2xl min-[83rem]:transition-transform min-[83rem]:duration-[600ms] min-[83rem]:ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen ? 'min-[83rem]:translate-x-0' : 'min-[83rem]:translate-x-[calc(100%)]'
        }`}
      >
        <div className="hidden min-[83rem]:flex absolute left-[-48px] top-0 bottom-0 items-center justify-center pointer-events-none z-[52] w-[48px]">
          <div
            className="subnav-rounded-slot cursor-pointer pointer-events-auto h-[48px]"
            onClick={onFloatingClick}
            style={{
              transformOrigin: 'center center',
              transform: 'rotate(-90deg)',
              width: 'fit-content',
            }}
          >
            <div
              className="panel-tab-active subnav-rounded-tab subnav-rounded-tab--middle flex items-center justify-center"
              style={{
                height: '100%',
                width: '100%',
                padding: '0 14px',
              }}
            >
              <div className="font-normal text-[24px] tracking-normal mb-[2px] uppercase">
                {newsletterTabLabel || 'Newsletter'}
              </div>
            </div>
          </div>
        </div>

        <div
          className="panel-bg panel-fg relative w-full h-full xl:min-h-[50vh] overflow-y-auto min-[83rem]:rounded-l-3xl min-[83rem]:rounded-r-none p-8 pt-14 border-none"
          style={
            showDonationResultScreen
              ? {
                  backgroundColor: donationSuccess ? successTheme.bg : failedTheme.bg,
                  color: donationSuccess ? '#111111' : failedTheme.fg,
                }
              : undefined
          }
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full invert-panel cursor-pointer"
            type="button"
            aria-label="Close support modal"
          >
            <IoMdClose className="h-7 w-7" aria-hidden="true" />
          </button>

          {showDonationResultScreen ? (
            <div className="min-h-[320px] min-[83rem]:min-h-[420px] pb-14 min-[83rem]:pb-16 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl min-[83rem]:text-6xl tracking-tight">Thank you</h2>
              <p className="mt-4 text-xl min-[83rem]:text-2xl font-light">
                {donationSuccess
                  ? 'We have received your donation.'
                  : 'There was an issue processing your payment.'}
              </p>
              <button
                onClick={closeModal}
                className="mt-12 rounded-full border border-current px-8 py-3 text-lg hover:bg-current hover:text-[var(--panel-bg)] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-4xl min-[83rem]:text-5xl font-light tracking-tight mb-6">
                {content?.modalTitle || 'Support psst'}
              </h2>

              <div className="flex gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => openModal('donation')}
                  className={`border panel-border rounded-full px-4 py-1 text-sm min-[83rem]:text-base cursor-pointer ${
                    activeTab === 'donation' ? 'invert-panel' : ''
                  }`}
                >
                  {donationTabLabel || 'Donation'}
                </button>
                <button
                  type="button"
                  onClick={() => openModal('newsletter')}
                  className={`border panel-border rounded-full px-4 py-1 text-sm min-[83rem]:text-base cursor-pointer ${
                    activeTab === 'newsletter' ? 'invert-panel' : ''
                  }`}
                >
                  {newsletterTabLabel || 'Newsletter'}
                </button>
              </div>

              <div className="mt-4 text-[color:var(--panel-fg)]">
                {activeTab === 'donation' ? (
                  <form
                    onSubmit={onDonationSubmit}
                    className="space-y-4 pb-14 min-[83rem]:pb-16 flex flex-col"
                  >
                    {content?.donationIntro?.length ? (
                      <div className="space-y-2 mb-4">
                        <SupportRichText value={content.donationIntro} />
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2 mb-6">
                      {[5, 10, 20, 50].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setDonationAmount(preset.toString())}
                          className={`flex items-center justify-center w-12 h-12 min-[83rem]:w-14 min-[83rem]:h-14 text-lg min-[83rem]:text-xl rounded-full text-center transition-colors cursor-pointer ${
                            donationAmount === preset.toString()
                              ? 'invert-panel'
                              : 'bg-[#ECECEC] text-[var(--panel-fg)] hover:bg-[#d2d2d2]'
                          }`}
                        >
                          €{preset}
                        </button>
                      ))}
                    </div>

                    <FormField
                      label="Amount"
                      required
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        type="number"
                        min="1"
                        step="1"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        placeholder="Amount in EUR"
                        className="bg-transparent"
                      />
                    </FormField>

                    <FormField
                      label="Name"
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        type="text"
                        value={donationName}
                        onChange={(e) => setDonationName(e.target.value)}
                        placeholder="Name (optional)"
                        className="bg-transparent"
                      />
                    </FormField>

                    <FormField
                      label="E-mail"
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        type="email"
                        value={donationEmail}
                        onChange={(e) => setDonationEmail(e.target.value)}
                        placeholder="Email (optional)"
                        className="bg-transparent"
                      />
                    </FormField>

                    <FormField
                      label="Message"
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        isTextArea
                        value={donationMessage}
                        onChange={(e) => setDonationMessage(e.target.value)}
                        placeholder="Message (optional)"
                        maxLength={500}
                        className="bg-transparent h-24"
                      />
                    </FormField>

                    {donationError && (
                      <p className="text-red-600 text-sm min-[83rem]:text-base">{donationError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isDonationSubmitting}
                      className="mt-12 bg-(--panel-fg) text-(--panel-bg) text-3xl min-[83rem]:text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-40 h-40 min-[83rem]:w-64 min-[83rem]:h-64 rounded-full text-center mx-auto block disabled:opacity-50 cursor-pointer"
                    >
                      {isDonationSubmitting ? 'Redirecting...' : 'Pay'}
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={handleNewsletterSubmit(onNewsletterSubmit)}
                    className="space-y-4 pb-14 min-[83rem]:pb-16 flex flex-col"
                  >
                    <div className="space-y-2 mb-4">
                      {content?.newsletterIntro?.length ? (
                        <SupportRichText value={content.newsletterIntro} />
                      ) : (
                        <p className="text-sm min-[83rem]:text-lg leading-snug">
                          Subscribe to receive updates about events, merch, and presales.
                        </p>
                      )}
                    </div>

                    <FormField
                      label="Name"
                      error={newsletterFormErrors.newsletterName}
                      showError={!!newsletterTouchedFields.newsletterName || isNewsletterSubmitted}
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        registration={registerNewsletter('newsletterName')}
                        placeholder="Name (optional)"
                        className="bg-transparent"
                      />
                    </FormField>
                    <FormField
                      label="E-mail"
                      required
                      error={newsletterFormErrors.newsletterEmail}
                      showError={!!newsletterTouchedFields.newsletterEmail || isNewsletterSubmitted}
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        registration={registerNewsletter('newsletterEmail', {
                          required: 'E-mail is required',
                        })}
                        type="email"
                        placeholder="Email"
                        className="bg-transparent"
                      />
                    </FormField>

                    {newsletterState !== 'idle' && (
                      <p
                        className={`text-sm min-[83rem]:text-base ${newsletterState === 'success' ? 'text-green-700' : 'text-red-600'}`}
                      >
                        {newsletterMessage}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isNewsletterSubmitting}
                      className="mt-12 bg-(--panel-fg) text-(--panel-bg) text-3xl min-[83rem]:text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-40 h-40 min-[83rem]:w-64 min-[83rem]:h-64 rounded-full text-center mx-auto block disabled:opacity-50 cursor-pointer"
                    >
                      {isNewsletterSubmitting
                        ? 'Submitting...'
                        : newsletterSubmitLabel || 'Subscribe'}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="fixed inset-0 z-[10001] flex items-center justify-center px-4 pointer-events-none min-[83rem]:hidden">
        <div
          className={`panel-bg panel-fg pointer-events-auto relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[32px] shadow-2xl p-6 pt-14 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isOpen ? 'translate-y-0' : 'translate-y-[100vh]'
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
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full invert-panel cursor-pointer"
            type="button"
            aria-label="Close support modal"
          >
            <IoMdClose className="h-7 w-7" aria-hidden="true" />
          </button>

          {showDonationResultScreen ? (
            <div className="min-h-[320px] min-[83rem]:min-h-[420px] pb-14 min-[83rem]:pb-16 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl min-[83rem]:text-6xl tracking-tight">Thank you</h2>
              <p className="mt-4 text-xl min-[83rem]:text-2xl font-light">
                {donationSuccess
                  ? 'We have received your donation.'
                  : 'There was an issue processing your payment.'}
              </p>
              <button
                onClick={closeModal}
                className="mt-12 rounded-full border border-current px-8 py-3 text-lg hover:bg-current hover:text-[var(--panel-bg)] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-4xl min-[83rem]:text-5xl font-light tracking-tight mb-6">
                {content?.modalTitle || 'Support psst'}
              </h2>

              <div className="flex gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => openModal('donation')}
                  className={`border panel-border rounded-full px-4 py-1 text-sm min-[83rem]:text-base cursor-pointer ${
                    activeTab === 'donation' ? 'invert-panel' : ''
                  }`}
                >
                  {donationTabLabel || 'Donation'}
                </button>
                <button
                  type="button"
                  onClick={() => openModal('newsletter')}
                  className={`border panel-border rounded-full px-4 py-1 text-sm min-[83rem]:text-base cursor-pointer ${
                    activeTab === 'newsletter' ? 'invert-panel' : ''
                  }`}
                >
                  {newsletterTabLabel || 'Newsletter'}
                </button>
              </div>

              <div className="mt-4 text-[color:var(--panel-fg)]">
                {activeTab === 'donation' ? (
                  <form
                    onSubmit={onDonationSubmit}
                    className="space-y-4 pb-14 min-[83rem]:pb-16 flex flex-col"
                  >
                    {content?.donationIntro?.length ? (
                      <div className="space-y-2 mb-4">
                        <SupportRichText value={content.donationIntro} />
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2 mb-6">
                      {[5, 10, 20, 50].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setDonationAmount(preset.toString())}
                          className={`flex items-center justify-center w-12 h-12 min-[83rem]:w-14 min-[83rem]:h-14 text-lg min-[83rem]:text-xl rounded-full text-center transition-colors cursor-pointer ${
                            donationAmount === preset.toString()
                              ? 'invert-panel'
                              : 'bg-[#ECECEC] text-[var(--panel-fg)] hover:bg-[#d2d2d2]'
                          }`}
                        >
                          €{preset}
                        </button>
                      ))}
                    </div>

                    <FormField
                      label="Amount"
                      required
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        type="number"
                        min="1"
                        step="1"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        placeholder="Amount in EUR"
                        className="bg-transparent"
                      />
                    </FormField>

                    <FormField
                      label="Name"
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        type="text"
                        value={donationName}
                        onChange={(e) => setDonationName(e.target.value)}
                        placeholder="Name (optional)"
                        className="bg-transparent"
                      />
                    </FormField>

                    <FormField
                      label="E-mail"
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        type="email"
                        value={donationEmail}
                        onChange={(e) => setDonationEmail(e.target.value)}
                        placeholder="Email (optional)"
                        className="bg-transparent"
                      />
                    </FormField>

                    <FormField
                      label="Message"
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        isTextArea
                        value={donationMessage}
                        onChange={(e) => setDonationMessage(e.target.value)}
                        placeholder="Message (optional)"
                        maxLength={500}
                        className="bg-transparent h-24"
                      />
                    </FormField>

                    {donationError && (
                      <p className="text-red-600 text-sm min-[83rem]:text-base">{donationError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={isDonationSubmitting}
                      className="mt-12 bg-(--panel-fg) text-(--panel-bg) text-3xl min-[83rem]:text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-40 h-40 min-[83rem]:w-64 min-[83rem]:h-64 rounded-full text-center mx-auto block disabled:opacity-50 cursor-pointer"
                    >
                      {isDonationSubmitting ? 'Redirecting...' : 'Pay'}
                    </button>
                  </form>
                ) : (
                  <form
                    onSubmit={handleNewsletterSubmit(onNewsletterSubmit)}
                    className="space-y-4 pb-14 min-[83rem]:pb-16 flex flex-col"
                  >
                    <div className="space-y-2 mb-4">
                      {content?.newsletterIntro?.length ? (
                        <SupportRichText value={content.newsletterIntro} />
                      ) : (
                        <p className="text-sm min-[83rem]:text-lg leading-snug">
                          Subscribe to receive updates about events, merch, and presales.
                        </p>
                      )}
                    </div>

                    <FormField
                      label="Name"
                      error={newsletterFormErrors.newsletterName}
                      showError={!!newsletterTouchedFields.newsletterName || isNewsletterSubmitted}
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        registration={registerNewsletter('newsletterName')}
                        placeholder="Name (optional)"
                        className="bg-transparent"
                      />
                    </FormField>
                    <FormField
                      label="E-mail"
                      required
                      error={newsletterFormErrors.newsletterEmail}
                      showError={!!newsletterTouchedFields.newsletterEmail || isNewsletterSubmitted}
                      bgClassName="invert-panel"
                      fgClassName="text-white"
                      containerClassName="border-0 section-border"
                      contentClassName="bg-[#ECECEC]"
                    >
                      <TextInput
                        registration={registerNewsletter('newsletterEmail', {
                          required: 'E-mail is required',
                        })}
                        type="email"
                        placeholder="Email"
                        className="bg-transparent"
                      />
                    </FormField>

                    {newsletterState !== 'idle' && (
                      <p
                        className={`text-sm min-[83rem]:text-base ${newsletterState === 'success' ? 'text-green-700' : 'text-red-600'}`}
                      >
                        {newsletterMessage}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isNewsletterSubmitting}
                      className="mt-12 bg-(--panel-fg) text-(--panel-bg) text-3xl min-[83rem]:text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-40 h-40 min-[83rem]:w-64 min-[83rem]:h-64 rounded-full text-center mx-auto block disabled:opacity-50 cursor-pointer"
                    >
                      {isNewsletterSubmitting
                        ? 'Submitting...'
                        : newsletterSubmitLabel || 'Subscribe'}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>,
    document.body,
  )
}
