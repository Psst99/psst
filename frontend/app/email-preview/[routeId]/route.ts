import {render} from '@react-email/components'
import * as React from 'react'
import {PsstFormEmail} from '@/emails/psst-form-email'
import {getPreviewEmailProps} from '@/emails/render-preview'
import {getPreviewTemplateKeyByRouteId} from '@/lib/email/preview'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  {params}: {params: Promise<{routeId: string}>},
) {
  const {routeId} = await params
  const templateKey = getPreviewTemplateKeyByRouteId(routeId)

  if (!templateKey) {
    return new Response('Email preview not found.', {status: 404})
  }

  const previewProps = await getPreviewEmailProps(templateKey)
  const html = await render(React.createElement(PsstFormEmail, previewProps))

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}
