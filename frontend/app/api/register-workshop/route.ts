// app/api/register-workshop/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeToken } from '@/sanity/lib/token'
import { workshopRegistrationSchema } from '@/lib/schemas/workshop'

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()

    // Validate with Zod
    const validatedData = workshopRegistrationSchema.parse(rawData)

    // Prepare the document for Sanity
    const doc = {
      _type: 'workshopRegistration',
      workshop: {
        _type: 'reference',
        _ref: validatedData.workshopId,
      },
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      experience: validatedData.experience,
      motivation: validatedData.motivation,
      notes: validatedData.notes,
      approved: false,
      registrationDate: new Date().toISOString(),
    }

    await client.withConfig({ token: writeToken }).create(doc)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Workshop registration error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
