import 'server-only'

import {client} from '@/sanity/lib/client'
import {writeToken} from '@/sanity/lib/token'
import {syncArtistDocumentToGoogleSheet} from '../google-sheets/artist-sync'
import {sendPsstEmail} from './send'
import {artistEmailCard, formatDateList, resourceEmailCard, workshopEmailCard} from './cards'

type SupportedApprovalType =
  | 'artist'
  | 'resourceSubmission'
  | 'resource'
  | 'workshopRegistration'
  | 'pssoundMembership'

type ApprovalResult =
  | {
      handled: true
      sent: boolean
      reason?: string
      updated?: boolean
      sheetName?: string
      rowNumber?: number
    }
  | {handled: false; reason: string}

const writeClient = client.withConfig({token: writeToken, useCdn: false})

function publishedId(id: string) {
  return id.replace(/^drafts\./, '')
}

function publicUrl(baseUrl: string, path?: string | null) {
  if (!path) return undefined
  return `${baseUrl.replace(/\/$/, '')}${path}`
}

async function patchSuccess(id: string) {
  await writeClient
    .patch(id)
    .set({approvalEmailSentAt: new Date().toISOString()})
    .unset(['emailDeliveryError'])
    .commit()
}

async function patchPublishedAtIfMissing(id: string) {
  await writeClient
    .patch(id)
    .setIfMissing({publishedAt: new Date().toISOString()})
    .commit()
    .catch(() => undefined)
}

async function patchError(id: string, error: unknown) {
  await writeClient
    .patch(id)
    .set({
      emailDeliveryError: error instanceof Error ? error.message : 'Unknown email delivery error',
    })
    .commit()
    .catch(() => undefined)
}

async function handleArtist(id: string, baseUrl: string): Promise<ApprovalResult> {
  const doc = await writeClient.fetch<{
    _id: string
    approved?: boolean
    approvalEmailSentAt?: string
    email?: string
    artistName?: string
    description?: string
    slug?: {current?: string}
    categories?: {title?: string}[]
    tags?: {title?: string}[]
    links?: {platform?: string; url?: string}[]
  } | null>(
    `*[_type == "artist" && _id == $id][0]{
      _id,
      approved,
      approvalEmailSentAt,
      email,
      artistName,
      description,
      slug,
      categories[]->{title},
      tags[]->{title},
      links
    }`,
    {id},
  )

  if (!doc?.approved) return {handled: false, reason: 'artist is not approved'}
  if (!doc.artistName) return {handled: false, reason: 'artist name missing'}

  const syncResult = await syncArtistDocumentToGoogleSheet(doc._id, {
    mode: 'approval',
    force: true,
  })

  if (doc.approvalEmailSentAt) {
    return {
      handled: true,
      sent: false,
      reason: 'already sent',
      updated: syncResult.updated,
      sheetName: syncResult.sheetName,
      rowNumber: syncResult.rowNumber,
    }
  }

  if (!doc.email) {
    return {
      handled: true,
      sent: false,
      reason: 'artist email missing',
      updated: syncResult.updated,
      sheetName: syncResult.sheetName,
      rowNumber: syncResult.rowNumber,
    }
  }

  const url = publicUrl(baseUrl, doc.slug?.current ? `/database/artists/${doc.slug.current}` : null)

  try {
    const result = await sendPsstEmail({
      to: doc.email,
      templateKey: 'databaseApproved',
      variables: {
        artistName: doc.artistName,
        email: doc.email,
        publicUrl: url,
      },
      card: artistEmailCard({
        artistName: doc.artistName,
        description: doc.description,
        categories: doc.categories,
        tags: doc.tags,
        links: doc.links,
        publicUrl: url,
      }),
    })

    if (result.sent) {
      await patchSuccess(doc._id)
    }

    return {
      handled: true,
      sent: result.sent,
      reason: result.sent ? undefined : result.reason,
      updated: syncResult.updated,
      sheetName: syncResult.sheetName,
      rowNumber: syncResult.rowNumber,
    }
  } catch (error) {
    await patchError(doc._id, error)
    throw error
  }
}

function resourceIdForSubmission(id: string) {
  const cleanId = id.replace(/[^a-zA-Z0-9_.-]/g, '-')
  return `resource.${cleanId}`
}

async function fetchResourceTags(tagIds?: string[]) {
  if (!tagIds?.length) return []
  return writeClient.fetch<{_id: string; title: string}[]>(
    `*[_type == "resourceTag" && _id in $ids]{_id, title}`,
    {ids: tagIds},
  )
}

