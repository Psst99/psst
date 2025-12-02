import {redirect} from 'next/navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {psstSectionsQuery} from '@/sanity/lib/queries'

export default async function PsstPage() {
  const {data} = await sanityFetch({query: psstSectionsQuery})

  if (data && data.length > 0) {
    const firstSection = data[0]
    redirect(`/psst/${firstSection.slug}`)
  }

  return <div>No sections found</div>
}
