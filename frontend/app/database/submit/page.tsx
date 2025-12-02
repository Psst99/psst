import { ArtistRegistrationForm } from '@/components/database/ArtistRegistrationForm'

import { sanityFetch } from '@/sanity/lib/live'
import { categoriesAndTagsQuery } from '@/sanity/lib/queries'
import Loading from './loading'

export default async function RegisterPage() {
  const { data } = await sanityFetch({ query: categoriesAndTagsQuery })
  const { categories, tags } = data

  return <ArtistRegistrationForm categories={categories} tags={tags} />
  // return <Loading />
}
