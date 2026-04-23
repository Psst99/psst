import CmsContent from '@/components/CmsContent'
import {sanityFetch} from '@/sanity/lib/live'
import {formSuccessPagesQuery} from '@/sanity/lib/queries'

export type FormSuccessPageKey =
  | 'databaseSubmitContent'
  | 'resourceSubmitContent'
  | 'workshopRegistrationContent'
  | 'pssoundRequestContent'
  | 'pssoundMembershipContent'

type FormSuccessPagesData = Partial<Record<FormSuccessPageKey, unknown[]>>

const fallbackContent: Record<FormSuccessPageKey, unknown[]> = {
  databaseSubmitContent: successBox(
    'Database submission received.',
    'Thank you for adding to the database. Your submission is being reviewed and you will hear back from us soon.',
  ),
  resourceSubmitContent: successBox(
    'Resource submission received.',
    'Your resource submission has been received and will be reviewed shortly.',
  ),
  workshopRegistrationContent: successBox(
    'Workshop registration successful.',
    'Thank you for registering for the workshop. Your application is being reviewed and you will hear back from us soon.',
  ),
  pssoundRequestContent: successBox(
    'Pssound request received.',
    'Thank you for submitting your request. The team will review it and get back to you soon.',
  ),
  pssoundMembershipContent: successBox(
    'Membership request received.',
    'Thank you for applying to join Pssound. The team will review your membership request and get back to you soon.',
  ),
}

function successBox(title: string, body: string) {
  const key = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return [
    {
      _key: `${key}-box`,
      _type: 'highlightedBox',
      content: [
        {
          _key: `${key}-heading`,
          _type: 'block',
          style: 'h2',
          markDefs: [],
          children: [
            {
              _key: `${key}-heading-span`,
              _type: 'span',
              marks: [],
              text: title,
            },
          ],
        },
        {
          _key: `${key}-body`,
          _type: 'block',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _key: `${key}-body-span`,
              _type: 'span',
              marks: [],
              text: body,
            },
          ],
        },
      ],
    },
  ]
}

function hasContent(value: unknown[] | undefined): value is unknown[] {
  return Array.isArray(value) && value.length > 0
}

export async function FormSuccessPage({contentKey}: {contentKey: FormSuccessPageKey}) {
  const {data} = await sanityFetch({
    query: formSuccessPagesQuery,
  })
  const successPages = data as FormSuccessPagesData | null
  const content = hasContent(successPages?.[contentKey])
    ? successPages[contentKey]
    : fallbackContent[contentKey]

  return (
    <div className="p-6 min-[69.375rem]:px-20 min-[69.375rem]:pb-[calc(var(--home-nav-h)+4rem)] text-[color:var(--section-accent)]">
      <div className="w-full min-[69.375rem]:max-w-[65vw] mx-auto">
        <CmsContent value={content} />
      </div>
    </div>
  )
}
