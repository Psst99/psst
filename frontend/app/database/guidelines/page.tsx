import GuidelinesContentAsync from '@/components/database/GuidelinesContentAsync'

export default function GuidelinesPage() {
  return (
    <div className="p-6 pb-16 md:px-20 min-[69.375rem]:pb-[calc(var(--home-nav-h)+4rem)] panel-fg">
      <GuidelinesContentAsync />
    </div>
  )
}
