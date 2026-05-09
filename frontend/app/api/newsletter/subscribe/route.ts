import {NextRequest, NextResponse} from 'next/server'
import {getEmailDeliveryErrorMessage, getEmailDeliveryFailureMessage} from '@/lib/email/delivery'
import {sendPsstEmail} from '@/lib/email/send'
import {subscribeToInfomaniakNewsletter} from '@/lib/newsletter/infomaniak'
import {
  markNewsletterConfirmationEmailError,
  markNewsletterConfirmationEmailSent,
  markNewsletterSubscriptionSynced,
  setNewsletterSubscriptionPending,
  upsertNewsletterSubscription,
} from '@/lib/newsletter/subscriptions'
import {newsletterSubscriptionSchema} from '@/lib/schemas/support'

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json()
    const parsed = newsletterSubscriptionSchema.parse(rawData)
    const subscriptionData = {
      email: parsed.email.trim().toLowerCase(),
      name: parsed.name?.trim() || undefined,
      sourcePath: parsed.sourcePath?.trim() || undefined,
    }

    const storedSubscription = await upsertNewsletterSubscription(subscriptionData)

    try {
      const subscription = await subscribeToInfomaniakNewsletter(subscriptionData)

      if (subscription.success) {
        await markNewsletterSubscriptionSynced(storedSubscription.id)
      } else if (storedSubscription.status !== 'synced') {
        await setNewsletterSubscriptionPending(storedSubscription.id)
      }
    } catch (providerError) {
      console.error(
        'Infomaniak newsletter subscribe failed, storing pending signup:',
        providerError,
      )

      if (storedSubscription.status !== 'synced') {
        await setNewsletterSubscriptionPending(
          storedSubscription.id,
          providerError instanceof Error
            ? providerError.message
            : 'Unknown Infomaniak subscription error',
        )
      }
    }

    if (!storedSubscription.confirmationEmailSentAt) {
      try {
        const emailResult = await sendPsstEmail({
          to: subscriptionData.email,
          templateKey: 'newsletterReceived',
          variables: {
            email: subscriptionData.email,
            sourcePath: subscriptionData.sourcePath || 'psst.space',
          },
        })

        if (emailResult.sent) {
          await markNewsletterConfirmationEmailSent(storedSubscription.id)
        } else {
          await markNewsletterConfirmationEmailError(
            storedSubscription.id,
            getEmailDeliveryFailureMessage(emailResult.reason),
          )
        }
      } catch (emailError) {
        console.error('Newsletter confirmation email failed:', emailError)
        await markNewsletterConfirmationEmailError(
          storedSubscription.id,
          getEmailDeliveryErrorMessage(emailError),
        )
      }
    }

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Newsletter subscribe error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({success: false, error: 'Invalid newsletter data'}, {status: 400})
    }

    return NextResponse.json({success: false, error: 'Internal server error'}, {status: 500})
  }
}
