export default function ResourcesPage() {
  return (
    <div className='p-4'>
      <h1 className='text-3xl md:text-4xl font-bold mb-6 text-center text-[#1D53FF]'>
        Resources
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto'>
        {/* Resource 1 */}
        <div className='bg-white p-4 sm:p-6 border border-black rounded-md'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#1D53FF]'>
            Safer Spaces Guidelines
          </h2>
          <p className='mb-4'>
            A comprehensive guide to creating and maintaining safer spaces at
            events and in nightlife.
          </p>
          <button className='bg-[#1D53FF] text-black px-4 py-1 font-bold w-full sm:w-auto'>
            DOWNLOAD PDF
          </button>
        </div>

        {/* Resource 2 */}
        <div className='bg-white p-4 sm:p-6 border border-black rounded-md'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#1D53FF]'>
            DIY Sound System Guide
          </h2>
          <p className='mb-4'>
            Learn how to build and maintain your own community sound system on a
            budget.
          </p>
          <button className='bg-[#1D53FF] text-black px-4 py-1 font-bold w-full sm:w-auto'>
            DOWNLOAD PDF
          </button>
        </div>

        {/* Resource 3 */}
        <div className='bg-white p-4 sm:p-6 border border-black rounded-md'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#1D53FF]'>
            Event Organizing Checklist
          </h2>
          <p className='mb-4'>
            A practical checklist for organizing inclusive and accessible
            events.
          </p>
          <button className='bg-[#1D53FF] text-black px-4 py-1 font-bold w-full sm:w-auto'>
            DOWNLOAD PDF
          </button>
        </div>

        {/* Resource 4 */}
        <div className='bg-white p-4 sm:p-6 border border-black rounded-md'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#1D53FF]'>
            Reading List
          </h2>
          <p className='mb-4'>
            A curated list of books, articles, and resources on intersectional
            feminism in music and nightlife.
          </p>
          <button className='bg-[#1D53FF] text-black px-4 py-1 font-bold w-full sm:w-auto'>
            VIEW LIST
          </button>
        </div>
      </div>
    </div>
  )
}