async function ensureResourceFromSubmission(doc: {
  _id: string
  title: string
  description?: string
  categories?: string[]
  tags?: string[]
  url?: string
  file?: {_type?: string; asset?: {_type?: string; _ref?: string}}
  email?: string
  publishedResource?: {_ref?: string}
}) {
  if (doc.publishedResource?._ref) return doc.publishedResource._ref

  const resourceId = resourceIdForSubmission(doc._id)
  await writeClient.createIfNotExists({
    _id: resourceId,
    _type: 'resource',
    title: doc.title,
    description: doc.description,
    category: doc.categories?.[0] || 'text',
    url: doc.url,
    email: doc.email,
    tags:
      doc.tags?.map((tagId) => ({
        _key: crypto.randomUUID(),
        _type: 'reference',
        _ref: tagId,
      })) ?? [],
    approved: true,
    publishedAt: new Date().toISOString(),
    ...(doc.file ? {file: doc.file} : {}),
  })

  await writeClient
    .patch(doc._id)
    .set({publishedResource: {_type: 'reference', _ref: resourceId}})
    .commit()

  return resourceId
}

async function handleResourceSubmission(id: string, baseUrl: string): Promise<ApprovalResult> {
  const doc = await writeClient.fetch<{
    _id: string
    approved?: boolean
    approvalEmailSentAt?: string
    publishedResource?: {_ref?: string}
    title?: string
    email?: string
    categories?: string[]
    tags?: string[]
    description?: string
    url?: string
    file?: {_type?: string; asset?: {_type?: string; _ref?: string}}
    fileUrl?: string
  } | null>(
    `*[_type == "resourceSubmission" && _id == $id][0]{
      _id,
      approved,
      approvalEmailSentAt,
      publishedResource,
      title,
      email,
      categories,
      tags,
      description,
      url,
      file,
      "fileUrl": file.asset->url
    }`,
    {id},
  )

  if (!doc?.approved) return {handled: false, reason: 'resource submission is not approved'}
  if (doc.approvalEmailSentAt) return {handled: true, sent: false, reason: 'already sent'}
  if (!doc.email || !doc.title) return {handled: false, reason: 'resource email or title missing'}

  const resourceId = await ensureResourceFromSubmission({
    _id: doc._id,
    title: doc.title,
    description: doc.description,
    categories: doc.categories,
    tags: doc.tags,
    url: doc.url,
    file: doc.file,
    email: doc.email,
    publishedResource: doc.publishedResource,
  })
  const tags = await fetchResourceTags(doc.tags)
  const url = publicUrl(baseUrl, `/resources/items/${resourceId}`)

  try {
    const result = await sendPsstEmail({
      to: doc.email,
      templateKey: 'resourceApproved',
      variables: {
        title: doc.title,
        email: doc.email,
        publicUrl: url,
      },
      card: resourceEmailCard({
        title: doc.title,
        description: doc.description,
        categories: doc.categories?.map((category) => category.toUpperCase()),
        tags,
        url: doc.url,
        fileUrl: doc.fileUrl,
        publicUrl: url,
      }),
    })

    if (result.sent) {
      await Promise.all([patchSuccess(doc._id), patchSuccess(resourceId)])
    }
    return {handled: true, sent: result.sent, reason: result.sent ? undefined : result.reason}
  } catch (error) {
    await patchError(doc._id, error)
    throw error
  }
}

async function handleResource(id: string, baseUrl: string): Promise<ApprovalResult> {
  const doc = await writeClient.fetch<{
    _id: string
    approved?: boolean
    approvalEmailSentAt?: string
    title?: string
    email?: string
    category?: string
    categories?: {title?: string}[]
    description?: string
    url?: string
    fileUrl?: string
    publishedAt?: string
    tags?: {title?: string}[]
    assetFileUrl?: string
  } | null>(
    `*[_type == "resource" && _id == $id][0]{
      _id,
      approved,
      approvalEmailSentAt,
      title,
      email,
      category,
      categories[]->{title},
      description,
      url,
      fileUrl,
      publishedAt,
      tags[]->{title},
      "assetFileUrl": file.asset->url
    }`,
    {id},
  )

  if (!doc?.approved) return {handled: false, reason: 'resource is not approved'}
  if (doc.approvalEmailSentAt) return {handled: true, sent: false, reason: 'already sent'}
  if (!doc.title) return {handled: false, reason: 'resource title missing'}

  if (!doc.publishedAt) {
    await patchPublishedAtIfMissing(doc._id)
  }

  if (!doc.email) {
    return {handled: true, sent: false, reason: 'resource email missing'}
  }

  const url = publicUrl(baseUrl, `/resources/items/${doc._id}`)

  try {
    const result = await sendPsstEmail({
      to: doc.email,
      templateKey: 'resourceApproved',
      variables: {
        title: doc.title,
        email: doc.email,
        publicUrl: url,
      },
      card: resourceEmailCard({
        title: doc.title,
        description: doc.description,
        categories: doc.categories
          ?.flatMap((category) => (category.title ? [category.title.toUpperCase()] : []))
          .filter(Boolean),
        category: doc.category,
        tags: doc.tags,
        url: doc.url,
        fileUrl: doc.fileUrl || doc.assetFileUrl,
        publicUrl: url,
      }),
    })

    if (result.sent) await patchSuccess(doc._id)
    return {handled: true, sent: result.sent, reason: result.sent ? undefined : result.reason}
  } catch (error) {
    await patchError(doc._id, error)
    throw error
  }
}

