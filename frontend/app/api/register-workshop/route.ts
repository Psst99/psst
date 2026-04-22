// app/api/register-workshop/route.ts
import {NextRequest, NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {getEmailDeliveryErrorMessage, getEmailDeliveryFailureMessage} from '@/lib/email/delivery'
import {writeToken} from '@/sanity/lib/token'
import {workshopRegistrationSchema} from '@/lib/schemas/workshop'
import {formatDateList} from '@/lib/email/cards'
import {sendPsstEmail} from '@/lib/email/send'

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

    const workshop = await client.fetch<{
      title: string
      totalSpots: number
    } | null>(`*[_type == "workshop" && _id == $workshopId][0]{title, totalSpots}`, {workshopId})

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

    const writeClient = client.withConfig({token: writeToken})
    const createdDoc = await writeClient.create(doc)

    try {
      const emailResult = await sendPsstEmail({
        to: validatedData.email,
        templateKey: 'workshopReceived',
        variables: {
          name: validatedData.name,
          email: validatedData.email,
          workshopTitle: workshop.title,
          selectedDates: formatDateList(validatedData.selectedDates),
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
      console.error('Workshop confirmation email failed:', emailError)
      await writeClient
        .patch(createdDoc._id)
        .set({emailDeliveryError: getEmailDeliveryErrorMessage(emailError)})
        .commit()
        .catch(() => undefined)
    }

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
