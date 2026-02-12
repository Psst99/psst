import {NextRequest, NextResponse} from 'next/server'
import {Resend} from 'resend'
import {client} from '@/sanity/lib/client'
import {writeToken} from '@/sanity/lib/token'

type MolliePayment = {
  id: string
  status: string
  paidAt?: string
  amount?: {currency?: string; value?: string}
  metadata?: {
    kind?: string
    donorName?: string
    donorEmail?: string
    message?: string
  }
}

function safeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-')
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

async function parsePaymentId(req: NextRequest) {
  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await req.formData()
    const id = formData.get('id')
    return typeof id === 'string' ? id : null
  }

  if (contentType.includes('application/json')) {
    const body = (await req.json().catch(() => null)) as {id?: unknown} | null
    return typeof body?.id === 'string' ? body.id : null
  }

  const textBody = await req.text().catch(() => '')
  if (!textBody) return null
  const params = new URLSearchParams(textBody)
  return params.get('id')
}

export async function POST(req: NextRequest) {
  try {
    const paymentId = await parsePaymentId(req)
    if (!paymentId) return NextResponse.json({received: true})

    const mollieApiKey = process.env.MOLLIE_API_KEY
    if (!mollieApiKey) {
      console.error('Missing MOLLIE_API_KEY for webhook processing')
      return NextResponse.json({received: true})
    }

    const paymentResponse = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${mollieApiKey}`,
      },
      cache: 'no-store',
    })

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text()
      console.error('Mollie webhook payment fetch error:', errorText)
      return NextResponse.json({received: true})
    }

    const payment = (await paymentResponse.json()) as MolliePayment
    if (payment.metadata?.kind !== 'donation') return NextResponse.json({received: true})
    if (payment.status !== 'paid') return NextResponse.json({received: true})

    const donorEmail = payment.metadata?.donorEmail?.trim()
    if (!donorEmail) return NextResponse.json({received: true})

    const logId = `donationPaymentLog-${safeId(payment.id)}`
    const writeClient = writeToken ? client.withConfig({token: writeToken}) : null

    const existingLog = writeClient
      ? await writeClient.fetch<{confirmationEmailSent?: boolean} | null>(
          `*[_id == $id][0]{confirmationEmailSent}`,
          {id: logId},
        )
      : null

    if (existingLog?.confirmationEmailSent) {
      return NextResponse.json({received: true})
    }

    if (writeClient && !existingLog) {
      await writeClient.createIfNotExists({
        _id: logId,
        _type: 'donationPaymentLog',
        paymentId: payment.id,
        status: payment.status,
        paidAt: payment.paidAt,
        amount: payment.amount?.value,
        currency: payment.amount?.currency,
        donorEmail,
        donorName: payment.metadata?.donorName || '',
        createdAt: new Date().toISOString(),
        confirmationEmailSent: false,
      })
    }

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) return NextResponse.json({received: true})

    const resend = new Resend(resendApiKey)
    const donorName = payment.metadata?.donorName?.trim() || 'friend'
    const safeName = escapeHtml(donorName)
    const amount = payment.amount?.value ? `${payment.amount.value} ${payment.amount?.currency}` : 'your amount'

    await resend.emails.send({
      from: process.env.DONATION_CONFIRMATION_FROM_EMAIL ?? 'PSST <info@psst.space>',
      to: donorEmail,
      subject: 'Thank you for your donation to PSST',
      html: `
        <p>Hi ${safeName},</p>
        <p>Thank you for your donation of ${escapeHtml(amount)}.</p>
        <p>Your support helps us build upcoming events, projects, and shared resources.</p>
        <p>PSST</p>
      `,
    })

    if (writeClient) {
      await writeClient.patch(logId).set({confirmationEmailSent: true}).commit()
    }

    return NextResponse.json({received: true})
  } catch (error) {
    console.error('Mollie webhook processing error:', error)
    return NextResponse.json({received: true})
  }
}
