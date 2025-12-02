import {sanityFetch} from '@/sanity/lib/live'
import {ResourceSubmissionForm} from '@/components/resources/ResourceSubmissionForm'

const resourcesSubmitQuery = `
{
  "categories": [
    {"_id": "text", "title": "TEXT"},
    {"_id": "video", "title": "VIDEO"},
    {"_id": "sound", "title": "SOUND"},
    {"_id": "website", "title": "WEBSITE"}
  ],
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
