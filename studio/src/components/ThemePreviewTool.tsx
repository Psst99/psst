import {useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {Box, Card, Flex, Grid, Heading, Stack, Text} from '@sanity/ui'

type ColorValue = string | {hex?: string; value?: string}

type ThemeDoc = {
  sectionColors?: Record<string, {background?: ColorValue; foreground?: ColorValue} | undefined>
}

const SECTION_META: Array<{key: string; label: string; navLabel: string}> = [
  {key: 'home', label: 'Home', navLabel: 'HOME'},
  {key: 'psst', label: 'PSST', navLabel: 'PSST'},
  {key: 'database', label: 'Database', navLabel: 'DATABASE'},
  {key: 'workshops', label: 'Workshops', navLabel: 'WORKSHOPS'},
  {key: 'events', label: 'Events', navLabel: 'EVENTS'},
  {key: 'pssoundSystem', label: 'PSSound System', navLabel: 'PSSOUND'},
  {key: 'resources', label: 'Resources', navLabel: 'RESOURCES'},
  {key: 'archive', label: 'Archive', navLabel: 'ARCHIVE'},
]

const DEFAULTS: Record<string, {background: string; foreground: string}> = {
  home: {background: '#FFFFFF', foreground: '#000000'},
  psst: {background: '#DFFF3D', foreground: '#A20018'},
  database: {background: '#D3CD7F', foreground: '#6600FF'},
  workshops: {background: '#D2D2D2', foreground: '#F50806'},
  events: {background: '#00FFDD', foreground: '#4E4E4E'},
  pssoundSystem: {background: '#81520A', foreground: '#07F25B'},
  resources: {background: '#FE93E7', foreground: '#1D53FF'},
  archive: {background: '#81520A', foreground: '#FFCC00'},
}

const query = `coalesce(*[_id == "drafts.themeSettings"][0], *[_id == "themeSettings"][0]){sectionColors}`

function resolveColor(value?: ColorValue) {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value.hex === 'string') return value.hex
  if (typeof value.value === 'string') return value.value
  return undefined
}

export default function ThemePreviewTool() {
  const client = useClient({apiVersion: '2024-10-28'})
  const [themeDoc, setThemeDoc] = useState<ThemeDoc | null>(null)

  useEffect(() => {
    let subscribed = true

    client
      .fetch<ThemeDoc | null>(query)
      .then((doc) => {
        if (subscribed) setThemeDoc(doc)
      })
      .catch(() => {
        if (subscribed) setThemeDoc(null)
      })

    const subscription = client.listen<ThemeDoc>(query).subscribe((event) => {
      if (event.result && subscribed) {
        setThemeDoc(event.result)
      }
    })

    return () => {
      subscribed = false
      subscription.unsubscribe()
    }
  }, [client])

  const sections = useMemo(
    () =>
      SECTION_META.map((section) => {
        const colors = themeDoc?.sectionColors?.[section.key]
        const background = resolveColor(colors?.background) ?? DEFAULTS[section.key].background
        const foreground = resolveColor(colors?.foreground) ?? DEFAULTS[section.key].foreground
        return {section, background, foreground}
      }),
    [themeDoc],
  )

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Heading size={2}>Theme Preview</Heading>
        <Text muted size={1}>
          Edit colors in Theme settings and watch these previews update live.
        </Text>

        <Grid columns={[1, 1, 2, 3]} gap={3}>
          {sections.map(({section, background, foreground}) => (
            <Card
              key={section.key}
              radius={3}
              padding={3}
              style={{
                background,
                color: foreground,
                border: `1px solid ${foreground}`,
                minHeight: 220,
              }}
            >
              <Stack space={3}>
                <Flex justify="space-between" align="center">
                  <Text size={1} weight="semibold">
                    {section.label}
                  </Text>
                  <Text size={1}>{background}</Text>
                </Flex>

                <Card
                  radius={2}
                  padding={2}
                  style={{
                    background: foreground,
                    color: background,
                  }}
                >
                  <Text size={1} weight="semibold">
                    {section.navLabel}
                  </Text>
                </Card>

                <Card
                  radius={2}
                  padding={3}
                  style={{
                    border: `1px solid ${foreground}`,
                    background: '#FFFFFF',
                    color: foreground,
                  }}
                >
                  <Stack space={2}>
                    <Text size={1} weight="semibold">
                      Panel sample
                    </Text>
                    <Text size={1}>Foreground: {foreground}</Text>
                    <Text size={1}>Background: {background}</Text>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Box>
  )
}
