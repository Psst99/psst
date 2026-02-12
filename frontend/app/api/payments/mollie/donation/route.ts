import {NextRequest, NextResponse} from 'next/server'
import {donationCheckoutSchema} from '@/lib/schemas/support'

function stripEmpty(value?: string) {
  if (!value) return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function resolveBaseUrl(req: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')

  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  const proto = req.headers.get('x-forwarded-proto') ?? 'https'
  if (host) return `${proto}://${host}`

  return new URL(req.url).origin
}

function canUseWebhookUrl(baseUrl: string) {
  try {
    const url = new URL(baseUrl)
    if (url.protocol !== 'https:') return false
    const host = url.hostname.toLowerCase()

    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return false
    if (host.endsWith('.local')) return false
    if (host.startsWith('10.') || host.startsWith('192.168.') || host.startsWith('172.16.')) return false

    return true
  } catch {
    return false
  }
}

function toSafePath(path?: string, fallback = '/?support=open&supportTab=donation&donation=success') {
  if (!path) return fallback
  return path.startsWith('/') ? path : fallback
}

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()
    const parsed = donationCheckoutSchema.parse(rawData)
    const mollieApiKey = process.env.MOLLIE_API_KEY

    if (!mollieApiKey) {
      return NextResponse.json(
        {success: false, error: 'Missing MOLLIE_API_KEY configuration'},
        {status: 500},
      )
    }

    const baseUrl = resolveBaseUrl(req)
    const redirectPath = toSafePath(parsed.redirectPath)
    const normalizedName = stripEmpty(parsed.name)
    const normalizedEmail = stripEmpty(parsed.email)
    const normalizedMessage = stripEmpty(parsed.message)
    const configuredWebhookUrl = process.env.MOLLIE_WEBHOOK_URL?.trim()
    const webhookUrl =
      configuredWebhookUrl && configuredWebhookUrl.length > 0
        ? configuredWebhookUrl
        : canUseWebhookUrl(baseUrl)
          ? `${baseUrl}/api/payments/mollie/webhook`
          : undefined

    const response = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mollieApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: {currency: 'EUR', value: parsed.amount.toFixed(2)},
        description: 'PSST donation',
        redirectUrl: `${baseUrl}${redirectPath}`,
        ...(webhookUrl ? {webhookUrl} : {}),
        metadata: {
          kind: 'donation',
          donorName: normalizedName,
          donorEmail: normalizedEmail,
          message: normalizedMessage,
        },
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Mollie create payment error:', errorText)
      return NextResponse.json(
        {success: false, error: 'Unable to create Mollie payment'},
        {status: 502},
      )
    }

    const payment = (await response.json()) as {
      id?: string
      _links?: {checkout?: {href?: string}}
    }
    const checkoutUrl = payment?._links?.checkout?.href

    if (!checkoutUrl) {
      return NextResponse.json(
        {success: false, error: 'Mollie response missing checkout URL'},
        {status: 502},
      )
    }

    return NextResponse.json({success: true, checkoutUrl, paymentId: payment.id})
  } catch (error) {
    console.error('Donation payment error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({success: false, error: 'Invalid payment data'}, {status: 400})
    }

    return NextResponse.json({success: false, error: 'Internal server error'}, {status: 500})
  }
}
