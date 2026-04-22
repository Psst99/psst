import {NextRequest, NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {getEmailDeliveryErrorMessage, getEmailDeliveryFailureMessage} from '@/lib/email/delivery'
import {writeToken} from '@/sanity/lib/token'
import {resourceSubmissionSchema} from '@/lib/schemas/resource'
import {sendPsstEmail} from '@/lib/email/send'

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

    const submittedAt = new Date().toISOString()
    const tagReferences =
      validatedData.tags?.map((tagId) => ({
        _key: crypto.randomUUID(),
        _type: 'reference',
        _ref: tagId,
      })) ?? []
    const categoryReferences = validatedData.categories.map((categoryId) => ({
      _key: crypto.randomUUID(),
      _type: 'reference',
      _ref: categoryId,
    }))

    // Prepare the canonical resource document for Sanity. Submitted resources start pending.
    const doc = {
      _type: 'resource',
      title: validatedData.title,
      url: validatedData.url,
      email: validatedData.email,
      categories: categoryReferences,
      tags: tagReferences,
      description: validatedData.description,
      submissionSource: 'website',
      approved: false,
      submittedAt,
      ...(fileField ? {file: fileField} : {}),
    }

    const writeClient = client.withConfig({token: writeToken})
    const createdDoc = await writeClient.create(doc)

    try {
      const emailResult = await sendPsstEmail({
        to: validatedData.email,
        templateKey: 'resourceReceived',
        variables: {
          title: validatedData.title,
          email: validatedData.email,
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
      console.error('Email sending failed:', emailError)
      await writeClient
        .patch(createdDoc._id)
        .set({emailDeliveryError: getEmailDeliveryErrorMessage(emailError)})
        .commit()
        .catch(() => undefined)
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
