import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import type {EmailCard, EmailRenderContent, EmailTheme} from '@/lib/email/types'

type PsstFormEmailProps = {
  content?: EmailRenderContent
  card?: EmailCard
  theme?: EmailTheme
}

const defaultContent: EmailRenderContent = {
  enabled: true,
  from: 'PSST <info@psst.space>',
  subject: 'PSST email preview',
  previewText: 'Preview text for the email.',
  heading: 'Email heading',
  intro: 'This is the main email intro copy. It can include a short confirmation or approval note.',
  notice: 'This is the secondary notice area.',
  footer: 'With care,\nPSST',
  disclaimer: 'Automated email preview.',
}

const defaultCard: EmailCard = {
  title: 'DJ Sample',
  description: 'A short card preview appears here when an approved item is live.',
  categories: ['DJ', 'Producer'],
  actionUrl: 'https://psst.space',
  tags: [
    {title: 'techno', bg: '#DFFF3D', fg: '#A20018', bd: '#DFFF3D'},
    {title: 'community', bg: '#00FFDD', fg: '#4E4E4E', bd: '#00FFDD'},
  ],
  links: [{label: 'SoundCloud', url: 'https://soundcloud.com'}],
}

const defaultTheme: EmailTheme = {
  shellBg: '#5B00FF',
  shellFg: '#FFFFFF',
  panelBg: '#FFFFFF',
  panelFg: '#5B00FF',
  categoryBg: '#5B00FF',
  categoryFg: '#FFFFFF',
  categoryBorder: '#5B00FF',
  linkBg: '#FFFFFF',
  linkFg: '#5B00FF',
  linkBorder: '#5B00FF',
  noticeBg: '#F4EEFF',
  noticeFg: '#4A16D6',
  noticeBorder: '#5B00FF',
  disclaimer: 'rgba(255,255,255,0.9)',
  shadow: '0 18px 60px rgba(0,0,0,0.18)',
}

function lines(value: string) {
  const parts = value.split('\n')

  return parts.map((line, index) => (
    <span key={`line-${index}`}>
      {line}
      {index < parts.length - 1 ? <br /> : null}
    </span>
  ))
}

const Chip = ({children, style}: {children: React.ReactNode; style?: React.CSSProperties}) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: 10,
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

const ChipRow = ({children, style}: {children: React.ReactNode; style?: React.CSSProperties}) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 6,
      ...style,
    }}
  >
    {children}
  </div>
)

const LinkItem = ({label, url, theme}: {label: string; url: string; theme: EmailTheme}) => (
  <Link href={url} style={styles.link}>
    <Chip
      style={{
        backgroundColor: theme.linkBg,
        color: theme.linkFg,
        border: `1px solid ${theme.linkBorder}`,
        borderRadius: 4,
        padding: '4px 8px',
      }}
    >
      {label}
    </Chip>
  </Link>
)

const CardAction = ({href, theme}: {href: string; theme: EmailTheme}) => (
  <Link
    href={href}
    style={{
      display: 'inline-block',
      color: theme.linkFg,
      textDecoration: 'none',
      fontSize: 24,
      lineHeight: 1,
      paddingLeft: 12,
    }}
  >
    ↗
  </Link>
)

const KV = ({label, value, theme}: {label: string; value: string; theme: EmailTheme}) => (
  <div style={{marginTop: 14}}>
    <Text style={{...styles.k, color: theme.panelFg}}>{label}</Text>
    <Text style={{...styles.v, color: theme.panelFg}}>{lines(value)}</Text>
  </div>
)

