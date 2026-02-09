import {NextResponse} from 'next/server'
import {Resend} from 'resend'
import {generateArtistConfirmationEmail} from '@/lib/email-templates/artist-confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const emailHtml = await generateArtistConfirmationEmail({
      artistName: 'Test Artist',
      pronouns: 'they/them',
      email: 'test@example.com',
      categories: [
        {_id: '1', title: 'DJ'},
        {_id: '2', title: 'Producer'},
      ],
      tags: [
        {_id: '1', title: 'Techno'},
        {_id: '2', title: 'House'},
      ],
      links: [{url: 'https://soundcloud.com/test', platform: 'SoundCloud'}],
      description: 'Test description',
    })

    const data = await resend.emails.send({
      from: 'PSST <info@psst.space>',
      to: 'aymen@qq.com', // Replace with your email
      subject: 'Test Email',
      html: emailHtml,
    })

    return NextResponse.json({success: true, data})
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({success: false, error: String(error)}, {status: 500})
  }
}