async function handleWorkshopRegistration(id: string, baseUrl: string): Promise<ApprovalResult> {
  const doc = await writeClient.fetch<{
    _id: string
    status?: string
    approvalEmailSentAt?: string
    name?: string
    email?: string
    selectedDates?: string[]
    workshop?: {
      title?: string
      slug?: {current?: string}
      dates?: string[]
      location?: string
      imageUrl?: string
      tags?: {title?: string}[]
    }
  } | null>(
    `*[_type == "workshopRegistration" && _id == $id][0]{
      _id,
      status,
      approvalEmailSentAt,
      name,
      email,
      selectedDates,
      workshop->{
        title,
        slug,
        dates,
        location,
        "imageUrl": coverImage.asset->url,
        tags[]->{title}
      }
    }`,
    {id},
  )

  if (doc?.status !== 'approved') return {handled: false, reason: 'registration is not approved'}
  if (doc.approvalEmailSentAt) return {handled: true, sent: false, reason: 'already sent'}
  if (!doc.email || !doc.name || !doc.workshop?.title) {
    return {handled: false, reason: 'registration email, name or workshop missing'}
  }

  const url = publicUrl(
    baseUrl,
    doc.workshop.slug?.current ? `/workshops/w/${doc.workshop.slug.current}` : null,
  )

  try {
    const result = await sendPsstEmail({
      to: doc.email,
      templateKey: 'workshopApproved',
      variables: {
        name: doc.name,
        email: doc.email,
        workshopTitle: doc.workshop.title,
        selectedDates: formatDateList(doc.selectedDates),
        publicUrl: url,
      },
      card: workshopEmailCard({
        title: doc.workshop.title,
        location: doc.workshop.location,
        dates: doc.workshop.dates,
        selectedDates: doc.selectedDates,
        imageUrl: doc.workshop.imageUrl,
        tags: doc.workshop.tags,
        publicUrl: url,
      }),
    })

    if (result.sent) await patchSuccess(doc._id)
    return {handled: true, sent: result.sent, reason: result.sent ? undefined : result.reason}
  } catch (error) {
    await patchError(doc._id, error)
    throw error
  }
}

async function handlePssoundMembership(id: string): Promise<ApprovalResult> {
  const doc = await writeClient.fetch<{
    _id: string
    approved?: boolean
    approvalEmailSentAt?: string
    collectiveName?: string
    email?: string
    startDate?: string
  } | null>(
    `*[_type == "pssoundMembership" && _id == $id][0]{
      _id,
      approved,
      approvalEmailSentAt,
      collectiveName,
      email,
      startDate
    }`,
    {id},
  )

  if (!doc?.approved) return {handled: false, reason: 'membership is not approved'}
  if (doc.approvalEmailSentAt) return {handled: true, sent: false, reason: 'already sent'}
  if (!doc.email || !doc.collectiveName) {
    return {handled: false, reason: 'membership email or collective missing'}
  }

  try {
    const result = await sendPsstEmail({
      to: doc.email,
      templateKey: 'pssoundMembershipApproved',
      variables: {
        collectiveName: doc.collectiveName,
        email: doc.email,
        startDate: doc.startDate || '',
      },
    })

    if (result.sent) await patchSuccess(doc._id)
    return {handled: true, sent: result.sent, reason: result.sent ? undefined : result.reason}
  } catch (error) {
    await patchError(doc._id, error)
    throw error
  }
}

export async function sendApprovalEmailForDocument(
  documentId: string,
  documentType: string,
  baseUrl: string,
): Promise<ApprovalResult> {
  const id = publishedId(documentId)

  switch (documentType as SupportedApprovalType) {
    case 'artist':
      return handleArtist(id, baseUrl)
    case 'resourceSubmission':
      return handleResourceSubmission(id, baseUrl)
    case 'resource':
      return handleResource(id, baseUrl)
    case 'workshopRegistration':
      return handleWorkshopRegistration(id, baseUrl)
    case 'pssoundMembership':
      return handlePssoundMembership(id)
    default:
      return {handled: false, reason: `unsupported document type: ${documentType}`}
  }
}
