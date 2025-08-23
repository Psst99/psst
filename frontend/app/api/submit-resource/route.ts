import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeToken } from '@/sanity/lib/token'
import { resourceSubmissionSchema } from '@/lib/schemas/resource'

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()

    // Validate with Zod
    const validatedData = resourceSubmissionSchema.parse(rawData)

    // Prepare the document for Sanity
    const doc = {
      _type: 'resource', // Use existing resource type
      title: validatedData.title,
      link: validatedData.link, // Changed from 'url' to 'link'
      email: validatedData.email,
      tags: validatedData.tags,
      description: validatedData.description,
      approved: false, // All submissions start as pending
      submittedAt: new Date().toISOString(),
    }

    await client.withConfig({ token: writeToken }).create(doc)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resource submission error:', error)

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
