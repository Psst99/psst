import {NextRequest, NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {getEmailDeliveryErrorMessage, getEmailDeliveryFailureMessage} from '@/lib/email/delivery'
import {writeToken} from '@/sanity/lib/token'
import {pssoundMembershipSchema} from '@/lib/schemas/pssoundMembership'
import {sendPsstEmail} from '@/lib/email/send'

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()
    console.log('RAW DATA:', rawData)

    const data = pssoundMembershipSchema.parse(rawData)

    const doc = {
      _type: 'pssoundMembership',
      collectiveName: data.collectiveName,
      email: data.email,
      isPolitical: data.isPolitical || [],
      otherPolitical: data.otherPolitical || '',
      caribbeanOrAfro: data.caribbeanOrAfro === 'true',
      qualifiedSoundEngineer: data.qualifiedSoundEngineer,
      annualContribution: data.annualContribution,
      charterSigned: !!data.charterSigned,
      // submittedAt: new Date().toISOString(),
    }

    const writeClient = client.withConfig({token: writeToken})
    const createdDoc = await writeClient.create(doc)

    try {
      const emailResult = await sendPsstEmail({
        to: data.email,
        templateKey: 'pssoundMembershipReceived',
        variables: {
          collectiveName: data.collectiveName,
          email: data.email,
        },
      })

      if (emailResult.sent) {
        await writeClient
          .patch(createdDoc._id)
          .set({confirmationEmailSentAt: new Date().toISOString()})
          .unset(['emailDeliveryError'])
          .commit()
      } else {
        await writeClient
          .patch(createdDoc._id)
          .set({emailDeliveryError: getEmailDeliveryFailureMessage(emailResult.reason)})
          .commit()
          .catch(() => undefined)
      }
    } catch (emailError) {
      console.error('Membership confirmation email failed:', emailError)
      await writeClient
        .patch(createdDoc._id)
        .set({emailDeliveryError: getEmailDeliveryErrorMessage(emailError)})
        .commit()
        .catch(() => undefined)
    }

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Request registration error:', error)
    return NextResponse.json(
      {success: false, error: 'Invalid form data or server error'},
      {status: 400},
    )
  }
}
