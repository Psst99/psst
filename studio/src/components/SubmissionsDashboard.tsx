import {useCallback, useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {IntentLink} from 'sanity/router'
import {Box, Button, Card, Flex, Grid, Heading, Spinner, Stack, Text} from '@sanity/ui'

type DashboardCounts = {
  openTotal: number
  database: number
  resources: number
  workshops: number
  newsletter: number
  pssoundMemberships: number
  pssoundRequests: number
  donationsToday: number
  emailErrors: number
}

type SubmissionItem = {
  _id: string
  _type: string
  title?: string
  email?: string
  date?: string
  status?: string
  detail?: string
  amount?: string
  currency?: string
  hasEmailError?: boolean
}

type DashboardData = {
  counts: DashboardCounts
  recent: SubmissionItem[]
}

const SUBMISSION_TYPES = [
  'artist',
  'resource',
  'workshopRegistration',
  'newsletterSubscription',
  'pssoundMembership',
  'pssoundRequest',
  'donationPaymentLog',
]

const dashboardQuery = `{
  "counts": {
    "openTotal": count(*[
      (_type == "artist" && submissionSource == "website" && coalesce(approved, false) == false) ||
      (_type == "resource" && submissionSource == "website" && coalesce(approved, false) == false) ||
      (_type == "workshopRegistration" && coalesce(status, "pending") == "pending") ||
      (_type == "newsletterSubscription" && coalesce(status, "pending") == "pending") ||
      (_type == "pssoundMembership" && coalesce(approved, false) == false) ||
      (_type == "pssoundRequest" && coalesce(status, "pending") == "pending" && coalesce(archived, false) == false)
    ]),
    "database": count(*[_type == "artist" && submissionSource == "website" && coalesce(approved, false) == false]),
    "resources": count(*[_type == "resource" && submissionSource == "website" && coalesce(approved, false) == false]),
    "workshops": count(*[_type == "workshopRegistration" && coalesce(status, "pending") == "pending"]),
    "newsletter": count(*[_type == "newsletterSubscription" && coalesce(status, "pending") == "pending"]),
    "pssoundMemberships": count(*[_type == "pssoundMembership" && coalesce(approved, false) == false]),
    "pssoundRequests": count(*[_type == "pssoundRequest" && coalesce(status, "pending") == "pending" && coalesce(archived, false) == false]),
    "donationsToday": count(*[_type == "donationPaymentLog" && dateTime(coalesce(paidAt, createdAt, _createdAt)) >= dateTime(now()) - 60 * 60 * 24]),
    "emailErrors": count(*[
      _type in ["artist", "resource", "workshopRegistration", "newsletterSubscription", "pssoundMembership", "pssoundRequest"] &&
      defined(emailDeliveryError)
    ])
  },
  "recent": *[
    (_type == "artist" && submissionSource == "website") ||
    (_type == "resource" && submissionSource == "website") ||
    _type in ["workshopRegistration", "newsletterSubscription", "pssoundMembership", "pssoundRequest", "donationPaymentLog"]
  ] | order(coalesce(lastSubmittedAt, submittedAt, registrationDate, paidAt, createdAt, _createdAt) desc)[0...24]{
    _id,
    _type,
    "date": coalesce(lastSubmittedAt, submittedAt, registrationDate, paidAt, createdAt, _createdAt),
    "title": coalesce(artistName, title, eventTitle, collectiveName, name, donorName, email, donorEmail),
    "email": coalesce(email, contactEmail, donorEmail),
    amount,
    currency,
    "hasEmailError": defined(emailDeliveryError),
    "detail": select(
      _type == "workshopRegistration" => workshop->title,
      _type == "newsletterSubscription" => sourcePath,
      _type == "pssoundRequest" => collective,
      _type == "donationPaymentLog" => status,
      null
    ),
    "status": select(
      _type == "artist" && coalesce(approved, false) == true => "Approved",
      _type == "artist" => "Pending",
      _type == "resource" && coalesce(approved, false) == true => "Approved",
      _type == "resource" => "Pending",
      _type == "pssoundMembership" && coalesce(approved, false) == true => "Approved",
      _type == "pssoundMembership" => "Pending",
      _type == "pssoundRequest" && status == "confirmed" => "Confirmed",
      _type == "pssoundRequest" => "Pending",
      _type == "workshopRegistration" => coalesce(status, "pending"),
      _type == "newsletterSubscription" => coalesce(status, "pending"),
      _type == "donationPaymentLog" => coalesce(status, "paid"),
      "Submitted"
    )
  }
}`

const listenQuery = `*[_type in $types]`

const countCards: Array<{
  key: keyof DashboardCounts
  title: string
  subtitle: string
}> = [
  {key: 'database', title: 'Database', subtitle: 'artist cards pending approval'},
  {key: 'resources', title: 'Resources', subtitle: 'submitted resources pending approval'},
  {key: 'workshops', title: 'Workshops', subtitle: 'registrations pending review'},
  {key: 'newsletter', title: 'Newsletter', subtitle: 'signups pending Infomaniak sync'},
  {key: 'pssoundMemberships', title: 'PSSOUND members', subtitle: 'membership requests pending'},
  {key: 'pssoundRequests', title: 'Loan requests', subtitle: 'sound-system requests pending'},
  {key: 'donationsToday', title: 'Donations today', subtitle: 'paid Mollie donations logged today'},
  {key: 'emailErrors', title: 'Email problems', subtitle: 'submissions with delivery errors'},
]

const typeLabels: Record<string, string> = {
  artist: 'Database',
  resource: 'Resource',
  workshopRegistration: 'Workshop',
  newsletterSubscription: 'Newsletter',
  pssoundMembership: 'PSSOUND membership',
  pssoundRequest: 'Loan request',
  donationPaymentLog: 'Donation',
}

const statusColors: Record<string, {background: string; foreground: string}> = {
  pending: {background: '#fff4d6', foreground: '#7a4a00'},
  approved: {background: '#e2f7e8', foreground: '#0f6b32'},
  synced: {background: '#e2f7e8', foreground: '#0f6b32'},
  confirmed: {background: '#e2f7e8', foreground: '#0f6b32'},
  paid: {background: '#e8f1ff', foreground: '#174f9a'},
  rejected: {background: '#ffe6e6', foreground: '#a80d0d'},
  waitlisted: {background: '#eeeef2', foreground: '#3d3d45'},
}

function formatRelativeDate(dateValue?: string) {
  if (!dateValue) return 'No date'

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'No date'

  const seconds = Math.round((date.getTime() - Date.now()) / 1000)
  const absoluteSeconds = Math.abs(seconds)

  if (absoluteSeconds < 60) return 'just now'

  const formatter = new Intl.RelativeTimeFormat('en', {numeric: 'auto'})
  const divisions: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [60, 'minute'],
    [60 * 60, 'hour'],
    [60 * 60 * 24, 'day'],
    [60 * 60 * 24 * 7, 'week'],
    [60 * 60 * 24 * 30, 'month'],
  ]

  for (const [amount, unit] of divisions) {
    if (absoluteSeconds < amount * 1.5) {
      return formatter.format(Math.round(seconds / amount), unit)
    }
  }

  return date.toLocaleDateString()
}

