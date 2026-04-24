export type EmailRenderContent = {
  enabled: boolean
  subject: string
  previewText: string
  heading: string
  intro: string
  notice: string
  footer: string
  disclaimer: string
  from: string
  replyTo?: string
}

export type EmailTag = {
  title: string
  bg: string
  fg: string
  bd: string
}

export type EmailCard = {
  kind?: 'default' | 'workshop'
  title: string
  description?: string
  imageUrl?: string
  categories?: string[]
  dates?: string[]
  tags?: EmailTag[]
  actionUrl?: string
  links?: Array<{label: string; url: string}>
  meta?: Array<{label: string; value: string}>
}

export type EmailTheme = {
  shellBg: string
  shellFg: string
  panelBg: string
  panelFg: string
  categoryBg: string
  categoryFg: string
  categoryBorder: string
  linkBg: string
  linkFg: string
  linkBorder: string
  noticeBg: string
  noticeFg: string
  noticeBorder: string
  disclaimer: string
  shadow: string
}
