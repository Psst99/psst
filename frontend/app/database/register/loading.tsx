export default function Loading() {
  return (
    <div className='p-4 h-full w-full md:max-w-[65vw] mx-auto animate-pulse'>
      <form className='space-y-4'>
        {/* Name */}
        <div className='bg-[#6600ff] rounded-lg mb-4 h-20 flex items-center px-4'>
          <div className='w-1/3 h-6 bg-[#7d5fff] rounded mr-6' />
          <div className='flex-1 h-10 bg-[#e0e0e0] rounded' />
        </div>
        {/* Pronouns */}
        <div className='bg-[#6600ff] rounded-lg mb-4 h-20 flex items-center px-4'>
          <div className='w-1/3 h-6 bg-[#7d5fff] rounded mr-6' />
          <div className='flex-1 h-10 bg-[#e0e0e0] rounded' />
        </div>
        {/* Email */}
        <div className='bg-[#6600ff] rounded-lg mb-4 h-20 flex items-center px-4'>
          <div className='w-1/3 h-6 bg-[#7d5fff] rounded mr-6' />
          <div className='flex-1 h-10 bg-[#e0e0e0] rounded' />
        </div>
        {/* Categories */}
        <div className='bg-[#6600ff] rounded-lg mb-4 h-20 flex items-center px-4'>
          <div className='w-1/3 h-6 bg-[#7d5fff] rounded mr-6' />
          <div className='flex-1 flex gap-2'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='h-8 w-20 bg-[#e0e0e0] rounded-full' />
            ))}
          </div>
        </div>
        {/* Tags */}
        <div className='bg-[#6600ff] rounded-lg mb-4 h-20 flex items-center px-4'>
          <div className='w-1/3 h-6 bg-[#7d5fff] rounded mr-6' />
          <div className='flex-1 flex gap-2'>
            {[...Array(2)].map((_, i) => (
              <div key={i} className='h-8 w-16 bg-[#e0e0e0] rounded-full' />
            ))}
          </div>
        </div>
        {/* Links */}
        <div className='bg-[#6600ff] rounded-lg mb-4 h-20 flex items-center px-4'>
          <div className='w-1/3 h-6 bg-[#7d5fff] rounded mr-6' />
          <div className='flex-1 h-10 bg-[#e0e0e0] rounded' />
        </div>
        {/* Description */}
        <div className='bg-[#6600ff] rounded-lg mb-4 h-32 flex flex-col px-4 py-4'>
          <div className='w-1/3 h-6 bg-[#7d5fff] rounded mb-4' />
          <div className='flex-1 h-16 bg-[#e0e0e0] rounded' />
        </div>
        {/* Submit button */}
        <div className='flex justify-center mt-16'>
          <div className='bg-[#6600ff] opacity-60 w-64 h-64 rounded-full' />
        </div>
      </form>
    </div>
  )
}
