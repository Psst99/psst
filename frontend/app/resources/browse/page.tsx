import ResourcesContentAsync from '@/components/resources/ResourcesContentAsync'
import Loading from './loading'

export default async function ResourcesBrowsePage() {
  return (
    <>
      {/* <Loading /> */}
      <main>
        <ResourcesContentAsync />
      </main>
    </>
  )
}
