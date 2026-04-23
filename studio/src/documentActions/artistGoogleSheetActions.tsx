import {CheckmarkCircleIcon} from '@sanity/icons'
import {useEffect, useState} from 'react'
import {
  type DocumentActionComponent,
  type DocumentActionsResolver,
  useDocumentOperationEvent,
} from 'sanity'

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

  const {hostname} = window.location
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0'
}

function getSyncApiOrigin() {
  if (EXPLICIT_SYNC_API_ORIGIN) {
    return EXPLICIT_SYNC_API_ORIGIN
  }

  if (isLocalStudio()) {
    return LOCAL_FRONTEND_ORIGIN
  }

  return PREVIEW_ORIGIN
}

function buildSuccessMessage(result: ArtistActionResult) {
  const description = buildSuccessDescription(result)
  const prefix = result.updated ? 'Google Sheet updated' : 'Google Sheet synced'

  return description ? `${prefix}: ${description}` : prefix
}

function buildApprovalMessage(result: ArtistActionResult, documentType: string) {
  const isArtist = documentType === 'artist'
  const isPssoundRequest = documentType === 'pssoundRequest'
  const description = buildSuccessDescription(result)
  const blockedSuffix =
    isPssoundRequest && result.blockedDatesUpdated ? ' Dates blocked in the calendar.' : ''

  if (result.sent) {
    if (isPssoundRequest) {
      return `Confirmation email sent.${blockedSuffix}`
    }

    if (!isArtist) {
      return 'Approval email sent'
    }

    return description
      ? `Approval email sent. Google Sheet synced: ${description}`
      : 'Approval email sent and Google Sheet synced'
  }

  if (result.reason === 'already sent') {
    if (isPssoundRequest) {
      return `Confirmation email was already sent.${blockedSuffix}`
    }

    if (!isArtist) {
      return 'Approval email was already sent'
    }

    return description
      ? `Approval email was already sent. Google Sheet synced: ${description}`
      : 'Approval email was already sent'
  }

  if (result.reason) {
    if (isPssoundRequest) {
      return `Confirmation email not sent: ${result.reason}.${blockedSuffix}`
    }

    if (!isArtist) {
      return `Approval email not sent: ${result.reason}`
    }

    return description
      ? `Google Sheet synced: ${description}. Approval email not sent: ${result.reason}`
      : `Approval email not sent: ${result.reason}`
  }

  if (isPssoundRequest) {
    return `Confirmation processed.${blockedSuffix}`
  }

  return isArtist
    ? description
      ? `Google Sheet synced: ${description}`
      : 'Google Sheet synced'
    : 'Approval processed'
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

function createPublishAction(
  originalPublishAction: DocumentActionComponent,
): DocumentActionComponent {
  function ApprovalPublishAction(props: Parameters<DocumentActionComponent>[0]) {
    const originalResult = originalPublishAction(props)
    const publishEvent = useDocumentOperationEvent(props.id, props.type)
    const [pendingPublishAction, setPendingPublishAction] = useState<'sync' | 'approval' | null>(
      null,
    )

    useEffect(() => {
      if (!pendingPublishAction || publishEvent?.op !== 'publish') {
        return
      }

      if (publishEvent.type === 'error') {
        setPendingPublishAction(null)
        return
      }

      if (publishEvent.type !== 'success') {
        return
      }

      const action = pendingPublishAction
      setPendingPublishAction(null)

      const request =
        action === 'approval' ? approveDocument(props.id, props.type) : syncArtist(props.id)

      void request
        .then((result) => {
          if (action === 'approval') {
            if (props.type === 'pssoundRequest') {
              notifyManualSyncResult(buildApprovalMessage(result, props.type))
              return
            }

            if (
              result.sent ||
              result.reason === 'already sent' ||
              result.reason === 'resource email missing'
            ) {
              console.info(buildApprovalMessage(result, props.type))
              return
            }

            notifyManualSyncResult(buildApprovalMessage(result, props.type))
            return
          }

          console.info(buildSuccessMessage(result))
        })
        .catch((error) => {
          const approvalErrorPrefix =
            props.type === 'pssoundRequest'
              ? 'Confirmation handling failed'
              : 'Approval handling failed'

          notifyManualSyncResult(
            action === 'approval'
              ? `${approvalErrorPrefix}: ${buildErrorMessage(error)}`
              : `Google Sheet sync failed: ${buildErrorMessage(error)}`,
          )
        })
    }, [pendingPublishAction, props.id, props.type, publishEvent])

    if (!originalResult) {
      return null
    }

    const document = getDocumentState(props)
    const publishAction =
      APPROVAL_SCHEMA_TYPES.has(props.type) && isApprovedDocument(props, document)
        ? 'approval'
        : null

    return {
      ...originalResult,
      onHandle: () => {
        if (publishAction) {
          setPendingPublishAction(publishAction)
        }

        originalResult.onHandle?.()
      },
    }
  }

  ApprovalPublishAction.action = originalPublishAction.action
  ApprovalPublishAction.displayName = 'ApprovalPublishAction'

  return ApprovalPublishAction
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

  const actions = previousActions.map((action) =>
    action.action === 'publish' ? createPublishAction(action) : action,
  )

  if (context.schemaType === 'artist') {
    return [...actions, syncArtistSheetAction]
  }

  if (context.schemaType === 'pssoundRequest') {
    return [...actions, processPssoundRequestApprovalAction]
  }

  return actions
}
