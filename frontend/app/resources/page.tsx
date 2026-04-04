import ResourcesGuidelinesContentAsync from '@/components/resources/ResourcesGuidelinesContentAsync'
import Loading from './loading'

export default function ResourcesPage() {
  return (
    <>
      {/* <Loading /> */}
      <div className="max-w-6xl  mx-auto p-6 md:px-20 text-[color:var(--section-accent)]">
        <ResourcesGuidelinesContentAsync />
      </div>
    </>
  )
}
