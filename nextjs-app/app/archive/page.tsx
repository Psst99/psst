export default function ArchivePage() {
  return (
    <div className='p-4 text-[#FFCC00]'>
      <h1 className='text-3xl md:text-4xl mb-6 text-center '>Archive</h1>

      <p className='text-base leading-tight md:text-2xl mb-10'>
        From DJing to construction and scenography, the aim of Psst Workshops is
        to give underrepresented people access to practices they often hardly
        have access to. It’s a space where skills and knowledge can be share. By
        coming and learning together, we tackle the representation issue at its
        root.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto'>
        {/* Workshop 1 */}
        <div className='bg-white p-4 sm:p-6 rounded-lg'>
          <h2 className='text-4xl md:text-3xl mb-2 text-[#FFCC00]'>Admin</h2>

          <span className='bg-[#FFCC00] text-white px-1 py-0 text-sm font-mono'>
            12-03-2024
          </span>
          <span
            className={`bg-[#1d53ff] text-white px-2 py-0.5 rounded-full text-xs`}
          >
            ambient
          </span>
        </div>

        {/* Workshop 2 */}
        <div className='bg-white p-4 sm:p-6 rounded-lg'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#FFCC00]'>
            Sound Engineering Basics
          </h2>
          <p className='mb-4'>
            Get familiar with sound equipment and learn how to set up and manage
            sound for events.
          </p>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
            <span className='text-[#FFCC00] font-bold'>July 8, 2023</span>
            <button className='bg-[#FFCC00] text-white px-4 py-1 font-bold w-full sm:w-auto'>
              REGISTER
            </button>
          </div>
        </div>

        {/* Workshop 3 */}
        <div className='bg-white p-4 sm:p-6 rounded-lg'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#FFCC00]'>
            Safer Spaces Training
          </h2>
          <p className='mb-4'>
            Learn how to create and maintain safer spaces in nightlife
            environments.
          </p>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
            <span className='text-[#FFCC00] font-bold'>July 22, 2023</span>
            <button className='bg-[#FFCC00] text-white px-4 py-1 font-bold w-full sm:w-auto'>
              REGISTER
            </button>
          </div>
        </div>

        {/* Workshop 4 */}
        <div className='bg-white p-4 sm:p-6 rounded-lg'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#FFCC00]'>
            Music Production with Ableton
          </h2>
          <p className='mb-4'>
            Introduction to music production using Ableton Live. Bring your
            laptop!
          </p>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
            <span className='text-[#FFCC00] font-bold'>August 5, 2023</span>
            <button className='bg-[#FFCC00] text-white px-4 py-1 font-bold w-full sm:w-auto'>
              REGISTER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
