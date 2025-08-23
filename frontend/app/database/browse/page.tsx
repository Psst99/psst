import { Suspense } from 'react'
import DatabaseBrowseContentAsync from '@/components/database/DatabaseBrowseContentAsync'

export default function DatabaseBrowsePage({
  searchParams = {},
}: {
  searchParams?: { tags?: string; mode?: 'any' | 'all' }
}) {
  return (
    <Suspense fallback={<div className='p-6 text-[#6600ff]'>Loading…</div>}>
      <DatabaseBrowseContentAsync searchParams={searchParams} />
    </Suspense>
  )
}
