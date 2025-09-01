import ArchiveContentAsync from '@/components/archive/ArchiveContentAsync'
import Loading from './loading'

export default function ArchivePage() {
  return (
    <>
      {/* <Loading /> */}
      <main>
        <ArchiveContentAsync />
      </main>
    </>
  )
}
