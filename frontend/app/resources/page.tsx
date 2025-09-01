import ResourcesGuidelinesContentAsync from '@/components/resources/ResourcesGuidelinesContentAsync'
import Loading from './loading'

export default function ResourcesPage() {
  return (
    <>
      {/* <Loading /> */}
      <div className='p-6 md:px-20 text-[#FE93E7]'>
        <ResourcesGuidelinesContentAsync />
      </div>
    </>
  )
}
