export default function WorkshopsPage() {
  return (
    <div className='p-4'>
      <h1 className='text-3xl md:text-4xl font-bold mb-6 text-center text-[#f50806]'>
        Workshops
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto'>
        {/* Workshop 1 */}
        <div className='bg-white p-4 sm:p-6 border border-black rounded-md'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#f50806]'>
            DJ Workshop for Beginners
          </h2>
          <p className='mb-4'>
            Learn the basics of DJing in a supportive environment. No prior
            experience needed!
          </p>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
            <span className='text-[#f50806] font-bold'>June 15, 2023</span>
            <button className='bg-[#f50806] text-white px-4 py-1 font-bold w-full sm:w-auto'>
              REGISTER
            </button>
          </div>
        </div>

        {/* Workshop 2 */}
        <div className='bg-white p-4 sm:p-6 border border-black rounded-md'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#f50806]'>
            Sound Engineering Basics
          </h2>
          <p className='mb-4'>
            Get familiar with sound equipment and learn how to set up and manage
            sound for events.
          </p>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
            <span className='text-[#f50806] font-bold'>July 8, 2023</span>
            <button className='bg-[#f50806] text-white px-4 py-1 font-bold w-full sm:w-auto'>
              REGISTER
            </button>
          </div>
        </div>

        {/* Workshop 3 */}
        <div className='bg-white p-4 sm:p-6 border border-black rounded-md'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#f50806]'>
            Safer Spaces Training
          </h2>
          <p className='mb-4'>
            Learn how to create and maintain safer spaces in nightlife
            environments.
          </p>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
            <span className='text-[#f50806] font-bold'>July 22, 2023</span>
            <button className='bg-[#f50806] text-white px-4 py-1 font-bold w-full sm:w-auto'>
              REGISTER
            </button>
          </div>
        </div>

        {/* Workshop 4 */}
        <div className='bg-white p-4 sm:p-6 border border-black rounded-md'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#f50806]'>
            Music Production with Ableton
          </h2>
          <p className='mb-4'>
            Introduction to music production using Ableton Live. Bring your
            laptop!
          </p>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
            <span className='text-[#f50806] font-bold'>August 5, 2023</span>
            <button className='bg-[#f50806] text-white px-4 py-1 font-bold w-full sm:w-auto'>
              REGISTER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
