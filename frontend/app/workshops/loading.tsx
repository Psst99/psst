export default function Loading() {
  return (
    <div className='p-6 text-[#f50806] md:mx-16 animate-pulse'>
      {/* Title */}
      <div className='h-10 w-1/3 mx-auto mb-6 bg-[#f7bdbd] rounded' />
      {/* Description skeleton */}
      <div className='space-y-4 my-8 md:max-w-[65vw] mx-auto'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='h-5 w-full bg-[#f7bdbd] rounded' />
        ))}
      </div>
      {/* Workshops grid skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto mt-16'>
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className='bg-white p-4 sm:p-2 sm:px-4 rounded-lg'>
            <div className='h-8 w-2/3 bg-[#f7bdbd] rounded mb-2' />
            <div className='h-5 w-1/3 bg-[#f7bdbd] rounded mb-2' />
            <div className='flex flex-wrap gap-2 mt-3'>
              {[...Array(2)].map((_, tagIdx) => (
                <div
                  key={tagIdx}
                  className='h-6 w-16 bg-[#f7bdbd] rounded-full'
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
