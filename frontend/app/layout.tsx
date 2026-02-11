import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {cookies, draftMode} from 'next/headers'
import {VisualEditing, toPlainText} from 'next-sanity'
import {Toaster} from 'sonner'

import DraftModeToast from '@/components/DraftModeToast'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from './client-utils'

import localFont from 'next/font/local'
import {GeistSans} from 'geist/font/sans'
import {GeistMono} from 'geist/font/mono'
import MobileHeader from '@/components/MobileHeader'
import {ViewTransitions} from 'next-view-transitions'
import DynamicLayout from '@/components/DynamicLayout'
import CustomSoundcloudPlayer from '@/components/CustomSoundcloudPlayer'
import ThemeProvider from './ThemeProvider'
import ThemeToggleButton from '@/components/ThemeToggleButton'
import RoundedToggleButton from '@/components/RoundedToggleButton'
import {buildThemeOverrides} from '@/lib/theme/overrides'

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

const karrik = localFont({
  src: './fonts/BBB_Karrik.woff2',
  display: 'swap',
  variable: '--font-karrik',
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()
  const cookieStore = await cookies()

  const [{data: settings}] = await Promise.all([
    sanityFetch({query: settingsQuery, stega: false}).catch(() => ({data: null})),
  ])

  const soundcloudPlaylistUrl = settings?.soundcloudPlaylistUrl
  const themeOverrides = buildThemeOverrides((settings as any)?.theme?.sectionColors)
  const modeCookie = cookieStore.get('psst-theme-mode')?.value
  const roundedCookie = cookieStore.get('psst-rounded-corners')?.value
  const initialMode = modeCookie === 'accessible' || modeCookie === 'brand' ? modeCookie : 'brand'
  const initialRounded = roundedCookie === 'false' ? false : true

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
      <html
        lang="en"
        className={`${kleber.variable} ${karrik.variable} ${GeistSans.variable} ${GeistMono.variable}`}
        data-theme={initialMode}
        data-rounded={initialRounded ? 'true' : 'false'}
      >
        <head>
          <script dangerouslySetInnerHTML={{__html: vtScript}} />
        </head>
        <body className="font-(family-name:--font-kleber) antialiased">
          <ThemeProvider
            themeOverrides={themeOverrides}
            initialMode={initialMode}
            initialRounded={initialRounded}
          >
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