function getStatusStyle(status?: string) {
  return (
    statusColors[(status || '').toLowerCase()] ?? {
      background: '#f0f0f3',
      foreground: '#303038',
    }
  )
}

function getItemDetail(item: SubmissionItem) {
  if (item._type === 'donationPaymentLog' && item.amount) {
    return `${item.amount}${item.currency ? ` ${item.currency}` : ''}`
  }

  return item.detail || item.email || 'No extra details'
}

export default function SubmissionsDashboard() {
  const client = useClient({apiVersion: '2024-10-28'})
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)

    try {
      const nextData = await client.fetch<DashboardData>(dashboardQuery)
      setData(nextData)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load submissions')
    } finally {
      setIsRefreshing(false)
    }
  }, [client])

  useEffect(() => {
    let subscribed = true

    refresh()

    const subscription = client.listen(listenQuery, {types: SUBMISSION_TYPES}).subscribe(() => {
      if (subscribed) refresh()
    })

    return () => {
      subscribed = false
      subscription.unsubscribe()
    }
  }, [client, refresh])

  const openTotal = data?.counts.openTotal ?? 0
  const recent = useMemo(() => data?.recent ?? [], [data])

  return (
    <Box padding={4}>
      <Stack space={5}>
        <Flex justify="space-between" align="center" gap={3} wrap="wrap">
          <Stack space={2}>
            <Heading size={2}>Inbox Dashboard</Heading>
            <Text muted size={1}>
              One place to scan incoming website submissions and payment logs.
            </Text>
          </Stack>

          <Button
            text={isRefreshing ? 'Refreshing' : 'Refresh'}
            mode="ghost"
            tone="primary"
            onClick={refresh}
            disabled={isRefreshing}
          />
        </Flex>

        {error ? (
          <Card padding={3} radius={2} tone="critical" border>
            <Text size={1}>{error}</Text>
          </Card>
        ) : null}

        <Card padding={4} radius={3} border tone={openTotal > 0 ? 'caution' : 'positive'}>
          <Flex justify="space-between" align="center" gap={4} wrap="wrap">
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Open review queue
              </Text>
              <Heading size={4}>{openTotal}</Heading>
            </Stack>
            <Text muted size={1}>
              Pending items across database, resources, workshops, newsletter, memberships, and loan
              requests.
            </Text>
          </Flex>
        </Card>

        <Grid columns={[1, 1, 2, 4]} gap={3}>
          {countCards.map((card) => {
            const value = data?.counts[card.key] ?? 0

            return (
              <Card key={card.key} padding={3} radius={2} border>
                <Stack space={3}>
                  <Text size={1} weight="semibold">
                    {card.title}
                  </Text>
                  <Heading size={3}>{value}</Heading>
                  <Text muted size={1}>
                    {card.subtitle}
                  </Text>
                </Stack>
              </Card>
            )
          })}
        </Grid>

        <Stack space={3}>
          <Flex align="center" gap={3}>
            <Heading size={2}>Recent Activity</Heading>
            {isRefreshing && !data ? <Spinner muted /> : null}
          </Flex>

          <Card radius={3} border overflow="hidden">
            {recent.length === 0 && data ? (
              <Box padding={4}>
                <Text muted size={1}>
                  No submissions found yet.
                </Text>
              </Box>
            ) : null}

            {recent.map((item, index) => {
              const status = item.status || 'Submitted'
              const statusStyle = getStatusStyle(status)

              return (
                <IntentLink
                  key={item._id}
                  intent="edit"
                  params={{id: item._id, type: item._type}}
                  style={{
                    color: 'inherit',
                    display: 'block',
                    textDecoration: 'none',
                  }}
                >
                  <Box
                    padding={3}
                    style={{
                      borderTop: index === 0 ? 0 : '1px solid var(--card-border-color)',
                    }}
                  >
                    <Flex align="center" justify="space-between" gap={4} wrap="wrap">
                      <Stack space={2} style={{minWidth: 240, flex: 1}}>
                        <Flex gap={2} align="center" wrap="wrap">
                          <Text size={1} weight="semibold">
                            {typeLabels[item._type] || item._type}
                          </Text>
                          <span
                            style={{
                              borderRadius: 999,
                              background: statusStyle.background,
                              color: statusStyle.foreground,
                              fontSize: 12,
                              lineHeight: '18px',
                              padding: '0 8px',
                            }}
                          >
                            {status}
                          </span>
                          {item.hasEmailError ? (
                            <span
                              style={{
                                borderRadius: 999,
                                background: '#ffe6e6',
                                color: '#a80d0d',
                                fontSize: 12,
                                lineHeight: '18px',
                                padding: '0 8px',
                              }}
                            >
                              Email error
                            </span>
                          ) : null}
                        </Flex>
                        <Text size={2}>{item.title || 'Untitled submission'}</Text>
                        <Text muted size={1}>
                          {getItemDetail(item)}
                        </Text>
                      </Stack>

                      <Text muted size={1}>
                        {formatRelativeDate(item.date)}
                      </Text>
                    </Flex>
                  </Box>
                </IntentLink>
              )
            })}
          </Card>
        </Stack>
      </Stack>
    </Box>
  )
}
