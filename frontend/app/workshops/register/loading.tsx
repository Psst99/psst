export default function Loading() {
  return (
    <div className='h-full w-full md:max-w-[65vw] mx-auto mt-6 px-6'>
      {/* Title */}
      <div className='h-10 w-2/3 mx-auto mb-6 mt-0 md:mt-0 bg-[#f7bdbd] rounded' />
      {/* Description */}
      <div className='space-y-4 mt-8'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='h-5 w-full bg-[#f7bdbd] rounded' />
        ))}
      </div>
      {/* Registration form skeleton */}
      <div className='mt-16 space-y-4 mx-auto'>
        {[...Array(6)].map((_, i) => (
          <div key={i} className='h-12 bg-[#f7bdbd] rounded' />
        ))}
        {/* Submit button */}
        <div className='flex justify-center mt-16'>
          <div className='bg-[#f7bdbd] opacity-60 w-64 h-64 rounded-full' />
        </div>
      </div>
    </div>
  )
}
