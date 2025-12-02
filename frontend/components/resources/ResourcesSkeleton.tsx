export default function ResourcesSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4'>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className='border border-[#FE93E7] border-opacity-30 rounded-lg p-4 h-64 animate-pulse'
        >
          <div className='h-5 w-1/3 bg-[#FE93E7] bg-opacity-20 rounded mb-4'></div>
          <div className='h-4 w-2/3 bg-[#FE93E7] bg-opacity-20 rounded mb-2'></div>
          <div className='h-4 w-full bg-[#FE93E7] bg-opacity-10 rounded mb-2'></div>
          <div className='h-4 w-full bg-[#FE93E7] bg-opacity-10 rounded mb-6'></div>
          <div className='h-32 bg-[#FE93E7] bg-opacity-10 rounded mb-4'></div>
          <div className='flex gap-2'>
            <div className='h-4 w-16 bg-[#FE93E7] bg-opacity-20 rounded'></div>
            <div className='h-4 w-16 bg-[#FE93E7] bg-opacity-20 rounded'></div>
          </div>
        </div>
      ))}
    </div>
  )
}
