export default function EventsPage() {
  return (
    <div className='p-4'>
      <h1 className='text-3xl md:text-4xl font-bold mb-6 text-center text-[#4E4E4E]'>
        Upcoming Events
      </h1>

      <div className='space-y-4 max-w-4xl mx-auto'>
        {/* Event 1 */}
        <div className='bg-white p-4 sm:p-6 border border-black rounded-md'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='w-full md:w-1/3 bg-gray-200 h-48 flex items-center justify-center'>
              [Event Poster]
            </div>
            <div className='w-full md:w-2/3'>
              <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#4E4E4E]'>
                PSST Mlle Presents: Summer Dance
              </h2>
              <p className='mb-4'>
                A night of electronic music featuring local DJs and visual
                artists. Safe space policies enforced.
              </p>
              <div className='flex flex-wrap gap-2 mb-4'>
                <span className='bg-[#1d53ff] text-white px-2 py-0.5 rounded-full text-xs'>
                  electronic
                </span>
                <span className='bg-[#07f25b] text-black px-2 py-0.5 rounded-full text-xs'>
                  ambient
                </span>
                <span className='bg-[#4E4E4E] text-black px-2 py-0.5 rounded-full text-xs'>
                  queer
                </span>
              </div>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                <span className='text-[#4E4E4E] font-bold'>
                  June 24, 2023 • 22:00-05:00
                </span>
                <button className='bg-[#4E4E4E] text-black px-4 py-1 font-bold w-full sm:w-auto'>
                  TICKETS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Event 2 */}
        <div className='bg-white p-4 sm:p-6 border border-black rounded-md'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='w-full md:w-1/3 bg-gray-200 h-48 flex items-center justify-center'>
              [Event Poster]
            </div>
            <div className='w-full md:w-2/3'>
              <h2 className='text-xl sm:text-2xl font-bold mb-2 text-[#4E4E4E]'>
                Collective Listening Session
              </h2>
              <p className='mb-4'>
                Join us for a collective listening session featuring
                experimental and ambient works by local artists.
              </p>
              <div className='flex flex-wrap gap-2 mb-4'>
                <span className='bg-[#81520a] text-white px-2 py-0.5 rounded-full text-xs'>
                  experimental
                </span>
                <span className='bg-[#07f25b] text-black px-2 py-0.5 rounded-full text-xs'>
                  ambient
                </span>
              </div>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0'>
                <span className='text-[#4E4E4E] font-bold'>
                  July 12, 2023 • 19:00-22:00
                </span>
                <button className='bg-[#4E4E4E] text-black px-4 py-1 font-bold w-full sm:w-auto'>
                  RSVP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
