import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface TagProps {
  title: string
  bg: string
  fg: string
  bd: string
}

interface ResourceConfirmationEmailProps {
  title?: string
  email?: string
  categories?: string[]
  tags?: TagProps[]
  description?: string
  url?: string
  fileName?: string
}

const Chip = ({children, style}: {children: React.ReactNode; style?: React.CSSProperties}) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 8px',
      margin: '6px 8px 0 0',
      borderRadius: 6,
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: 12,
      letterSpacing: 0.1,
      lineHeight: 1,
      ...style,
    }}
  >
    {children}
  </span>
)

const Tag = ({title, bg, fg, bd}: TagProps) => (
  <Chip
    style={{
      backgroundColor: bg,
      color: fg,
      border: `2px solid ${bd}`,
      borderRadius: 999,
      textTransform: 'lowercase',
    }}
  >
    {title}
  </Chip>
)

const Category = ({title}: {title: string}) => (
  <Chip
    style={{
      backgroundColor: COLORS.purple,
      color: COLORS.white,
      border: `2px solid ${COLORS.purple}`,
      borderRadius: 0,
      textTransform: 'uppercase',
      fontSize: 16,
      padding: '2px 2px',
    }}
  >
    {title}
  </Chip>
)

export const ResourceConfirmationEmail = ({
  title = 'Resource title',
  email = 'you@example.com',
  categories = ['TEXT'],
  tags = [
    {title: 'techno', bg: '#dfff3d', fg: '#A20018', bd: '#dfff3d'},
    {title: 'history', bg: '#00ffdd', fg: '#4E4E4E', bd: '#00ffdd'},
  ],
  description = 'Short resource description goes here.',
  url,
  fileName,
}: ResourceConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>We got your resource submission — {title}</Preview>

      <Body style={styles.main}>
        <Container style={styles.overlay}>
          <Section style={styles.modal}>
            <Section style={styles.modalBody}>
              <Heading as="h2" style={styles.modalTitle}>
                {title}
              </Heading>

              <div style={{marginTop: 6}}>
                {categories.map((c, idx) => (
                  <Category key={`${c}-${idx}`} title={c} />
                ))}
              </div>

              <div style={{marginTop: 20}}>
                <Text style={{...styles.v, margin: 0}}>{description}</Text>
              </div>

              {tags.length > 0 && (
                <div style={{marginTop: 20}}>
                  {tags.map((t, idx) => (
                    <Tag key={`${t.title}-${idx}`} {...t} />
                  ))}
                </div>
              )}

              {url && (
                <div style={{marginTop: 20}}>
                  <Link href={url} style={styles.link}>
                    View link
                  </Link>
                </div>
              )}

              {fileName && (
                <div style={{marginTop: 16}}>
                  <Text style={styles.k}>Uploaded file</Text>
                  <Text style={{...styles.v, marginTop: 4}}>{fileName}</Text>
                </div>
              )}
            </Section>
          </Section>

          <Section style={styles.notice}>
            <Text style={styles.noticeText}>
              <strong>Next:</strong> we review submissions regularly. If something is missing, we
              will reach out. Otherwise, you will see it appear in resources soon.
            </Text>
          </Section>

          <Text style={styles.footer}>
            With care,
            <br />
            <strong>Psst Mlle</strong>
          </Text>

          <Text style={styles.disclaimer}>
            This is an automated confirmation for {email}. Reply if you need to correct anything.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ResourceConfirmationEmail

const COLORS = {
  overlayPurple: '#B58BFF',
  purple: '#5B00FF',
  purpleText: '#4A16D6',
  white: '#FFFFFF',
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    margin: 0,
    padding: 0,
    backgroundColor: COLORS.purple,
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  },
  overlay: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '44px 14px',
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
  },
  modalBody: {
    padding: '26px 24px 24px',
  },
  modalTitle: {
    margin: 0,
    fontSize: 28,
    color: COLORS.purple,
    letterSpacing: -0.4,
  },
  k: {
    margin: 0,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: COLORS.purpleText,
  },
  v: {
    margin: 0,
    fontSize: 16,
    lineHeight: '22px',
    color: COLORS.purpleText,
  },
  link: {
    display: 'inline-block',
    padding: '8px 12px',
    borderRadius: 6,
    border: `1px solid ${COLORS.purple}`,
    color: COLORS.purple,
    textDecoration: 'none',
    fontSize: 14,
  },
  notice: {
    marginTop: 18,
    padding: '14px 16px',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
  },
  noticeText: {
    margin: 0,
    color: COLORS.white,
    fontSize: 14,
    lineHeight: '20px',
  },
  footer: {
    marginTop: 22,
    color: COLORS.white,
    fontSize: 14,
  },
  disclaimer: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
}
