import './globals.css'

import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { draftMode } from 'next/headers'
import { VisualEditing, toPlainText } from 'next-sanity'
import { Toaster } from 'sonner'

import DraftModeToast from '@/components/DraftModeToast'
// import Footer from '@/app/components/Footer'
// import Header from '@/app/components/Header'
import * as demo from '@/sanity/lib/demo'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
import { resolveOpenGraphImage } from '@/sanity/lib/utils'
import { handleError } from './client-utils'

import localFont from 'next/font/local'
import MobileHeader from '@/components/mobile-header'
import { ViewTransitions } from 'next-view-transitions'
import DynamicLayout from '@/components/dynamic-layout'
import { WorkshopsProvider } from '@/contexts/WorkshopContext'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const kleber = localFont({
  src: '/fonts/NeueHaasGroteskTextPro.ttf',
  display: 'swap',
  variable: '--font-kleber',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled: isDraftMode } = await draftMode()
  const activeWorkshopsQuery = `count(*[_type == "workshop" && date >= now()])`

  let hasActiveWorkshops = false
  try {
    const { data: count } = await sanityFetch({
      query: activeWorkshopsQuery,
      stega: false,
    })
    hasActiveWorkshops = count > 0
  } catch (error) {
    console.error('Error fetching active workshops:', error)
  }

  return (
    <ViewTransitions>
      <html lang='en' className={`${inter.variable} ${kleber.variable}`}>
        <body className='font-(family-name:--font-kleber)'>
          <WorkshopsProvider initialValue={hasActiveWorkshops}>
            <div className='md:hidden'>
              <MobileHeader />
            </div>
            <section>
              {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
              <Toaster />
              {isDraftMode && (
                <>
                  <DraftModeToast />
                  {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
                  <VisualEditing />
                </>
              )}
              {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
              <SanityLive onError={handleError} />
              {/* <Header /> */}
              {/* <MobileHeader /> */}

              <DynamicLayout>{children}</DynamicLayout>

              {/* <Footer /> */}
            </section>
            <SpeedInsights />
          </WorkshopsProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}
