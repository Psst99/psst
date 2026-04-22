import {NextRequest, NextResponse} from 'next/server'
import {syncArtistDocumentToGoogleSheet} from '@/lib/google-sheets/artist-sync'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Email-Webhook-Secret',
}

function readDocumentId(payload: Record<string, unknown>) {
  const direct = payload.documentId ?? payload._id ?? payload.id
  if (typeof direct === 'string') return direct

  return undefined
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

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  })
}

export async function POST(req: NextRequest) {
  const payload = await readPayload(req).catch(() => null)
  if (!payload) {
    return jsonResponse({success: false, error: 'Invalid JSON payload'}, {status: 400})
  }

  const documentId = readDocumentId(payload)
  if (!documentId) {
    return jsonResponse({success: false, error: 'Missing document id'}, {status: 400})
  }

  const force = payload.force !== false

  try {
    const result = await syncArtistDocumentToGoogleSheet(documentId, {
      mode: 'approval',
      force,
    })

    return jsonResponse({success: true, result})
  } catch (error) {
    console.error('Artist sheet sync failed:', error)
    return jsonResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Artist sheet sync failed',
      },
      {status: 500},
    )
  }
}
