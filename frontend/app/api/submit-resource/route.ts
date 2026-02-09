import {NextRequest, NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {writeToken} from '@/sanity/lib/token'
import {resourceSubmissionSchema} from '@/lib/schemas/resource'
import {Resend} from 'resend'
import {generateResourceConfirmationEmail} from '@/lib/email-templates/resource-confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

const MAX_PDF_SIZE_MB = 10
const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024

const parseArrayField = (value: FormDataEntryValue | null) => {
  if (!value || typeof value !== 'string') return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') ?? ''
    const isJson = contentType.includes('application/json')

    const rawData = isJson ? await req.json() : null
    const formData = isJson ? null : await req.formData()

    const payload = isJson
      ? rawData
      : {
          title: formData?.get('title'),
          url: formData?.get('url'),
          email: formData?.get('email'),
          categories: parseArrayField(formData?.get('categories') ?? null),
          tags: parseArrayField(formData?.get('tags') ?? null),
          description: formData?.get('description'),
        }

    // Validate with Zod
    const validatedData = resourceSubmissionSchema.parse(payload)

    let fileField: {_type: 'file'; asset: {_type: 'reference'; _ref: string}} | undefined
    let fileName: string | undefined
    if (formData) {
      const fileEntry = formData.get('file')
      if (fileEntry instanceof File) {
        if (fileEntry.type !== 'application/pdf') {
          return NextResponse.json(
            {success: false, error: 'Only PDF files are allowed'},
            {status: 400},
          )
        }

        if (fileEntry.size > MAX_PDF_SIZE_BYTES) {
          return NextResponse.json(
            {success: false, error: `PDF must be ${MAX_PDF_SIZE_MB}MB or smaller`},
            {status: 400},
          )
        }

        const asset = await client
          .withConfig({token: writeToken})
          .assets.upload('file', fileEntry, {
            contentType: fileEntry.type,
            filename: fileEntry.name,
          })

        fileName = fileEntry.name
        fileField = {
          _type: 'file',
          asset: {_type: 'reference', _ref: asset._id},
        }
      }
    }

    if (!validatedData.url && !fileField) {
      return NextResponse.json(
        {success: false, error: 'Provide a URL or upload a PDF'},
        {status: 400},
      )
    }

    const tagIds = validatedData.tags ?? []
    const tags = tagIds.length
      ? await client.fetch<{_id: string; title: string}[]>(
          `*[_type == "resourceTag" && _id in $ids]{_id, title}`,
          {ids: tagIds},
        )
      : []

    // Prepare the document for Sanity
    const doc = {
      _type: 'resourceSubmission',
      title: validatedData.title,
      url: validatedData.url,
      email: validatedData.email,
      categories: validatedData.categories,
      tags: validatedData.tags,
      description: validatedData.description,
      approved: false, // All submissions start as pending
      submittedAt: new Date().toISOString(),
      ...(fileField ? {file: fileField} : {}),
    }

    await client.withConfig({token: writeToken}).create(doc)

    try {
      const emailHtml = await generateResourceConfirmationEmail({
        title: validatedData.title,
        email: validatedData.email,
        categories: validatedData.categories,
        tags,
        description: validatedData.description,
        url: validatedData.url,
        fileName,
      })

      await resend.emails.send({
        from: 'PSST <info@psst.space>',
        to: validatedData.email,
        subject: 'Resource Submission Confirmation - PSST',
        html: emailHtml,
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Resource submission error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {success: false, error: 'Invalid form data', details: error},
        {status: 400},
      )
    }

    return NextResponse.json({success: false, error: 'Internal server error'}, {status: 500})
  }
}
