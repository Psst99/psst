'use client'

import {PortableText, type PortableTextComponents} from '@portabletext/react'
import {useCallback, useContext, useEffect, useState, type FormEvent} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import {SiMinutemailer} from 'react-icons/si'
import {GiLetterBomb} from 'react-icons/gi'
import {useForm} from 'react-hook-form'
import {ThemeContext} from '@/app/ThemeProvider'
import {FormField} from '@/components/form/FormField'
import {TextInput} from '@/components/form/TextInput'
import {getTheme} from '@/lib/theme/sections'
import {LINK_PILL_CLASS} from '@/lib/linkStyles'
import {MODAL_CLOSE_BUTTON_CLASS} from '@/lib/modalStyles'

type SupportTab = 'donation' | 'newsletter'

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
    normal: ({children}) => (
      <p className="text-sm min-[69.375rem]:text-xl leading-snug">{children}</p>
    ),
    h2: ({children}) => (
      <h3 className="text-xl min-[69.375rem]:text-3xl leading-tight">{children}</h3>
    ),
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

  const onFloatingClick = useCallback(() => {
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

      <button
        className="support-widget-fixed fixed z-[10002] flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-l-md shadow-[0_2px_12px_rgba(0,0,0,0.15)] cursor-pointer select-none transition-colors duration-300"
        style={{
          right: 0,
          bottom: 'clamp(88px, 12vw, 136px)',
          backgroundColor: isOpen ? theme.fg : theme.bg,
          color: isOpen ? theme.bg : theme.fg,
        }}
        onClick={onFloatingClick}
        aria-label="Open newsletter modal"
      >
        <GiLetterBomb className="h-[22px] w-[22px] md:h-7 md:w-7" />
      </button>

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
          className={`relative panel-bg panel-fg w-full max-w-3xl rounded-3xl p-6 pt-14 min-[69.375rem]:p-8 min-[69.375rem]:pt-8 max-h-[85vh] overflow-y-auto no-scrollbar transition-transform duration-300 ease-out ${
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
            className={`absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full invert-panel ${MODAL_CLOSE_BUTTON_CLASS}`}
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
                  className={`border panel-border rounded-md w-full px-4 py-1 text-sm min-[69.375rem]:text-base cursor-pointer ${
                    activeTab === 'donation' ? 'invert-panel' : ''
                  }`}
                >
                  {donationTabLabel}
                </button>
                <button
                  type="button"
                  onClick={() => openModal('newsletter')}
                  className={`border panel-border rounded-md w-full px-4 py-1 text-sm min-[69.375rem]:text-base cursor-pointer ${
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
                    className="space-y-4 pb-14 min-[69.375rem]:pb-16 flex flex-col"
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
                          className={`flex items-center justify-center w-12 h-12 text-lg min-[69.375rem]:w-12 min-[69.375rem]:h-12 min-[69.375rem]:text-lg rounded-full text-center transition-colors cursor-pointer ${
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
                      className="mt-12 bg-(--panel-fg) text-(--panel-bg) text-3xl min-[69.375rem]:text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-40 h-40 min-[69.375rem]:w-64 min-[69.375rem]:h-64 rounded-full text-center mx-auto block disabled:opacity-50 cursor-pointer"
                    >
                      {isDonationSubmitting ? 'Redirecting...' : donationSubmitLabel}
                    </button>
                  </form>
                ) : (
                  <form
                    key="newsletter-form"
                    onSubmit={handleNewsletterSubmit(onNewsletterSubmit)}
                    className="space-y-4 pb-14 min-[69.375rem]:pb-16 flex flex-col"
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
                      className="mt-12 bg-(--panel-fg) text-(--panel-bg) text-3xl min-[69.375rem]:text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-40 h-40 min-[69.375rem]:w-64 min-[69.375rem]:h-64 rounded-full text-center mx-auto block disabled:opacity-50 cursor-pointer"
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
