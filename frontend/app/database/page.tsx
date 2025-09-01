import GuidelinesContentAsync from '@/components/database/GuidelinesContentAsync'

export default function DatabasePage() {
  return (
    <div className='p-6 md:px-20 text-[#6600ff]'>
      <div className='md:flex md:items-start md:gap-20'>
        <GuidelinesContentAsync />
      </div>
    </div>
  )
}
