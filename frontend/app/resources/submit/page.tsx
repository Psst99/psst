import {sanityFetch} from '@/sanity/lib/live'
import {ResourceSubmissionForm} from '@/components/resources/ResourceSubmissionForm'

const resourcesSubmitQuery = `
{
  "categories": *[_type == "resourceCategory"] | order(title asc){
    _id,
    title,
    "slug": slug.current
  },
  "tags": *[_type == "resourceTag"] | order(title asc){
    _id,
    title
  }
}
`

export default async function ResourceSubmitPage() {
  const {data} = await sanityFetch({query: resourcesSubmitQuery})

  return <ResourceSubmissionForm categories={data.categories} tags={data.tags} />
}
