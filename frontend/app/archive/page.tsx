import ArchiveContentAsync from '@/components/archive/ArchiveContentAsync'
import ArchiveSkeleton from '@/components/archive/ArchiveSkeleton'
import SectionList from '@/components/section-list'
import { Suspense } from 'react'

const archive = [
  {
    title: 'PSS7',
    date: '12-03-2024',
    tag: 'ambient',
  },
  {
    title: 'Echoes — A Day and Night',
    date: '12-03-2024',
    tag: 'ambient',
  },
  {
    title: 'Pssound System Launch',
    date: '12-03-2024',
    tag: 'ambient',
  },
]

export default function ArchivePage() {
  return (
    // <SectionList
    //   heading='Workshops'
    //   description='From DJing to construction and scenography, the aim of Psst Workshops is to give underrepresented people access to practices they often hardly have access to. It’s a space where skills and knowledge can be share. By coming and learning together, we tackle the representation issue at its root.'
    //   items={archive}
    //   accentColor='#FFCC00'
    //   tagColor='#1d53ff'
    // />
    <main>
      <Suspense fallback={<ArchiveSkeleton />}>
        <ArchiveContentAsync />
      </Suspense>
    </main>
  )
}
