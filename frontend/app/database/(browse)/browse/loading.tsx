import { getTagColors } from '@/lib/tags'

export default function Loading() {
  const seeds = [
    'music',
    'art',
    'sound',
    'design',
    'visual',
    'performance',
    'digital',
    'noise',
  ]

  return (
    <div className='p-4 lg:px-16 pt-0 w-full mx-auto group'>
      <div className='flex flex-col md:flex-row gap-8'>
        {/* Desktop sidebar skeleton - properly hidden on mobile */}
        <div className='hidden md:block w-80 space-y-3 animate-pulse'>
          {/* Search */}
          <div className='bg-white py-3 px-6 rounded-md mb-2'>
            <div className='h-8 w-full bg-[#e0e0e0] rounded' />
          </div>
          {/* Sort */}
          <div className='bg-white py-3 px-6 rounded-md mb-2'>
            <div className='h-6 w-1/2 mx-auto bg-[#e0e0e0] rounded mb-4' />
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-8 w-full bg-[#e0e0e0] rounded mb-2' />
            ))}
          </div>
          {/* Categories */}
          <div className='bg-white py-3 px-6 rounded-md mb-2'>
            <div className='h-6 w-1/2 mx-auto bg-[#e0e0e0] rounded mb-4' />
            <div className='flex flex-wrap gap-2'>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className='h-7 w-20 bg-[#6600ff]/25 rounded-none'
                />
              ))}
            </div>
          </div>
          {/* Tags */}
          <div className='bg-white py-3 px-6 rounded-md max-h-[40vh] overflow-y-auto no-scrollbar'>
            <div className='h-6 w-1/2 mx-auto bg-[#e0e0e0] rounded mb-4' />
            <div className='flex flex-wrap gap-2'>
              {[...Array(16)].map((_, i) => (
                <div key={i} className='h-5 w-16 bg-[#e0e0e0] rounded-full' />
              ))}
            </div>
          </div>
          {/* Clear filters button */}
          <div className='h-10 w-full bg-[#e0e0e0] rounded mt-4' />
        </div>

        {/* Mobile filters button skeleton */}
        <div className='xl:hidden fixed top-[6.75rem] left-1/2 -translate-x-1/2 z-10 animate-pulse'>
          <div className='h-12 w-12 bg-[#6600ff]/50 rounded-full flex items-center justify-center shadow-lg'></div>
        </div>

        {/* Main content skeleton */}
        <div className='flex-1 space-y-3 animate-pulse mt-10 xl:mt-0'>
          {[...Array(12)].map((_, i) => (
            <div key={i} className='block w-full'>
              <div className='bg-white p-4 rounded-lg'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                  {/* Artist Name */}
                  <div className='h-8 w-1/2 bg-[#6600ff]/25 rounded mb-2 sm:mb-0' />
                  {/* Categories */}
                  <div className='flex gap-2 w-1/3'>
                    {[...Array(2)].map((_, j) => (
                      <div
                        key={j}
                        className='h-6 w-20 bg-[#6600ff]/25 rounded-none'
                      />
                    ))}
                  </div>
                  {/* Tags */}
                  <div className='flex flex-nowrap gap-1 mt-4 w-1/3'>
                    {[...Array(4)].map((_, k) => {
                      const colors = getTagColors(seeds[(i + k) % seeds.length])
                      return (
                        <div key={k} className='inline-flex'>
                          <div
                            className='inline-flex items-center rounded-full border px-4 py-1 text-xs w-16 h-6 opacity-25'
                            style={{
                              backgroundColor: colors.bg,
                              borderColor: colors.bd,
                              color: colors.fg,
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          <div className='flex justify-center py-8'>
            <div className='flex items-center gap-2 text-[#6600ff]'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-[#6600ff]' />
              <span>Loading artists...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
