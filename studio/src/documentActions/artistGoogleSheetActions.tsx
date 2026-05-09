import {CheckmarkCircleIcon} from '@sanity/icons'
import {useState} from 'react'
import {type DocumentActionComponent, type DocumentActionsResolver} from 'sanity'

type ApprovalDocumentState = {
  approved?: boolean
  status?: string
  googleSheetsSheetName?: string
  approvalEmailSentAt?: string
}

type ArtistActionResult = {
  handled?: boolean
  sent?: boolean
  synced?: boolean
  updated?: boolean
  sheetName?: string
  rowNumber?: number
  sheetSyncError?: string
  blockedDatesUpdated?: boolean
  blockedDatesId?: string
  reason?: string
}

type ArtistActionResponse = {
  success: boolean
  result?: ArtistActionResult
  error?: string
}

const LOCAL_FRONTEND_ORIGIN = 'http://localhost:3000'
const PRODUCTION_FRONTEND_ORIGIN = 'https://psst.space'
const PREVIEW_ORIGIN = (process.env.SANITY_STUDIO_PREVIEW_URL || LOCAL_FRONTEND_ORIGIN).replace(
  /\/$/,
  '',
)
const EXPLICIT_SYNC_API_ORIGIN = process.env.SANITY_STUDIO_SYNC_API_ORIGIN?.trim().replace(
  /\/$/,
  '',
)
const APPROVAL_SCHEMA_TYPES = new Set([
  'artist',
  'resourceSubmission',
  'resource',
  'workshopRegistration',
  'pssoundRequest',
  'pssoundMembership',
])

function getDocumentState(
  props: Parameters<DocumentActionComponent>[0],
): ApprovalDocumentState | null {
  return ((props.draft ?? props.published) as ApprovalDocumentState | null) ?? null
}

function buildSuccessDescription(result: ArtistActionResult) {
  const parts = []

  if (result.sheetName) {
    parts.push(result.sheetName)
  }

  if (typeof result.rowNumber === 'number') {
    parts.push(`row ${result.rowNumber}`)
  }

  return parts.join(', ') || undefined
}

function isApprovedDocument(
  props: Parameters<DocumentActionComponent>[0],
  document: ApprovalDocumentState | null,
) {
  if (props.type === 'workshopRegistration') {
    return document?.status === 'approved'
  }

  if (props.type === 'pssoundRequest') {
    return document?.status === 'confirmed'
  }

  return document?.approved === true
}

function isLocalStudio() {
  if (typeof window === 'undefined') {
    return false
  }

  return isLocalHostname(window.location.hostname)
}

function isLocalHostname(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0'
}

function isLocalOrigin(origin: string) {
  try {
    return isLocalHostname(new URL(origin).hostname)
  } catch {
    return false
  }
}

function getSyncApiOrigin() {
  if (EXPLICIT_SYNC_API_ORIGIN) {
    if (!isLocalStudio() && isLocalOrigin(EXPLICIT_SYNC_API_ORIGIN)) {
      return PRODUCTION_FRONTEND_ORIGIN
    }

    return EXPLICIT_SYNC_API_ORIGIN
  }

  if (isLocalStudio()) {
    return LOCAL_FRONTEND_ORIGIN
  }

  return PREVIEW_ORIGIN === LOCAL_FRONTEND_ORIGIN ? PRODUCTION_FRONTEND_ORIGIN : PREVIEW_ORIGIN
}

function buildSuccessMessage(result: ArtistActionResult) {
  const description = buildSuccessDescription(result)
  const prefix = result.updated ? 'Google Sheet updated' : 'Google Sheet synced'

  return description ? `${prefix}: ${description}` : prefix
}

function buildArtistSheetClause(result: ArtistActionResult) {
  if (result.sheetSyncError) {
    return `Google Sheet sync failed: ${result.sheetSyncError}`
  }

  const description = buildSuccessDescription(result)
  if (description) {
    return `Google Sheet synced: ${description}`
  }

  if (result.synced) {
    return 'Google Sheet synced'
  }

  return undefined
}

function joinMessageParts(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join('. ')
}

function buildApprovalMessage(result: ArtistActionResult, documentType: string) {
  const isArtist = documentType === 'artist'
  const isPssoundRequest = documentType === 'pssoundRequest'
  const blockedSuffix =
    isPssoundRequest && result.blockedDatesUpdated ? ' Dates blocked in the calendar.' : ''

  if (isArtist) {
    const sheetClause = buildArtistSheetClause(result)

    if (result.sent) {
      return joinMessageParts('Approval email sent', sheetClause)
    }

    if (result.reason === 'already sent') {
      return joinMessageParts('Approval email was already sent', sheetClause)
    }

    if (result.reason) {
      return joinMessageParts(sheetClause, `Approval email not sent: ${result.reason}`)
    }

    return sheetClause || 'Approval processed'
  }

  if (result.sent) {
    if (isPssoundRequest) {
      return `Confirmation email sent.${blockedSuffix}`
    }

    return 'Approval email sent'
  }

  if (result.reason === 'already sent') {
    if (isPssoundRequest) {
      return `Confirmation email was already sent.${blockedSuffix}`
    }

    return 'Approval email was already sent'
  }

  if (result.reason) {
    if (isPssoundRequest) {
      return `Confirmation email not sent: ${result.reason}.${blockedSuffix}`
    }

    return `Approval email not sent: ${result.reason}`
  }

  if (isPssoundRequest) {
    return `Confirmation processed.${blockedSuffix}`
  }

  return 'Approval processed'
}

function buildErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown sync error'
}

function notifyManualSyncResult(message: string) {
  if (typeof window !== 'undefined') {
    window.alert(message)
  }
}

async function syncArtist(documentId: string) {
  const response = await fetch(`${getSyncApiOrigin()}/api/google-sheets/artist-sync`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({documentId, force: true}),
  })

  const payload = (await response.json().catch(() => null)) as ArtistActionResponse | null

  if (!response.ok || !payload?.success || !payload.result) {
    throw new Error(payload?.error || payload?.result?.reason || 'Artist sheet sync failed')
  }

  if (!payload.result.synced) {
    throw new Error(payload.result.reason || 'Artist sheet sync was skipped')
  }

  return payload.result
}

async function approveDocument(documentId: string, documentType: string) {
  const response = await fetch(`${getSyncApiOrigin()}/api/email/approval`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({documentId, documentType}),
  })

  const payload = (await response.json().catch(() => null)) as ArtistActionResponse | null

  if (!response.ok || !payload?.success || !payload.result) {
    throw new Error(payload?.error || payload?.result?.reason || 'Approval failed')
  }

  if (payload.result.handled === false) {
    throw new Error(payload.result.reason || 'Approval failed')
  }

  return payload.result
}

const syncArtistSheetAction: DocumentActionComponent = (props) => {
  const [isSyncing, setIsSyncing] = useState(false)
  const document = getDocumentState(props)

  if (!document?.approved) {
    return null
  }

  const hasUnpublishedChanges = Boolean(props.draft)
  const hasExistingSheetRow = Boolean(
    (props.published as ApprovalDocumentState | null)?.googleSheetsSheetName,
  )

  return {
    label: hasExistingSheetRow ? 'Update Google Sheet' : 'Sync Google Sheet',
    icon: CheckmarkCircleIcon,
    disabled: isSyncing || hasUnpublishedChanges,
    title: hasUnpublishedChanges
      ? 'Publish changes first to sync the latest approved version.'
      : undefined,
    onHandle: () => {
      if (isSyncing || hasUnpublishedChanges) {
        return
      }

      setIsSyncing(true)

      void syncArtist(props.id)
        .then((result) => {
          notifyManualSyncResult(buildSuccessMessage(result))
        })
        .catch((error) => {
          notifyManualSyncResult(`Google Sheet sync failed: ${buildErrorMessage(error)}`)
        })
        .finally(() => {
          setIsSyncing(false)
          props.onComplete()
        })
    },
  }
}

syncArtistSheetAction.displayName = 'SyncArtistGoogleSheetAction'

const processArtistApprovalAction: DocumentActionComponent = (props) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const document = getDocumentState(props)

  if (props.type !== 'artist' || !document?.approved || document.approvalEmailSentAt) {
    return null
  }

  const hasUnpublishedChanges = Boolean(props.draft)

  return {
    label: 'Send approval email + sync sheet',
    icon: CheckmarkCircleIcon,
    disabled: isProcessing || hasUnpublishedChanges,
    title: hasUnpublishedChanges
      ? 'Publish changes first so the email and Google Sheet use the approved version.'
      : undefined,
    onHandle: () => {
      if (isProcessing || hasUnpublishedChanges) {
        return
      }

      setIsProcessing(true)

      void approveDocument(props.id, props.type)
        .then((result) => {
          notifyManualSyncResult(buildApprovalMessage(result, props.type))
        })
        .catch((error) => {
          notifyManualSyncResult(`Approval handling failed: ${buildErrorMessage(error)}`)
        })
        .finally(() => {
          setIsProcessing(false)
          props.onComplete()
        })
    },
  }
}

processArtistApprovalAction.displayName = 'ProcessArtistApprovalAction'

const processPssoundRequestApprovalAction: DocumentActionComponent = (props) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const document = getDocumentState(props)

  if (props.type !== 'pssoundRequest') {
    return null
  }

  const isApproved = isApprovedDocument(props, document)
  if (!isApproved) {
    return null
  }

  const hasUnpublishedChanges = Boolean(props.draft)

  return {
    label: document?.approvalEmailSentAt
      ? 'Update blocked dates'
      : 'Send confirmation email + block dates',
    icon: CheckmarkCircleIcon,
    disabled: isProcessing || hasUnpublishedChanges,
    title: hasUnpublishedChanges
      ? 'Publish changes first so the email and blocked dates use the latest request.'
      : undefined,
    onHandle: () => {
      if (isProcessing || hasUnpublishedChanges) {
        return
      }

      setIsProcessing(true)

      void approveDocument(props.id, props.type)
        .then((result) => {
          notifyManualSyncResult(buildApprovalMessage(result, props.type))
        })
        .catch((error) => {
          notifyManualSyncResult(`Confirmation handling failed: ${buildErrorMessage(error)}`)
        })
        .finally(() => {
          setIsProcessing(false)
          props.onComplete()
        })
    },
  }
}

processPssoundRequestApprovalAction.displayName = 'ProcessPssoundRequestApprovalAction'

export const artistDocumentActions: DocumentActionsResolver = (previousActions, context) => {
  if (!APPROVAL_SCHEMA_TYPES.has(context.schemaType)) {
    return previousActions
  }

  if (context.schemaType === 'artist') {
    return [...previousActions, processArtistApprovalAction, syncArtistSheetAction]
  }

  if (context.schemaType === 'pssoundRequest') {
    return [...previousActions, processPssoundRequestApprovalAction]
  }

  return previousActions
}
