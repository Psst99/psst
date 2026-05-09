import 'server-only'

import {client} from '@/sanity/lib/client'
import {writeToken} from '@/sanity/lib/token'

type NewsletterSubscriptionStatus = 'pending' | 'synced'

type NewsletterSubscriptionInput = {
  email: string
  name?: string
  sourcePath?: string
}

type ExistingNewsletterSubscription = {
  status?: NewsletterSubscriptionStatus
  confirmationEmailSentAt?: string
}

const NEWSLETTER_SUBSCRIPTION_TYPE = 'newsletterSubscription'

function getWriteClient() {
  return client.withConfig({token: writeToken, useCdn: false})
}

function createNewsletterSubscriptionId(email: string) {
  return `${NEWSLETTER_SUBSCRIPTION_TYPE}.${Buffer.from(email).toString('base64url')}`
}

export async function upsertNewsletterSubscription({
  email,
  name,
  sourcePath,
}: NewsletterSubscriptionInput) {
  const writeClient = getWriteClient()
  const id = createNewsletterSubscriptionId(email)
  const now = new Date().toISOString()

  const existing = await writeClient.fetch<ExistingNewsletterSubscription | null>(
    `*[_id == $id][0]{status, confirmationEmailSentAt}`,
    {id},
  )

  await writeClient.createIfNotExists({
    _id: id,
    _type: NEWSLETTER_SUBSCRIPTION_TYPE,
    email,
    status: 'pending',
    submittedAt: now,
  })

  const patch = writeClient.patch(id).set({
    email,
    lastSubmittedAt: now,
  })

  if (name) {
    patch.set({name})
  }

  if (sourcePath) {
    patch.set({sourcePath})
  }

  await patch.commit()

  return {
    id,
    status: existing?.status,
    confirmationEmailSentAt: existing?.confirmationEmailSentAt,
  }
}

export async function markNewsletterSubscriptionSynced(id: string) {
  const writeClient = getWriteClient()

  await writeClient
    .patch(id)
    .set({
      status: 'synced',
      syncedAt: new Date().toISOString(),
    })
    .unset(['providerError'])
    .commit()
}

export async function setNewsletterSubscriptionPending(id: string, providerError?: string) {
  const writeClient = getWriteClient()
  const patch = writeClient.patch(id).set({status: 'pending'})

  if (providerError) {
    patch.set({providerError})
  } else {
    patch.unset(['providerError'])
  }

  await patch.commit()
}

export async function markNewsletterConfirmationEmailSent(id: string) {
  const writeClient = getWriteClient()

  await writeClient
    .patch(id)
    .set({confirmationEmailSentAt: new Date().toISOString()})
    .unset(['emailDeliveryError'])
    .commit()
}

export async function markNewsletterConfirmationEmailError(id: string, message: string) {
  const writeClient = getWriteClient()

  await writeClient.patch(id).set({emailDeliveryError: message}).commit()
}
