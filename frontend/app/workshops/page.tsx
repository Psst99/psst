// import SectionList from '@/components/section-list'

// const workshops = [
//   {
//     title: 'Admin',
//     date: '12-03-2024',
//     tag: 'ambient',
//   },
//   {
//     title: 'Arts & Immigration',
//     date: '12-03-2024',
//     tag: 'ambient',
//   },
//   {
//     title: 'Creating Together',
//     date: '12-03-2024',
//     tag: 'ambient',
//   },
//   {
//     title: 'Institutions & Mental Health',
//     date: '12-03-2024',
//     tag: 'ambient',
//   },
//   {
//     title: 'Redefining Self Care',
//     date: '12-03-2024',
//     tag: 'ambient',
//   },
//   {
//     title: 'Financing',
//     date: '12-03-2024',
//     tag: 'ambient',
//   },
//   {
//     title: 'Neurodiversity',
//     date: '12-03-2024',
//     tag: 'ambient',
//   },
// ]

// export default function WorkshopsPage() {
//   return (
//     <SectionList
//       heading='Workshops'
//       description='From DJing to construction and scenography, the aim of Psst Workshops is to give underrepresented people access to practices they often hardly have access to. It’s a space where skills and knowledge can be share. By coming and learning together, we tackle the representation issue at its root.'
//       items={workshops}
//       accentColor='#f50806'
//       tagColor='#1d53ff'
//     />
//   )
// }

import { Suspense } from 'react'
import WorkshopsContentAsync from '@/components/workshops/WorkshopsContentAsync'

export default function WorkshopsPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading workshops...</div>}>
        <WorkshopsContentAsync />
      </Suspense>
    </main>
  )
}
