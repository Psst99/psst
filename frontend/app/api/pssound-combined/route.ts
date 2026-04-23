import {NextRequest, NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {getEmailDeliveryErrorMessage, getEmailDeliveryFailureMessage} from '@/lib/email/delivery'
import {writeToken} from '@/sanity/lib/token'
import {z} from 'zod'
import {pssoundMembershipSchema} from '@/lib/schemas/pssoundMembership'
import {pssoundRequestSchema} from '@/lib/schemas/pssoundRequest'
import {sendPsstEmail} from '@/lib/email/send'
import {PSSOUND_UNAVAILABLE_RANGE_MESSAGE} from '@/lib/pssound-dates'

type BlockedPeriod = {
  title?: string
  startDate?: string
  endDate?: string
}

// Combined schema validation
const combinedFormSchema = z.discriminatedUnion('isMember', [
  z.object({
    isMember: z.literal(true),
    selectedCollective: z.string().min(1, 'Please select your collective'),
    membership: z.any().optional(),
    request: pssoundRequestSchema,
  }),
  z.object({
    isMember: z.literal(false),
    selectedCollective: z.string().optional(),
    membership: pssoundMembershipSchema,
    request: z.any().optional(),
  }),
])

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
    const data = await req.json()
    const validatedData = combinedFormSchema.parse(data)

    // Use the same client pattern as request-pssound
    const sanityClient = client.withConfig({token: writeToken})

    // Submit membership if user is not already a member
    let membershipId = null
    let contactEmail: string | undefined

    if (!validatedData.isMember && validatedData.membership) {
      const membership = await sanityClient.create({
        _type: 'pssoundMembership',
        collectiveName: validatedData.membership.collectiveName,
        email: validatedData.membership.email,
        isPolitical: validatedData.membership.isPolitical,
        otherPolitical: validatedData.membership.otherPolitical,
        caribbeanOrAfro: validatedData.membership.caribbeanOrAfro === 'true',
        qualifiedSoundEngineer: validatedData.membership.qualifiedSoundEngineer,
        annualContribution: validatedData.membership.annualContribution,
        charterSigned: validatedData.membership.charterSigned,
        approved: false, // Needs admin approval
      })

      membershipId = membership._id
      contactEmail = validatedData.membership.email

      try {
        const emailResult = await sendPsstEmail({
          to: validatedData.membership.email,
          templateKey: 'pssoundMembershipReceived',
          variables: {
            collectiveName: validatedData.membership.collectiveName,
            email: validatedData.membership.email,
          },
        })

        if (emailResult.sent) {
          await sanityClient
            .patch(membership._id)
            .set({confirmationEmailSentAt: new Date().toISOString()})
            .unset(['emailDeliveryError'])
            .commit()
        } else {
          await sanityClient
            .patch(membership._id)
            .set({emailDeliveryError: getEmailDeliveryFailureMessage(emailResult.reason)})
            .commit()
            .catch(() => undefined)
        }
      } catch (emailError) {
        console.error('Membership confirmation email failed:', emailError)
        await sanityClient
          .patch(membership._id)
          .set({emailDeliveryError: getEmailDeliveryErrorMessage(emailError)})
          .commit()
          .catch(() => undefined)
      }
    }

    if (!validatedData.isMember) {
      return NextResponse.json({success: true})
    }

    const overlappingBlock =
      (await findBlockedPeriodOverlap(
        validatedData.request.pickupDate,
        validatedData.request.returnDate,
      )) ||
      (await findBlockedPeriodOverlap(
        validatedData.request.eventDate,
        validatedData.request.eventDate,
      ))

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

    // Determine collective name
    const collectiveName = validatedData.selectedCollective

    if (collectiveName) {
      const member = await client.fetch<{email?: string} | null>(
        `*[_type == "pssoundMembership" && approved == true && collectiveName == $collectiveName][0]{email}`,
        {collectiveName},
      )
      contactEmail = member?.email
    }

    // Always submit request
    const request = await sanityClient.create({
      _type: 'pssoundRequest',
      collective: collectiveName,
      contactEmail,
      membership: membershipId ? {_type: 'reference', _ref: membershipId} : undefined,
      eventTitle: validatedData.request.eventTitle,
      eventLink: validatedData.request.eventLink,
      eventLocation: validatedData.request.eventLocation,
      eventDescription: validatedData.request.eventDescription,
      isPolitical: validatedData.request.isPolitical,
      marginalizedArtists: validatedData.request.marginalizedArtists,
      wagePolicy: validatedData.request.wagePolicy,
      eventDate: validatedData.request.eventDate,
      pickupDate: validatedData.request.pickupDate,
      returnDate: validatedData.request.returnDate,
      vehicleCert: !!validatedData.request.vehicleCert,
      teamCert: !!validatedData.request.teamCert,
      charterCert: !!validatedData.request.charterCert,
      membershipCert: !!validatedData.request.membershipCert,
      status: 'pending',
    })

    try {
      const emailResult = await sendPsstEmail({
        to: contactEmail,
        templateKey: 'pssoundRequestReceived',
        variables: {
          collectiveName: collectiveName || 'your collective',
          eventTitle: validatedData.request.eventTitle,
          eventDate: validatedData.request.eventDate,
          pickupDate: validatedData.request.pickupDate,
          returnDate: validatedData.request.returnDate,
        },
      })

      if (emailResult.sent) {
        await sanityClient
          .patch(request._id)
          .set({confirmationEmailSentAt: new Date().toISOString()})
          .unset(['emailDeliveryError'])
          .commit()
      } else {
        await sanityClient
          .patch(request._id)
          .set({emailDeliveryError: getEmailDeliveryFailureMessage(emailResult.reason)})
          .commit()
          .catch(() => undefined)
      }
    } catch (emailError) {
      console.error('Sound system request confirmation email failed:', emailError)
      await sanityClient
        .patch(request._id)
        .set({emailDeliveryError: getEmailDeliveryErrorMessage(emailError)})
        .commit()
        .catch(() => undefined)
    }

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      {success: false, error: 'Invalid form data or server error'},
      {status: 400},
    )
  }
}
