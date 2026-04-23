import {
  artistEmailCard,
  formatDateList,
  pssoundRequestEmailCard,
  resourceEmailCard,
  workshopEmailCard,
} from './cards'
import {DEFAULT_EMAIL_MESSAGES, EMAIL_TEMPLATE_KEYS, type EmailTemplateKey} from './defaults'
import {createEmailTheme} from './theme'
import type {ThemeOverrides} from '../theme/sections'
import type {EmailCard, EmailRenderContent} from './types'

export type EmailPreviewVariables = Record<string, string>

export type EmailPreviewDefinition = {
  templateKey: EmailTemplateKey
  routeId: string
  label: string
  variables: EmailPreviewVariables
  card?: EmailCard
}

type PreviewRecord = Record<EmailTemplateKey, EmailPreviewDefinition>

const PREVIEW_DEFINITIONS: PreviewRecord = {
  databaseReceived: {
    templateKey: 'databaseReceived',
    routeId: 'artist-confirmation',
    label: 'Artist confirmation',
    variables: {
      artistName: 'Artist Name',
      email: 'submitter@example.com',
    },
  },
  databaseApproved: {
    templateKey: 'databaseApproved',
    routeId: 'artist-approved',
    label: 'Artist approved',
    variables: {
      artistName: 'Artist Name',
      email: 'submitter@example.com',
      publicUrl: 'https://psst.space/database/artists/artist-name',
    },
    card: artistEmailCard({
      artistName: 'Artist Name',
      description:
        'A short artist description appears here, matching the public database card preview.',
      categories: [{title: 'DJ'}, {title: 'Producer'}],
      tags: [{title: 'techno'}, {title: 'community'}, {title: 'radio'}],
      links: [
        {platform: 'SoundCloud', url: 'https://soundcloud.com/artist-name'},
        {platform: 'Instagram', url: 'https://instagram.com/artist-name'},
      ],
      publicUrl: 'https://psst.space/database/artists/artist-name',
    }),
  },
  resourceReceived: {
    templateKey: 'resourceReceived',
    routeId: 'resource-confirmation',
    label: 'Resource confirmation',
    variables: {
      title: 'Mutual Aid Sound Archive',
      email: 'submitter@example.com',
    },
  },
  resourceApproved: {
    templateKey: 'resourceApproved',
    routeId: 'resource-approved',
    label: 'Resource approved',
    variables: {
      title: 'Mutual Aid Sound Archive',
      email: 'submitter@example.com',
      publicUrl: 'https://psst.space/resources/items/resource.sample',
    },
    card: resourceEmailCard({
      title: 'Mutual Aid Sound Archive',
      description: 'A reference resource submitted by the community and reviewed by the PSST team.',
      categories: ['TEXT'],
      tags: [{title: 'archive'}, {title: 'sound'}],
      url: 'https://psst.space/resources/toolkit',
      publicUrl: 'https://psst.space/resources/items/resource.sample',
    }),
  },
  workshopReceived: {
    templateKey: 'workshopReceived',
    routeId: 'workshop-confirmation',
    label: 'Workshop confirmation',
    variables: {
      name: 'Alex',
      email: 'submitter@example.com',
      workshopTitle: 'Introduction to Live Sound',
      selectedDates: formatDateList(['2026-05-12', '2026-05-13']),
    },
  },
  workshopApproved: {
    templateKey: 'workshopApproved',
    routeId: 'workshop-approved',
    label: 'Workshop approved',
    variables: {
      name: 'Alex',
      email: 'submitter@example.com',
      workshopTitle: 'Introduction to Live Sound',
      selectedDates: formatDateList(['2026-05-12', '2026-05-13']),
      publicUrl: 'https://psst.space/workshops/w/introduction-to-live-sound',
    },
    card: workshopEmailCard({
      title: 'Introduction to Live Sound',
      description:
        'A practical workshop for shared technical confidence, collective care and hands-on sound system setup.',
      location: 'PSST Studio',
      dates: ['2026-05-12', '2026-05-13'],
      selectedDates: ['2026-05-12', '2026-05-13'],
      tags: [{title: 'sound'}, {title: 'workshop'}],
      publicUrl: 'https://psst.space/workshops/w/introduction-to-live-sound',
    }),
  },
  pssoundRequestReceived: {
    templateKey: 'pssoundRequestReceived',
    routeId: 'pssound-request-confirmation',
    label: 'Pssound request confirmation',
    variables: {
      collectiveName: 'Sample Collective',
      eventTitle: 'Community Fundraiser',
      eventDate: '24/05/2026',
      pickupDate: '23/05/2026',
      returnDate: '25/05/2026',
    },
  },
  pssoundRequestApproved: {
    templateKey: 'pssoundRequestApproved',
    routeId: 'pssound-request-confirmed',
    label: 'Pssound request confirmed',
    variables: {
      collectiveName: 'Sample Collective',
      eventTitle: 'Community Fundraiser',
      eventDate: '24/05/2026',
      pickupDate: '23/05/2026',
      returnDate: '25/05/2026',
      eventLocation: 'PSST Studio',
      lineup: 'DJ Sample, Live Artist',
    },
    card: pssoundRequestEmailCard({
      collectiveName: 'Sample Collective',
      eventTitle: 'Community Fundraiser',
      eventLink: 'https://psst.space/events/community-fundraiser',
      eventLocation: 'PSST Studio',
      eventDescription:
        'A community fundraiser with a shared sound system setup and a collectively managed team.',
      eventDate: '2026-05-24',
      pickupDate: '2026-05-23',
      returnDate: '2026-05-25',
      lineup: 'DJ Sample, Live Artist',
      wagePolicy: 'Transparent fee split across the artists and support team.',
      politicalContext: 'Feminist, fundraiser',
    }),
  },
  pssoundMembershipReceived: {
    templateKey: 'pssoundMembershipReceived',
    routeId: 'pssound-membership-confirmation',
    label: 'Pssound membership confirmation',
    variables: {
      collectiveName: 'Sample Collective',
      email: 'submitter@example.com',
    },
  },
  pssoundMembershipApproved: {
    templateKey: 'pssoundMembershipApproved',
    routeId: 'pssound-membership-approved',
    label: 'Pssound membership approved',
    variables: {
      collectiveName: 'Sample Collective',
      email: 'submitter@example.com',
      startDate: '01/06/2026',
    },
  },
}

