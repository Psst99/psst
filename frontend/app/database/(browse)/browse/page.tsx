import DatabaseBrowseContentAsync from '@/components/database/DatabaseBrowseContentAsync'
import Loading from './loading'

export default function DatabaseBrowsePage({
  searchParams,
}: {
  searchParams: any
}) {
  return <DatabaseBrowseContentAsync searchParams={searchParams} />
  return <Loading />
}
