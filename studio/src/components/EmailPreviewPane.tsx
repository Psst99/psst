import {useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {Box, Card, Flex, Heading, Stack, Text} from '@sanity/ui'
import {
  EMAIL_MESSAGE_DEFAULTS,
  EMAIL_TEMPLATE_KEYS,
  EMAIL_TEMPLATE_LABELS,
  type EmailMessageDefaults,
  type EmailTemplateKey,
} from '../lib/emailTemplates'
import {
  getPreviewDefinition,
  getPreviewRouteId,
  interpolatePreviewText,
} from '../../../frontend/lib/email/preview'
import {createEmailTheme} from '../../../frontend/lib/email/theme'
import {buildThemeOverrides} from '../../../frontend/lib/theme/overrides'

type EmailSettingsDoc = {
  fromName?: string
  fromEmail?: string
  replyTo?: string
} & Partial<Record<EmailTemplateKey, Partial<EmailMessageDefaults>>>

type EmailPreviewPaneProps = {
  document: {
    displayed: Partial<EmailSettingsDoc>
  }
}

type ColorValue = string | {hex?: string; value?: string}

type ThemeDoc = {
  sectionColors?: Record<string, {background?: ColorValue; foreground?: ColorValue} | undefined>
}

const themeQuery =
  'coalesce(*[_id == "drafts.themeSettings"][0], *[_id == "themeSettings"][0]){sectionColors}'

function resolveMessage(
  doc: Partial<EmailSettingsDoc>,
  key: EmailTemplateKey,
): EmailMessageDefaults {
  return {
    ...EMAIL_MESSAGE_DEFAULTS[key],
    ...(doc[key] ?? {}),
  }
}

export default function EmailPreviewPane({document}: EmailPreviewPaneProps) {
  const [selectedKey, setSelectedKey] = useState<EmailTemplateKey>('databaseReceived')
  const [themeDoc, setThemeDoc] = useState<ThemeDoc | null>(null)
  const client = useClient({apiVersion: '2024-10-28'})
  const doc = document.displayed

  useEffect(() => {
    let subscribed = true

    client
      .fetch<ThemeDoc | null>(themeQuery)
      .then((nextDoc) => {
        if (subscribed) setThemeDoc(nextDoc)
      })
      .catch(() => {
        if (subscribed) setThemeDoc(null)
      })

    const subscription = client.listen<ThemeDoc>(themeQuery).subscribe((event) => {
      if (event.result && subscribed) {
        setThemeDoc(event.result)
      }
    })

    return () => {
      subscribed = false
      subscription.unsubscribe()
    }
  }, [client])

  const message = useMemo(() => resolveMessage(doc, selectedKey), [doc, selectedKey])
  const themeOverrides = useMemo(
    () => buildThemeOverrides(themeDoc?.sectionColors ?? null),
    [themeDoc],
  )
  const preview = useMemo(() => {
    const definition = getPreviewDefinition(selectedKey)

    return {
      ...definition,
      theme: createEmailTheme(selectedKey, themeOverrides),
    }
  }, [selectedKey, themeOverrides])

  const fromName = doc.fromName || 'PSST'
  const fromEmail = doc.fromEmail || 'info@psst.space'
  const routeId = getPreviewRouteId(selectedKey)

  const rendered = {
    subject: interpolatePreviewText(message.subject, preview.variables),
    previewText: interpolatePreviewText(message.previewText, preview.variables),
    heading: interpolatePreviewText(message.heading, preview.variables),
    intro: interpolatePreviewText(message.intro, preview.variables),
    notice: interpolatePreviewText(message.notice, preview.variables),
    footer: interpolatePreviewText(message.footer, preview.variables),
    disclaimer: interpolatePreviewText(message.disclaimer, preview.variables),
  }
  const hasNotice = rendered.notice.trim().length > 0
  const hasFooter = rendered.footer.trim().length > 0

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Flex justify="space-between" align="center" gap={3} wrap="wrap">
          <Stack space={2}>
            <Heading size={2}>Email Preview</Heading>
            <Text muted size={1}>
              Save edits in the form tab, then use this preview to check copy and the shared email
              layout.
            </Text>
          </Stack>

          <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center'}}>
            <select
              value={selectedKey}
              onChange={(event) => setSelectedKey(event.target.value as EmailTemplateKey)}
              style={{
                minWidth: 280,
                border: '1px solid #d9d9e0',
                borderRadius: 6,
                padding: '10px 12px',
                fontSize: 14,
                background: '#fff',
              }}
            >
              {EMAIL_TEMPLATE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {EMAIL_TEMPLATE_LABELS[key]}
                </option>
              ))}
            </select>

            <a
              href={`http://localhost:3000/email-preview/${routeId}`}
              target="_blank"
              rel="noreferrer"
              style={{fontSize: 13, color: '#556', textDecoration: 'underline'}}
            >
              Open Sanity-backed preview
            </a>

            <a
              href={`http://localhost:3001/preview/${routeId}`}
              target="_blank"
              rel="noreferrer"
              style={{fontSize: 13, color: '#556', textDecoration: 'underline'}}
            >
              Open React Email preview
            </a>
          </div>
        </Flex>

        <Card
          padding={3}
          radius={2}
          border
          tone={message.enabled === false ? 'caution' : 'default'}
        >
          <Stack space={2}>
            <Text size={1} weight="semibold">
              {message.enabled === false ? 'Disabled' : 'Enabled'}
            </Text>
            <Text size={1}>
              From: {fromName} &lt;{fromEmail}&gt;
            </Text>
            <Text size={1}>Subject: {rendered.subject}</Text>
            <Text size={1}>Preview: {rendered.previewText}</Text>
          </Stack>
        </Card>

        <div
          style={{
            maxWidth: 760,
            overflow: 'hidden',
            background: preview.theme.shellBg,
            color: preview.theme.shellFg,
            borderRadius: 18,
            padding: '44px 14px',
          }}
        >
          <div
            style={{
              background: preview.theme.panelBg,
              color: preview.theme.panelFg,
              borderRadius: 28,
              boxShadow: preview.theme.shadow,
              overflow: 'hidden',
            }}
          >
            <div style={{padding: 28}}>
              {preview.card ? (
                <div style={{marginTop: 22}}>
                  <table role="presentation" style={{width: '100%', borderCollapse: 'collapse'}}>
                    <tbody>
                      <tr>
                        <td style={{padding: 0, verticalAlign: 'top'}}>
                          <div
                            style={{
                              margin: 0,
                              fontSize: 34,
                              fontWeight: 500,
                              letterSpacing: -0.6,
                              lineHeight: 1.05,
                              color: preview.theme.panelFg,
                            }}
                          >
                            {preview.card.title}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: 0,
                            verticalAlign: 'top',
                            textAlign: 'right',
                            width: 36,
                          }}
                        >
                          {preview.card.actionUrl ? (
                            <a
                              href={preview.card.actionUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: preview.theme.linkFg,
                                textDecoration: 'none',
                                fontSize: 24,
                                lineHeight: 1,
                                paddingLeft: 12,
                              }}
                            >
                              ↗
                            </a>
                          ) : null}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {preview.card.categories && preview.card.categories.length > 0 && (
                    <div style={{marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                      {preview.card.categories.map((category) => (
                        <span
                          key={category}
                          style={{
                            display: 'inline-block',
                            background: preview.theme.categoryBg,
                            color: preview.theme.categoryFg,
                            border: `2px solid ${preview.theme.categoryBorder}`,
                            padding: '2px 2px',
                            fontSize: 16,
                            lineHeight: 1,
                            textTransform: 'uppercase',
                          }}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}

                  {preview.card.description && (
                    <div
                      style={{
                        marginTop: 20,
                        fontSize: 15,
                        lineHeight: 1.5,
                        color: preview.theme.panelFg,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {preview.card.description}
                    </div>
                  )}

                  {preview.card.meta && preview.card.meta.length > 0 && (
                    <div style={{marginTop: 12}}>
                      {preview.card.meta.map((item) => (
                        <div key={`${item.label}-${item.value}`} style={{marginTop: 14}}>
                          <div
                            style={{
                              margin: 0,
                              fontSize: 12,
                              fontWeight: 600,
                              letterSpacing: -0.6,
                              textTransform: 'uppercase',
                              color: preview.theme.panelFg,
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 15,
                              lineHeight: 1.5,
                              color: preview.theme.panelFg,
                            }}
                          >
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {preview.card.tags && preview.card.tags.length > 0 && (
                    <div style={{marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                      {preview.card.tags.map((tag) => (
                        <span
                          key={tag.title}
                          style={{
                            display: 'inline-block',
                            background: tag.bg,
                            color: tag.fg,
                            border: `2px solid ${tag.bd}`,
                            borderRadius: 999,
                            padding: '4px 8px',
                            fontSize: 12,
                            lineHeight: 1,
                            textTransform: 'lowercase',
                          }}
                        >
                          {tag.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {preview.card.links && preview.card.links.length > 0 && (
                    <div style={{marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                      {preview.card.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{color: preview.theme.linkFg, textDecoration: 'underline'}}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              background: preview.theme.linkBg,
                              color: preview.theme.linkFg,
                              border: `1px solid ${preview.theme.linkBorder}`,
                              borderRadius: 4,
                              padding: '4px 8px',
                              fontSize: 12,
                              lineHeight: 1,
                            }}
                          >
                            {link.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div
                    style={{
                      margin: 0,
                      fontSize: 34,
                      fontWeight: 500,
                      letterSpacing: -0.6,
                      lineHeight: 1.05,
                      color: preview.theme.panelFg,
                    }}
                  >
                    {rendered.heading}
                  </div>
                  <div
                    style={{
                      marginTop: 20,
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: preview.theme.panelFg,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {rendered.intro}
                  </div>
                </>
              )}
            </div>
          </div>

          {hasNotice ? (
            <div
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 16,
                borderLeft: `10px solid ${preview.theme.noticeBorder}`,
                background: preview.theme.noticeBg,
                color: preview.theme.noticeFg,
                fontSize: 14,
                lineHeight: 1.75,
                whiteSpace: 'pre-line',
              }}
            >
              {rendered.notice}
            </div>
          ) : null}

          {hasFooter ? (
            <div
              style={{margin: '18px 0 0', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line'}}
            >
              {rendered.footer}
            </div>
          ) : null}
          <div
            style={{
              textAlign: 'center',
              margin: '16px 0 0',
              fontSize: 12,
              lineHeight: 1.6,
              color: preview.theme.disclaimer,
              whiteSpace: 'pre-line',
            }}
          >
            {rendered.disclaimer}
          </div>
        </div>
      </Stack>
    </Box>
  )
}
