// app/api/register-workshop/route.ts
import {NextRequest, NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {writeToken} from '@/sanity/lib/token'
import {workshopRegistrationSchema} from '@/lib/schemas/workshop'

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()
    const validatedData = workshopRegistrationSchema.parse(rawData)

    // Check available spots (only count approved registrations)
    const workshopId = validatedData.workshop._ref
    const approvedCount = await client.fetch(
      `count(*[_type == "workshopRegistration" && workshop._ref == $workshopId && status == "approved"])`,
      {workshopId},
    )

    const workshop = await client.fetch(
      `*[_type == "workshop" && _id == $workshopId][0]{totalSpots}`,
      {workshopId},
    )

    if (!workshop || approvedCount >= workshop.totalSpots) {
      return NextResponse.json(
        {success: false, error: 'No spots left for this workshop'},
        {status: 400},
      )
    }

    // Prepare the document for Sanity
    const doc = {
      _type: 'workshopRegistration',
      workshop: validatedData.workshop,
      name: validatedData.name,
      email: validatedData.email,
      selectedDates: validatedData.selectedDates,
      message: validatedData.message,
      status: 'pending',
      registrationDate: new Date().toISOString(),
    }

    await client.withConfig({token: writeToken}).create(doc)
    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Workshop registration error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {success: false, error: 'Invalid form data', details: error},
        {status: 400},
      )
    }

    return NextResponse.json({success: false, error: 'Internal server error'}, {status: 500})
  }
}
