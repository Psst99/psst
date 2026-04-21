import ResourcesGuidelinesContentAsync from '@/components/resources/ResourcesGuidelinesContentAsync'
import Loading from './loading'

export default function ResourcesPage() {
  return (
    <>
      {/* <Loading /> */}
      <div className="p-6 min-[69.375rem]:px-20 text-[color:var(--section-accent)]">
        <ResourcesGuidelinesContentAsync />
      </div>
    </>
  )
}
