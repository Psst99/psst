import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing, toPlainText} from 'next-sanity'
import {Toaster} from 'sonner'

import DraftModeToast from '@/components/DraftModeToast'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {
  hasUpcomingWorkshopsQuery,
  psstSectionsQuery,
  settingsQuery,
  upcomingWorkshopsQuery,
} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from './client-utils'

import localFont from 'next/font/local'
import MobileHeader from '@/components/mobile-header'
import {ViewTransitions} from 'next-view-transitions'
import DynamicLayout from '@/components/dynamic-layout'
import CustomSoundcloudPlayer from '@/components/CustomSoundcloudPlayer'

export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({query: settingsQuery, stega: false})
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description
  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {}

  return {
    metadataBase,
    title: {template: `%s | ${title}`, default: title},
    description: toPlainText(description),
    openGraph: {images: ogImage ? [ogImage] : []},
  }
}

const kleber = localFont({
  src: '/fonts/NeueHaasGroteskTextPro.ttf',
  display: 'swap',
  variable: '--font-kleber',
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  const [
    {data: settings},
    {data: hasUpcoming},
    {data: psstSections},
    {data: upcomingWorkshops = []},
  ] = await Promise.all([
    sanityFetch({query: settingsQuery, stega: false}).catch(() => ({data: null})),
    sanityFetch({query: hasUpcomingWorkshopsQuery, stega: false}).catch(() => ({data: false})),
    sanityFetch({query: psstSectionsQuery, stega: false}).catch(() => ({data: []})),
    sanityFetch({query: upcomingWorkshopsQuery, stega: false}).catch(() => ({data: []})),
  ])

  // const hasUpcomingWorkshops = Boolean(hasUpcoming)
  // Check if there are upcoming workshops WITH available spots
  const workshopsWithSpots = (upcomingWorkshops || []).filter((workshop: any) => {
    const available = (workshop.totalSpots || 0) - (workshop.registrationsCount || 0)
    return available > 0
  })

  const hasUpcomingWorkshops = workshopsWithSpots.length > 0
  const soundcloudPlaylistUrl = settings?.soundcloudPlaylistUrl

  const dynamicSubNavItems = Array.isArray(psstSections)
    ? psstSections.map((item: any) => ({label: item.title, href: `/psst/${item.slug}`}))
    : undefined

  return (
    <ViewTransitions>
      <html lang="en" className={`${kleber.variable}`}>
        <body className="font-(family-name:--font-kleber)">
          <div className="min-[83rem]:hidden">
            <MobileHeader dynamicSubNavItems={dynamicSubNavItems} />
          </div>
          <section>
            <Toaster />
            {isDraftMode && (
              <>
                <DraftModeToast />
                <VisualEditing />
              </>
            )}
            <SanityLive onError={handleError} />

            <DynamicLayout
              hasUpcomingWorkshops={hasUpcomingWorkshops}
              dynamicSubNavItems={dynamicSubNavItems}
            >
              {children}
            </DynamicLayout>

            <CustomSoundcloudPlayer playlistUrl={soundcloudPlaylistUrl} />
          </section>
          <SpeedInsights />
        </body>
      </html>
    </ViewTransitions>
  )
}
