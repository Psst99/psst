export default function Loading() {
  return (
    <div className='p-6 text-[#FFCC00] md:mx-16 animate-pulse'>
      {/* Title */}
      <div className='h-10 w-1/3 mx-auto mb-6 mt-16 md:mt-0 bg-[#FFCC00]/30 rounded' />
      {/* Description skeleton */}
      <div className='space-y-4 my-8 md:max-w-[65vw] mx-auto'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='h-5 w-full bg-[#FFCC00]/30 rounded' />
        ))}
      </div>
      {/* Events grid skeleton */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mx-auto mt-16'>
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className='bg-[#FFCC00]/50 h-32 p-4 sm:p-2 sm:px-4 rounded-lg'
          ></div>
        ))}
      </div>
    </div>
  )
}
