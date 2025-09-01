import DatabaseBrowseContentAsync from '@/components/database/DatabaseBrowseContentAsync'

export default function DatabaseBrowsePage({
  searchParams,
}: {
  searchParams: any
}) {
  return <DatabaseBrowseContentAsync searchParams={searchParams} />
}
