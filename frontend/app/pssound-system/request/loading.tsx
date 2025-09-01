export default function Loading() {
  return (
    <div className='animate-pulse'>
      {/* Calendar skeleton */}
      <div className='pt-0 bg-[#81520a] p-2 sm:p-4 rounded-lg h-[80svh] w-full md:max-w-[85vw] mx-auto flex flex-col'>
        {/* Days header skeleton */}
        <div className='grid grid-cols-7 gap-2 mb-2 shrink-0'>
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className='p-1 sm:p-1 bg-[#07f25b]/40 text-center border border-[#81520a] text-base leading-tight md:text-xl tracking-tight rounded-lg h-8'
            />
          ))}
        </div>

        {/* Calendar grid skeleton */}
        <div className='flex flex-col gap-1 flex-1 min-h-0'>
          {[...Array(6)].map((_, weekIdx) => (
            <div key={weekIdx} className='flex gap-1 flex-1'>
              {[...Array(7)].map((_, dayIdx) => (
                <div
                  key={dayIdx}
                  className='flex-1 min-h-[60px] sm:min-h-[80px] flex items-center justify-center border border-[#81520a] bg-white/20 rounded-lg'
                />
              ))}
            </div>
          ))}
        </div>

        {/* Navigation skeleton */}
        <div className='mt-2 flex items-center justify-between gap-2 h-6 text-base leading-tight md:text-xl tracking-tight shrink-0'>
          <div className='bg-[#07f25b]/40 px-2 sm:px-4 py-1 rounded-md flex items-center h-full w-12' />
          <div className='bg-[#07f25b]/40 px-4 rounded-md w-full flex items-center justify-center h-full' />
          <div className='bg-[#07f25b]/40 px-2 sm:px-4 py-1 rounded-md flex items-center h-full w-12' />
        </div>
      </div>

      {/* Form skeleton */}
      <div className='p-4 mt-16 animate-pulse'>
        <div className='h-full w-full md:max-w-[65vw] mx-auto space-y-4'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='bg-[#07f25b]/20 rounded-lg h-20' />
          ))}
        </div>
      </div>
    </div>
  )
}
