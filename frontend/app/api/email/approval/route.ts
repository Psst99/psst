import {NextRequest, NextResponse} from 'next/server'
import {client} from '@/sanity/lib/client'
import {sendApprovalEmailForDocument} from '@/lib/email/approval'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Email-Webhook-Secret',
}

function resolveBaseUrl(req: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')

  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  const proto = req.headers.get('x-forwarded-proto') ?? 'https'
  if (host) return `${proto}://${host}`

  return new URL(req.url).origin
}

function hasValidSecret(req: NextRequest) {
  const secret = process.env.EMAIL_WEBHOOK_SECRET?.trim()
  if (!secret) return true

  const authorization = req.headers.get('authorization') ?? ''
  const bearer = authorization.replace(/^Bearer\s+/i, '').trim()
  const headerSecret = req.headers.get('x-email-webhook-secret')?.trim()

  return bearer === secret || headerSecret === secret
}

async function readPayload(req: NextRequest) {
  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return (await req.json().catch(() => null)) as Record<string, unknown> | null
  }

  const rawBody = await req.text().catch(() => '')
  if (!rawBody) {
    return null
  }

  return JSON.parse(rawBody) as Record<string, unknown>
}

function jsonResponse(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...CORS_HEADERS,
      ...(init?.headers ?? {}),
    },
  })
}

function readDocumentId(payload: Record<string, unknown>) {
  const direct = payload.documentId ?? payload._id ?? payload.id
  if (typeof direct === 'string') return direct

  const ids = payload.ids
  if (ids && typeof ids === 'object') {
    const values = Object.values(ids as Record<string, unknown>).flat()
    const first = values.find((value): value is string => typeof value === 'string')
    if (first) return first
  }

  return undefined
}

function readDocumentType(payload: Record<string, unknown>) {
  const value = payload.documentType ?? payload._type ?? payload.type
  return typeof value === 'string' ? value : undefined
}

async function fetchDocumentType(documentId: string) {
  return client
    .withConfig({useCdn: false})
    .fetch<string | null>(`*[_id == $id][0]._type`, {id: documentId.replace(/^drafts\./, '')})
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function POST(req: NextRequest) {
  if (!hasValidSecret(req)) {
    return jsonResponse({success: false, error: 'Unauthorized'}, {status: 401})
  }

  const payload = await readPayload(req).catch(() => null)
  if (!payload) {
    return jsonResponse({success: false, error: 'Invalid JSON payload'}, {status: 400})
  }

  const documentId = readDocumentId(payload)
  if (!documentId) {
    return jsonResponse({success: false, error: 'Missing document id'}, {status: 400})
  }

  const documentType = readDocumentType(payload) ?? (await fetchDocumentType(documentId))
  if (!documentType) {
    return jsonResponse({success: false, error: 'Missing document type'}, {status: 400})
  }

  try {
    const result = await sendApprovalEmailForDocument(documentId, documentType, resolveBaseUrl(req))
    return jsonResponse({success: true, result})
  } catch (error) {
    console.error('Approval email webhook failed:', error)
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Approval email webhook failed',
      },
      {status: 500},
    )
  }
}
