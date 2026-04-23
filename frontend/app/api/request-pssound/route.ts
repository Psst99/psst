import {NextRequest, NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {getEmailDeliveryErrorMessage, getEmailDeliveryFailureMessage} from '@/lib/email/delivery'
import {writeToken} from '@/sanity/lib/token'
import {pssoundRequestSchema} from '@/lib/schemas/pssoundRequest'
import {sendPsstEmail} from '@/lib/email/send'
import {PSSOUND_UNAVAILABLE_RANGE_MESSAGE} from '@/lib/pssound-dates'

type BlockedPeriod = {
  title?: string
  startDate?: string
  endDate?: string
}

async function findBlockedPeriodOverlap(startDate: string, endDate: string) {
  return client.withConfig({useCdn: false}).fetch<BlockedPeriod | null>(
    `*[
      _type == "pssoundCalendar" &&
      defined(startDate) &&
      defined(endDate) &&
      startDate <= $endDate &&
      endDate >= $startDate
    ][0]{title, startDate, endDate}`,
    {startDate, endDate},
  )
}

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()
    const data = pssoundRequestSchema.parse(rawData)
    const overlappingBlock =
      (await findBlockedPeriodOverlap(data.pickupDate, data.returnDate)) ||
      (await findBlockedPeriodOverlap(data.eventDate, data.eventDate))

    if (overlappingBlock) {
      return NextResponse.json(
        {
          success: false,
          error: PSSOUND_UNAVAILABLE_RANGE_MESSAGE,
          blockedPeriod: overlappingBlock,
        },
        {status: 409},
      )
    }

    const collectiveName = data.collective || ''
    const member = collectiveName
      ? await client.fetch<{email?: string} | null>(
          `*[_type == "pssoundMembership" && approved == true && collectiveName == $collectiveName][0]{email}`,
          {collectiveName},
        )
      : null

    const doc = {
      _type: 'pssoundRequest',
      eventTitle: data.eventTitle,
      eventLink: data.eventLink,
      eventLocation: data.eventLocation,
      eventDescription: data.eventDescription,
      isPolitical: data.isPolitical,
      marginalizedArtists: data.marginalizedArtists,
      wagePolicy: data.wagePolicy,
      eventDate: data.eventDate,
      pickupDate: data.pickupDate,
      returnDate: data.returnDate,
      vehicleCert: !!data.vehicleCert,
      teamCert: !!data.teamCert,
      charterCert: !!data.charterCert,
      membershipCert: !!data.membershipCert,
      collective: collectiveName,
      contactEmail: member?.email,
      status: 'pending',
    }

    const writeClient = client.withConfig({token: writeToken})
    const createdDoc = await writeClient.create(doc)

    try {
      const emailResult = await sendPsstEmail({
        to: member?.email,
        templateKey: 'pssoundRequestReceived',
        variables: {
          collectiveName: collectiveName || 'your collective',
          eventTitle: data.eventTitle,
          eventDate: data.eventDate,
          pickupDate: data.pickupDate,
          returnDate: data.returnDate,
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
      console.error('Sound system confirmation email failed:', emailError)
      await writeClient
        .patch(createdDoc._id)
        .set({emailDeliveryError: getEmailDeliveryErrorMessage(emailError)})
        .commit()
        .catch(() => undefined)
    }

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Sound system request error:', error)
    return NextResponse.json(
      {success: false, error: 'Invalid form data or server error'},
      {status: 400},
    )
  }
}
