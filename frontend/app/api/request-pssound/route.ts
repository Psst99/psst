import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeToken } from '@/sanity/lib/token'
import { pssoundRequestSchema } from '@/lib/schemas/pssoundRequest'

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()
    const data = pssoundRequestSchema.parse(rawData)

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
      collective: data.collective || '',
      // submittedAt: new Date().toISOString(),
    }

    await client.withConfig({ token: writeToken }).create(doc)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sound system request error:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid form data or server error' },
      { status: 400 }
    )
  }
}
