export default function ArchivePage() {
  return (
    <div className='p-4'>
      <h1 className='text-3xl md:text-4xl font-bold mb-6 text-center text-[#81520a]'>
        Archive
      </h1>

      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Year section */}
        <div>
          <h2 className='text-xl sm:text-2xl font-bold mb-4 border-b border-[#81520a] text-[#81520a]'>
            2022
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Archive item */}
            <div className='bg-white p-4 border border-black rounded-md'>
              <h3 className='text-lg sm:text-xl font-bold mb-2 text-[#81520a]'>
                Summer Dance Party
              </h3>
              <p className='mb-2'>June 24, 2022</p>
              <div className='flex gap-1 mb-2'>
                <span className='bg-[#ffcc00] text-black px-2 py-0.5 rounded-full text-xs'>
                  club
                </span>
                <span className='bg-[#1d53ff] text-white px-2 py-0.5 rounded-full text-xs'>
                  electronic
                </span>
              </div>
              <button className='bg-[#81520a] text-white px-3 py-1 text-sm w-full sm:w-auto'>
                VIEW PHOTOS
              </button>
            </div>

            {/* Archive item */}
            <div className='bg-white p-4 border border-black rounded-md'>
              <h3 className='text-lg sm:text-xl font-bold mb-2 text-[#81520a]'>
                DJ Workshop Series
              </h3>
              <p className='mb-2'>March-May 2022</p>
              <div className='flex gap-1 mb-2'>
                <span className='bg-[#f50806] text-white px-2 py-0.5 rounded-full text-xs'>
                  workshop
                </span>
                <span className='bg-[#07f25b] text-black px-2 py-0.5 rounded-full text-xs'>
                  education
                </span>
              </div>
              <button className='bg-[#81520a] text-white px-3 py-1 text-sm w-full sm:w-auto'>
                VIEW MATERIALS
              </button>
            </div>
          </div>
        </div>

        {/* Year section */}
        <div>
          <h2 className='text-xl sm:text-2xl font-bold mb-4 border-b border-[#81520a] text-[#81520a]'>
            2021
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Archive item */}
            <div className='bg-white p-4 border border-black rounded-md'>
              <h3 className='text-lg sm:text-xl font-bold mb-2 text-[#81520a]'>
                Winter Solstice Gathering
              </h3>
              <p className='mb-2'>December 21, 2021</p>
              <div className='flex gap-1 mb-2'>
                <span className='bg-[#07f25b] text-black px-2 py-0.5 rounded-full text-xs'>
                  ambient
                </span>
                <span className='bg-[#00ffdd] text-black px-2 py-0.5 rounded-full text-xs'>
                  experimental
                </span>
              </div>
              <button className='bg-[#81520a] text-white px-3 py-1 text-sm w-full sm:w-auto'>
                VIEW PHOTOS
              </button>
            </div>

            {/* Archive item */}
            <div className='bg-white p-4 border border-black rounded-md'>
              <h3 className='text-lg sm:text-xl font-bold mb-2 text-[#81520a]'>
                Safer Spaces Training
              </h3>
              <p className='mb-2'>September 15, 2021</p>
              <div className='flex gap-1 mb-2'>
                <span className='bg-[#f50806] text-white px-2 py-0.5 rounded-full text-xs'>
                  workshop
                </span>
                <span className='bg-[#1d53ff] text-white px-2 py-0.5 rounded-full text-xs'>
                  safety
                </span>
              </div>
              <button className='bg-[#81520a] text-white px-3 py-1 text-sm w-full sm:w-auto'>
                VIEW MATERIALS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
