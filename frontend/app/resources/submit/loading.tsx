export default function Loading() {
  return (
    <div className='p-4 h-full w-full md:max-w-[65vw] mx-auto animate-pulse'>
      <div className='space-y-4'>
        {/* Name */}
        <div className='w-full h-full rounded-xl mb-4 md:flex bg-[#FE93E7]'>
          <div className='block text-transparent font-medium text-center uppercase font-mono md:w-[30%] px-6 py-0 xl:py-4 flex-shrink-0 bg-[#FE93E7]/30 rounded-t-xl md:rounded-tr-none md:rounded-l-xl'>
            Name
          </div>
          <div className='md:w-full md:rounded-l-none md:rounded-tr-xl'>
            <div className='w-full rounded-b-lg md:rounded-l-none md:rounded-tr-lg bg-white h-14'></div>
          </div>
        </div>

        {/* Pronouns */}
        <div className='w-full h-full rounded-xl mb-4 md:flex bg-[#FE93E7]'>
          <div className='block text-transparent font-medium text-center uppercase font-mono md:w-[30%] px-6 py-0 xl:py-4 flex-shrink-0 bg-[#FE93E7]/30 rounded-t-xl md:rounded-tr-none md:rounded-l-xl'>
            Pronouns
          </div>
          <div className='md:w-full md:rounded-l-none md:rounded-tr-xl'>
            <div className='w-full rounded-b-lg md:rounded-l-none md:rounded-tr-lg bg-white h-14'></div>
          </div>
        </div>

        {/* Email */}
        <div className='w-full h-full rounded-xl mb-4 md:flex bg-[#FE93E7]'>
          <div className='block text-transparent font-medium text-center uppercase font-mono md:w-[30%] px-6 py-0 xl:py-4 flex-shrink-0 bg-[#FE93E7]/30 rounded-t-xl md:rounded-tr-none md:rounded-l-xl'>
            E-mail
          </div>
          <div className='md:w-full md:rounded-l-none md:rounded-tr-xl'>
            <div className='w-full rounded-b-lg md:rounded-l-none md:rounded-tr-lg bg-white h-14'></div>
          </div>
        </div>

        {/* Categories */}
        <div className='w-full h-full rounded-xl mb-4 md:flex bg-[#FE93E7]'>
          <div className='block text-transparent font-medium text-center uppercase font-mono md:w-[30%] px-6 py-0 xl:py-4 flex-shrink-0 bg-[#FE93E7]/30 rounded-t-xl md:rounded-tr-none md:rounded-l-xl'>
            Categorie(s)
          </div>
          <div className='md:w-full md:rounded-l-none md:rounded-tr-xl'>
            <div className='w-full rounded-b-lg md:rounded-l-none md:rounded-tr-lg bg-white h-14 p-3'>
              <div className='flex flex-wrap gap-2'>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className='inline-flex p-1.25 py-0.25 font-mono text-lg uppercase font-thin bg-[#e0e0e0] h-8 w-28 rounded-sm'
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className='w-full h-full rounded-xl mb-4 md:flex bg-[#FE93E7]'>
          <div className='block text-transparent font-medium text-center uppercase font-mono md:w-[30%] px-6 py-0 xl:py-4 flex-shrink-0 bg-[#FE93E7]/30 rounded-t-xl md:rounded-tr-none md:rounded-l-xl'>
            Tag(s)
          </div>
          <div className='md:w-full md:rounded-l-none md:rounded-tr-xl'>
            <div className='w-full rounded-b-lg md:rounded-l-none md:rounded-tr-lg bg-white h-14 p-3'>
              <div className='flex flex-wrap gap-2'>
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className='inline-flex items-center rounded-full border px-4 py-1 text-xs bg-[#e0e0e0] w-20 h-7'
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className='w-full h-full rounded-xl mb-4 md:flex bg-[#FE93E7]'>
          <div className='block text-transparent font-medium text-center uppercase font-mono md:w-[30%] px-6 py-0 xl:py-4 flex-shrink-0 bg-[#FE93E7]/30 rounded-t-xl md:rounded-tr-none md:rounded-l-xl'>
            Link(s)
          </div>
          <div className='md:w-full md:rounded-l-none md:rounded-tr-xl'>
            <div className='w-full rounded-b-lg md:rounded-l-none md:rounded-tr-lg bg-white h-14'></div>
          </div>
        </div>

        {/* Description */}
        <div className='w-full h-full rounded-xl mb-4 md:flex bg-[#FE93E7]'>
          <div className='block text-transparent font-medium text-center uppercase font-mono md:w-[30%] px-6 py-0 xl:py-4 flex-shrink-0 bg-[#FE93E7]/30 rounded-t-xl md:rounded-tr-none md:rounded-l-xl'>
            Description
          </div>
          <div className='md:w-full md:rounded-l-none md:rounded-tr-xl'>
            <div className='w-full rounded-b-lg md:rounded-l-none md:rounded-tr-lg bg-white h-32'></div>
          </div>
        </div>

        {/* Submit button */}
        <div className='flex justify-center mt-16'>
          <div className='bg-[#FE93E7] opacity-70 w-64 h-64 rounded-full'></div>
        </div>
      </div>
    </div>
  )
}
