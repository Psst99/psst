import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeToken } from '@/sanity/lib/token'
import { pssoundMembershipSchema } from '@/lib/schemas/pssoundMembership'

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()
    console.log('RAW DATA:', rawData)

    const data = pssoundMembershipSchema.parse(rawData)

    const doc = {
      _type: 'pssoundMembership',
      collectiveName: data.collectiveName,
      isPolitical: data.isPolitical || [],
      otherPolitical: data.otherPolitical || '',
      caribbeanOrAfro: data.caribbeanOrAfro === 'true',
      qualifiedSoundEngineer: data.qualifiedSoundEngineer,
      annualContribution: data.annualContribution,
      charterSigned: !!data.charterSigned,
      // submittedAt: new Date().toISOString(),
    }

    await client.withConfig({ token: writeToken }).create(doc)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Request registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid form data or server error' },
      { status: 400 }
    )
  }
}
