import {NextRequest, NextResponse} from 'next/server'
import {Resend} from 'resend'
import {newsletterSubscriptionSchema} from '@/lib/schemas/support'

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()
    const parsed = newsletterSubscriptionSchema.parse(rawData)
    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      return NextResponse.json(
        {success: false, error: 'Missing RESEND_API_KEY configuration'},
        {status: 500},
      )
    }

    const resend = new Resend(resendApiKey)
    const to = process.env.NEWSLETTER_SUBSCRIBE_TO ?? 'info@psst.space'
    const from = process.env.NEWSLETTER_FROM_EMAIL ?? 'PSST <info@psst.space>'
    const safeEmail = escapeHtml(parsed.email)
    const safeName = escapeHtml(parsed.name?.trim() || 'Not provided')
    const safeSourcePath = escapeHtml(parsed.sourcePath?.trim() || 'Not provided')

    await resend.emails.send({
      from,
      to,
      subject: `Newsletter signup: ${parsed.email}`,
      html: `
        <h2>New newsletter signup</h2>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Source path:</strong> ${safeSourcePath}</p>
      `,
    })

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Newsletter subscribe error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({success: false, error: 'Invalid newsletter data'}, {status: 400})
    }

    return NextResponse.json({success: false, error: 'Internal server error'}, {status: 500})
  }
}
