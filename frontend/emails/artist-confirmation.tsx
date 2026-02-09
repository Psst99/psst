import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
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

interface CategoryProps {
  title: string
}

interface LinkItemProps {
  platform: string
  url: string
}

interface ArtistConfirmationEmailProps {
  artistName?: string
  pronouns?: string
  customPronouns?: string
  email?: string
  categories?: CategoryProps[]
  tags?: TagProps[]
  links?: LinkItemProps[]
  description?: string
}

/* =========================
   UI bits (email-safe)
   ========================= */

const Chip = ({children, style}: {children: React.ReactNode; style?: React.CSSProperties}) => (
  <span
    style={{
      display: 'inline-block',
      padding: '4px 8px',
      margin: '6px 8px 0 0',
      borderRadius: 10, // closer to your UI than “full pill”
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
      borderRadius: 999, // tags in your UI are more pill-like
      textTransform: 'lowercase',
    }}
  >
    {title}
  </Chip>
)

const Category = ({title}: CategoryProps) => (
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

const LinkItem = ({platform, url}: LinkItemProps) => (
  <div style={{marginTop: 10}}>
    <Link href={url} style={styles.link}>
      <Chip
        style={{
          backgroundColor: COLORS.white,
          color: COLORS.purple,
          border: `1px solid ${COLORS.purple}`,
          borderRadius: 4,
          padding: '4px 8px',
        }}
      >
        {platform}
      </Chip>
    </Link>
  </div>
)

const KV = ({label, children}: {label: string; children: React.ReactNode}) => (
  <div style={{marginTop: 14}}>
    <Text style={styles.k}>{label}</Text>
    <div style={{marginTop: 6}}>{children}</div>
  </div>
)

/* =========================
   Email
   ========================= */

export const ArtistConfirmationEmail = ({
  // Defaults so you can visualize the whole thing in preview immediately
  artistName = 'Artist Name',
  pronouns = 'they/them',
  customPronouns,
  email = 'artist@example.com',
  categories = [{title: 'DJ'}, {title: 'Producer'}],
  tags = [
    {title: 'Techno', bg: '#dfff3d', fg: '#A20018', bd: '#dfff3d'},
    {title: 'House', bg: '#07f25b', fg: '#81520A', bd: '#07f25b'},
    {title: 'Electronic', bg: '#00ffdd', fg: '#4E4E4E', bd: '#00ffdd'},
  ],
  links = [
    {platform: 'SoundCloud', url: 'https://soundcloud.com/artist'},
    {platform: 'Instagram', url: 'https://instagram.com/artist'},
  ],
  description = `This is a sample artist description that spans multiple lines
and shows how the description will appear in the email.`,
}: ArtistConfirmationEmailProps) => {
  const pronounDisplay =
    pronouns === 'other'
      ? customPronouns || '—'
      : pronouns === 'prefer_not_to_say'
        ? 'Prefer not to say'
        : pronouns || '—'

  return (
    <Html>
      <Head />
      <Preview>We got your database submission — {artistName}</Preview>

      <Body style={styles.main}>
        {/* Purple overlay background */}
        <Container style={styles.overlay}>
          {/* <Text style={styles.text}>
            Thanks for adding an entry. We’ll review it on a rolling basis and publish it once it’s
            ready. If you spot anything that needs changing, reply to this email and we’ll update it
            before it goes live.
          </Text> */}
          {/* White modal card */}
          <Section style={styles.modal}>
            <Section style={styles.modalBody}>
              <div style={{marginTop: 0}}>
                {/* Artist name acts like your modal title */}
                <Heading as="h2" style={styles.modalTitle}>
                  {artistName}
                </Heading>

                <div style={{marginTop: 6}}>
                  {categories.map((c, idx) => (
                    <Category key={`${c.title}-${idx}`} title={c.title} />
                  ))}
                </div>

                <div style={{marginTop: 20}}>
                  <Text style={{...styles.v, margin: 0}}>{description}</Text>
                </div>

                <div style={{marginTop: 20}}>
                  {tags.map((t, idx) => (
                    <Tag key={`${t.title}-${idx}`} {...t} />
                  ))}
                </div>

                <div style={{marginTop: 20, display: 'flex'}}>
                  {links.map((l, idx) => (
                    <LinkItem key={`${l.platform}-${idx}`} {...l} />
                  ))}
                </div>
              </div>
            </Section>
          </Section>

          <Section style={styles.notice}>
            <Text style={styles.noticeText}>
              <strong>Next:</strong> our collective reviews submissions regularly. If something is
              missing or unclear, we’ll reach out. Otherwise, you’ll see it appear in the database
              soon.
            </Text>
          </Section>

          <Text style={styles.footer}>
            With care,
            <br />
            <strong>Psst Mlle</strong>
            {/* <br />
            <span style={styles.footerSmall}>
              Questions:{' '}
              <Link href="mailto:database@psstmlle.space" style={styles.link}>
                database@psstmlle.space
              </Link>
            </span> */}
          </Text>

          <Text style={styles.disclaimer}>
            Automated confirmation. Reply only if you’d like to correct something.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ArtistConfirmationEmail

/* =========================
   Colors + styles
   ========================= */

const COLORS = {
  // tweak these two to match the site 1:1 once you paste your CSS tokens
  overlayPurple: '#B58BFF', // modal background purple
  purple: '#5B00FF', // strong PSST purple for headings + UI strokes

  purpleText: '#4A16D6', // body text purple-ish (like your modal copy)
  white: '#FFFFFF',
  line: 'rgba(91,0,255,0.18)',
  acid: '#DFFF3D',
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
    borderRadius: 28,
    overflow: 'hidden',
    // border: `3px solid ${COLORS.overlayPurple}`,
    boxShadow: '0 18px 60px rgba(0,0,0,0.18)',
  },

  headerStrip: {
    // backgroundColor: COLORS.overlayPurple,
    padding: 8,
  },

  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  brand: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
  },

  brandMark: {
    fontSize: 20,
    fontWeight: 900,
    letterSpacing: -0.4,
    color: COLORS.purple,
  },

  brandSub: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1.2,
    color: COLORS.purple,
  },

  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: COLORS.purple,
    color: COLORS.white,
    fontSize: 28,
    lineHeight: '44px',
    textAlign: 'center' as const,
    fontWeight: 200,
  },

  modalBody: {
    padding: 28,
  },

  h1: {
    margin: 0,
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: -0.2,
    color: COLORS.purple,
    // textTransform: 'uppercase',
  },

  modalTitle: {
    margin: 0,
    fontSize: 34,
    fontWeight: 500,
    letterSpacing: -0.6,
    color: COLORS.purple,
  },

  text: {
    margin: '0px 0 100px 0',
    fontSize: 15,
    lineHeight: 1.8,
    color: COLORS.white,
  },

  recap: {
    marginTop: 16,
    padding: 18,
    borderRadius: 18,
    border: `2px solid ${COLORS.line}`,
    backgroundColor: COLORS.white,
  },

  twoCol: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
  },

  col: {
    flex: '1 1 240px',
  },

  k: {
    margin: 0,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: -0.6,
    textTransform: 'uppercase',
    color: COLORS.purple,
  },

  v: {
    margin: '6px 0 0',
    fontSize: 15,
    lineHeight: 1.5,
    color: COLORS.purpleText,
  },

  hr: {
    borderColor: COLORS.line,
    margin: '16px 0',
  },

  notice: {
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F4EEFF',
    borderLeft: `10px solid ${COLORS.acid}`,
    // borderTop: `2px solid ${COLORS.line}`,
    // borderRight: `2px solid ${COLORS.line}`,
    // borderBottom: `2px solid ${COLORS.line}`,
  },

  noticeText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.75,
    color: COLORS.purpleText,
  },

  link: {
    color: COLORS.purple,
    textDecoration: 'underline',
    textUnderlineOffset: 2,
  },

  footer: {
    margin: '18px 0 0',
    fontSize: 14,
    lineHeight: 1.7,
    color: COLORS.white,
  },

  footerSmall: {
    fontSize: 13,
    color: COLORS.purpleText,
    opacity: 0.9,
  },

  disclaimer: {
    textAlign: 'center' as const,
    margin: '16px 0 0',
    fontSize: 12,
    lineHeight: 1.6,
    color: 'rgba(255,255,255,0.9)',
  },
}
