import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing, toPlainText} from 'next-sanity'
import {Toaster} from 'sonner'

import DraftModeToast from '@/components/DraftModeToast'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from './client-utils'

import localFont from 'next/font/local'
import MobileHeader from '@/components/MobileHeader'
import {ViewTransitions} from 'next-view-transitions'
import DynamicLayout from '@/components/DynamicLayout'
import CustomSoundcloudPlayer from '@/components/CustomSoundcloudPlayer'
import ThemeProvider from './ThemeProvider'
import ThemeToggleButton from '@/components/ThemeToggleButton'
import RoundedToggleButton from '@/components/RoundedToggleButton'

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

  const [{data: settings}] = await Promise.all([
    sanityFetch({query: settingsQuery, stega: false}).catch(() => ({data: null})),
  ])

  const soundcloudPlaylistUrl = settings?.soundcloudPlaylistUrl

  const vtScript = `
(() => {
  try {
    const v = sessionStorage.getItem('psst-vt');
    if (v === 'close') document.documentElement.classList.add('vt-close');
  } catch {}
})();
`

  return (
    <ViewTransitions>
      <html lang="en" className={`${kleber.variable}`}>
        <head>
          <script dangerouslySetInnerHTML={{__html: vtScript}} />
        </head>
        <body className="font-(family-name:--font-kleber) antialiased">
          <ThemeProvider>
            <RoundedToggleButton />
            <ThemeToggleButton />
            <div className="min-[83rem]:hidden">
              <MobileHeader />
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

              <DynamicLayout>{children}</DynamicLayout>

              <CustomSoundcloudPlayer playlistUrl={soundcloudPlaylistUrl} />
            </section>

            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
