import { Suspense } from 'react'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

import { psstPageQuery } from '@/sanity/lib/queries'
import { sanityFetch } from '@/sanity/lib/live'
import PsstContent from '@/components/CmsContent'
import PsstSkeleton from '@/components/psst/PsstSkeleton'
import PsstContentAsync from '@/components/psst/PsstContentAsync'

export default function PsstPage() {
  return (
    <main className='p-6 rounded-md max-w-4xl mx-auto'>
      <Suspense fallback={<PsstSkeleton />}>
        <PsstContentAsync />
      </Suspense>
    </main>
  )
}
