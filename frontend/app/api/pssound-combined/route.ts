import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeToken } from '@/sanity/lib/token'
import { z } from 'zod'
import { pssoundMembershipSchema } from '@/lib/schemas/pssoundMembership'
import { pssoundRequestSchema } from '@/lib/schemas/pssoundRequest'

// Combined schema validation
const combinedFormSchema = z.object({
  isMember: z.boolean(),
  selectedCollective: z.string().optional(),
  membership: pssoundMembershipSchema.optional(),
  request: pssoundRequestSchema,
})

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const validatedData = combinedFormSchema.parse(data)

    // Use the same client pattern as request-pssound
    const sanityClient = client.withConfig({ token: writeToken })

    // Submit membership if user is not already a member
    let membershipId = null

    if (!validatedData.isMember && validatedData.membership) {
      const membership = await sanityClient.create({
        _type: 'pssoundMembership',
        collectiveName: validatedData.membership.collectiveName,
        isPolitical: validatedData.membership.isPolitical,
        otherPolitical: validatedData.membership.otherPolitical,
        caribbeanOrAfro: validatedData.membership.caribbeanOrAfro === 'true',
        qualifiedSoundEngineer: validatedData.membership.qualifiedSoundEngineer,
        annualContribution: validatedData.membership.annualContribution,
        charterSigned: validatedData.membership.charterSigned,
        approved: false, // Needs admin approval
      })

      membershipId = membership._id
    }

    // Determine collective name
    const collectiveName = validatedData.isMember
      ? validatedData.selectedCollective
      : validatedData.membership?.collectiveName

    // Always submit request
    await sanityClient.create({
      _type: 'pssoundRequest',
      collective: collectiveName,
      membership: membershipId
        ? { _type: 'reference', _ref: membershipId }
        : undefined,
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
      status: 'pending',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid form data or server error' },
      { status: 400 }
    )
  }
}
