'use client'

import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import {SiMinutemailer} from 'react-icons/si'
import {useForm} from 'react-hook-form'
import {ThemeContext} from '@/app/ThemeProvider'
import {FormField} from '@/components/form/FormField'
import {TextInput} from '@/components/form/TextInput'
import {getTheme} from '@/lib/theme/sections'
import {LINK_PILL_CLASS} from '@/lib/linkStyles'

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

const richTextComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="text-sm min-[83rem]:text-xl leading-snug">{children}</p>,
    h2: ({children}) => <h3 className="text-xl min-[83rem]:text-3xl leading-tight">{children}</h3>,
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
  const [floatingPos, setFloatingPos] = useState<Point | null>(null)
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
  const donationTabLabel = content?.donationTabLabel?.trim() || 'Make a donation'
  const newsletterTabLabel = content?.newsletterTabLabel?.trim() || 'Newsletter'
  const donationSubmitLabel = content?.donationSubmitLabel?.trim() || 'Pay'
  const newsletterSubmitLabel = content?.newsletterSubmitLabel?.trim() || 'Subscribe'
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

  useEffect(() => {
    if (!isMounted) return
    const container = floatingContainerRef.current
    if (!container) return

    const updateInitialOrClamp = () => {
      const rect = container.getBoundingClientRect()
      const maxX = Math.max(0, window.innerWidth - rect.width)
      const maxY = Math.max(0, window.innerHeight - rect.height)
      const margin = window.matchMedia('(min-width: 83rem)').matches ? 24 : 16

      setFloatingPos((prev) => {
        if (!prev) {
          return {
            x: margin,
            y: clamp(maxY - margin, 0, maxY),
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
      const margin = window.matchMedia('(min-width: 83rem)').matches ? 24 : 16
      const rect = container.getBoundingClientRect()
      const midX = window.innerWidth / 2
      const midY = window.innerHeight / 2
      const dx = e.clientX - dragRef.current.startPointer.x
      const dy = e.clientY - dragRef.current.startPointer.y
      const flickThreshold = 30

      let targetX = rect.left + rect.width / 2 < midX ? margin : Math.max(margin, maxX - margin)
      let targetY = rect.top + rect.height / 2 < midY ? margin : Math.max(margin, maxY - margin)

      if (dx > flickThreshold) targetX = Math.max(margin, maxX - margin)
      else if (dx < -flickThreshold) targetX = margin

      if (dy > flickThreshold) targetY = Math.max(margin, maxY - margin)
      else if (dy < -flickThreshold) targetY = margin

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
      <div
        className={`fixed inset-0 z-[10000] bg-[var(--panel-fg)] transition-opacity duration-300 ${
          isVisible ? 'opacity-55' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeModal}
      />

      {!isOpen && (
        <button
          ref={floatingContainerRef}
          className="support-widget-fixed fixed z-[10002] flex items-center justify-center w-[40px] h-[40px] min-[83rem]:w-[56px] min-[83rem]:h-[56px] rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.15)] cursor-pointer select-none"
          style={{
            backgroundColor: theme.fg,
            color: theme.bg,
            left: floatingPos?.x,
            top: floatingPos?.y,
            touchAction: 'none',
          }}
          onPointerDown={onFloatingPointerDown}
          onPointerMove={onFloatingPointerMove}
          onPointerUp={onFloatingPointerUp}
          onClick={onFloatingClick}
        >
          <SiMinutemailer className="h-[22px] w-[22px] min-[83rem]:h-[30px] min-[83rem]:w-[30px]" />
        </button>
      )}

      <div
        className={`fixed inset-0 z-[10001] flex items-center justify-center p-4 ${
          isVisible ? '' : 'pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            isVisible ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          style={{backgroundColor: 'var(--panel-fg)'}}
          onClick={closeModal}
        />

        <div
          className={`relative panel-bg panel-fg w-full max-w-3xl rounded-3xl p-6 pt-14 min-[83rem]:p-8 min-[83rem]:pt-8 max-h-[85vh] overflow-y-auto no-scrollbar transition-transform duration-300 ease-out ${
            isVisible ? 'translate-y-0' : 'translate-y-[100vh]'
          } ${isOpen ? '' : 'pointer-events-none'}`}
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
            <div className="min-h-[320px] pb-16 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl tracking-tight">Thank you</h2>
              <p className="mt-4 text-xl font-light">
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
              <h2 className="text-4xl mb-6">{modalTitle}</h2>

              <div className="flex gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => openModal('donation')}
                  className={`border panel-border rounded-md w-full px-4 py-1 text-sm min-[83rem]:text-base cursor-pointer ${
                    activeTab === 'donation' ? 'invert-panel' : ''
                  }`}
                >
                  {donationTabLabel}
                </button>
                <button
                  type="button"
                  onClick={() => openModal('newsletter')}
                  className={`border panel-border rounded-md w-full px-4 py-1 text-sm min-[83rem]:text-base cursor-pointer ${
                    activeTab === 'newsletter' ? 'invert-panel' : ''
                  }`}
                >
                  {newsletterTabLabel}
                </button>
              </div>

              <div className="mt-4 text-[color:var(--panel-fg)]">
                {activeTab === 'donation' ? (
                  <form
                    key="donation-form"
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
                          className={`flex items-center justify-center w-12 h-12 text-lg min-[83rem]:w-12 min-[83rem]:h-12 min-[83rem]:text-lg rounded-full text-center transition-colors cursor-pointer ${
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

                    {donationError && <p className="text-red-600 text-sm">{donationError}</p>}

                    <button
                      type="submit"
                      disabled={isDonationSubmitting}
                      className="mt-12 bg-(--panel-fg) text-(--panel-bg) text-3xl min-[83rem]:text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-40 h-40 min-[83rem]:w-64 min-[83rem]:h-64 rounded-full text-center mx-auto block disabled:opacity-50 cursor-pointer"
                    >
                      {isDonationSubmitting ? 'Redirecting...' : donationSubmitLabel}
                    </button>
                  </form>
                ) : (
                  <form
                    key="newsletter-form"
                    onSubmit={handleNewsletterSubmit(onNewsletterSubmit)}
                    className="space-y-4 pb-14 min-[83rem]:pb-16 flex flex-col"
                  >
                    {content?.newsletterIntro?.length ? (
                      <div className="space-y-2 mb-4">
                        <SupportRichText value={content.newsletterIntro} />
                      </div>
                    ) : null}

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
                        className={`text-sm ${
                          newsletterState === 'success' ? 'text-green-700' : 'text-red-600'
                        }`}
                      >
                        {newsletterMessage}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isNewsletterSubmitting}
                      className="mt-12 bg-(--panel-fg) text-(--panel-bg) text-3xl min-[83rem]:text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-40 h-40 min-[83rem]:w-64 min-[83rem]:h-64 rounded-full text-center mx-auto block disabled:opacity-50 cursor-pointer"
                    >
                      {isNewsletterSubmitting ? 'Submitting...' : newsletterSubmitLabel}
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