const CardPreview = ({card, theme}: {card: EmailCard; theme: EmailTheme}) => (
  <div style={{marginTop: 22}}>
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{borderCollapse: 'collapse'}}
    >
      <tbody>
        <tr>
          <td style={{padding: 0, verticalAlign: 'top'}}>
            <Heading as="h2" style={{...styles.modalTitle, color: theme.panelFg}}>
              {card.title}
            </Heading>
          </td>
          <td style={{padding: 0, verticalAlign: 'top', textAlign: 'right', width: 36}}>
            {card.actionUrl ? <CardAction href={card.actionUrl} theme={theme} /> : null}
          </td>
        </tr>
      </tbody>
    </table>

    {card.categories && card.categories.length > 0 && (
      <ChipRow>
        {card.categories.map((category) => (
          <Chip
            key={category}
            style={{
              backgroundColor: theme.categoryBg,
              color: theme.categoryFg,
              border: `2px solid ${theme.categoryBorder}`,
              borderRadius: 0,
              textTransform: 'uppercase',
              fontSize: 16,
              padding: '2px 2px',
            }}
          >
            {category}
          </Chip>
        ))}
      </ChipRow>
    )}

    {card.imageUrl && <Img src={card.imageUrl} alt="" width="640" style={styles.cardImage} />}

    {card.description && (
      <Text style={{...styles.v, color: theme.panelFg}}>{lines(card.description)}</Text>
    )}
    {card.meta && card.meta.length > 0 && (
      <div style={{marginTop: 12}}>
        {card.meta.map((item) => (
          <KV
            key={`${item.label}-${item.value}`}
            label={item.label}
            value={item.value}
            theme={theme}
          />
        ))}
      </div>
    )}

    {card.tags && card.tags.length > 0 && (
      <ChipRow style={{marginTop: 20}}>
        {card.tags.map((tag) => (
          <Chip
            key={tag.title}
            style={{
              backgroundColor: tag.bg,
              color: tag.fg,
              border: `2px solid ${tag.bd}`,
              borderRadius: 999,
              textTransform: 'lowercase',
            }}
          >
            {tag.title}
          </Chip>
        ))}
      </ChipRow>
    )}

    {card.links && card.links.length > 0 && (
      <ChipRow style={{marginTop: 20}}>
        {card.links.map((link) => (
          <LinkItem key={link.url} label={link.label} url={link.url} theme={theme} />
        ))}
      </ChipRow>
    )}
  </div>
)

export const PsstFormEmail = ({
  content = defaultContent,
  card,
  theme = defaultTheme,
}: PsstFormEmailProps) => (
  <Html>
    <Head />
    <Preview>{content.previewText}</Preview>

    <Body style={{...styles.main, backgroundColor: theme.shellBg, color: theme.shellFg}}>
      <Container style={styles.container}>
        <Section
          style={{
            ...styles.panel,
            backgroundColor: theme.panelBg,
            boxShadow: theme.shadow,
          }}
        >
          <Section style={styles.modalBody}>
            {card ? (
              <CardPreview card={card} theme={theme} />
            ) : (
              [
                <Heading key="heading" as="h2" style={{...styles.modalTitle, color: theme.panelFg}}>
                  {content.heading}
                </Heading>,
                <Text key="intro" style={{...styles.v, color: theme.panelFg}}>
                  {lines(content.intro)}
                </Text>,
              ]
            )}
          </Section>
        </Section>

        <Section
          style={{
            ...styles.notice,
            backgroundColor: theme.noticeBg,
            borderLeft: `10px solid ${theme.noticeBorder}`,
          }}
        >
          <Text style={{...styles.noticeText, color: theme.noticeFg}}>{lines(content.notice)}</Text>
        </Section>

        <Text style={{...styles.footer, color: theme.shellFg}}>{lines(content.footer)}</Text>
        <Text style={{...styles.disclaimer, color: theme.disclaimer}}>
          {lines(content.disclaimer)}
        </Text>
      </Container>
    </Body>
  </Html>
)

export default function PreviewEmail() {
  return <PsstFormEmail content={defaultContent} card={defaultCard} theme={defaultTheme} />
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    margin: 0,
    padding: 0,
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  },
  container: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '44px 14px',
  },
  panel: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  modalBody: {
    padding: 28,
  },
  h1: {
    margin: 0,
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: -0.2,
  },
  modalTitle: {
    margin: 0,
    fontSize: 34,
    fontWeight: 500,
    letterSpacing: -0.6,
  },
  cardImage: {
    marginTop: 20,
    width: '100%',
    maxWidth: 640,
    height: 'auto',
    display: 'block',
    borderRadius: 8,
  },
  k: {
    margin: 0,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: -0.6,
    textTransform: 'uppercase',
  },
  v: {
    margin: '20px 0 0',
    fontSize: 15,
    lineHeight: 1.5,
  },
  link: {
    textDecoration: 'underline',
    textUnderlineOffset: 2,
  },
  notice: {
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
  },
  noticeText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.75,
  },
  footer: {
    margin: '18px 0 0',
    fontSize: 14,
    lineHeight: 1.7,
  },
  disclaimer: {
    textAlign: 'center',
    margin: '16px 0 0',
    fontSize: 12,
    lineHeight: 1.6,
  },
}