export const EMAIL_PREVIEW_DEFINITIONS = EMAIL_TEMPLATE_KEYS.map((key) => PREVIEW_DEFINITIONS[key])

function valueForPath(variables: EmailPreviewVariables, path: string) {
  const value = path.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in current) {
      return (current as Record<string, unknown>)[part]
    }
    return undefined
  }, variables)

  if (value === null || value === undefined) return ''
  return String(value)
}

export function interpolatePreviewText(value: string, variables: EmailPreviewVariables) {
  return value.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key: string) => valueForPath(variables, key))
}

export function buildEmailContentFromDefaults(
  key: EmailTemplateKey,
  variables: EmailPreviewVariables,
  overrides?: {from?: string; replyTo?: string},
): EmailRenderContent {
  const message = DEFAULT_EMAIL_MESSAGES[key]

  return {
    enabled: message.enabled,
    subject: interpolatePreviewText(message.subject, variables),
    previewText: interpolatePreviewText(message.previewText, variables),
    heading: interpolatePreviewText(message.heading, variables),
    intro: interpolatePreviewText(message.intro, variables),
    notice: interpolatePreviewText(message.notice, variables),
    footer: interpolatePreviewText(message.footer, variables),
    disclaimer: interpolatePreviewText(message.disclaimer, variables),
    from: overrides?.from || 'PSST <info@psst.space>',
    replyTo: overrides?.replyTo || 'info@psst.space',
  }
}

export function getPreviewDefinition(key: EmailTemplateKey): EmailPreviewDefinition {
  return PREVIEW_DEFINITIONS[key]
}

export function getPreviewEmailData(key: EmailTemplateKey) {
  const definition = getPreviewDefinition(key)

  return {
    ...definition,
    theme: createEmailTheme(key),
    content: buildEmailContentFromDefaults(key, definition.variables),
  }
}

export function getPreviewEmailDataWithOverrides(
  key: EmailTemplateKey,
  overrides?: ThemeOverrides,
  content?: EmailRenderContent,
) {
  const definition = getPreviewDefinition(key)

  return {
    ...definition,
    theme: createEmailTheme(key, overrides),
    content: content ?? buildEmailContentFromDefaults(key, definition.variables),
  }
}

export function getPreviewRouteId(key: EmailTemplateKey) {
  return getPreviewDefinition(key).routeId
}
