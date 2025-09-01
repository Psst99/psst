import ArchiveContentAsync from '@/components/archive/ArchiveContentAsync'
import ArchiveSkeleton from '@/components/archive/ArchiveSkeleton'
import SectionList from '@/components/section-list'
import { Suspense } from 'react'

export default function ArchivePage() {
  return (
    <main>
      <ArchiveContentAsync />
    </main>
  )
}
