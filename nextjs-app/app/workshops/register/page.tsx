export default function RegisterPage() {
  return (
    <div className='p-4'>
      <div className='bg-white p-6 border border-black rounded-md max-w-2xl mx-auto'>
        <h1 className='text-[#6600ff] text-3xl font-bold mb-6 text-center'>
          Register for the Database
        </h1>

        <form className='space-y-4'>
          <div>
            <label className='block text-[#6600ff] font-bold mb-1'>
              Name / Collective Name
            </label>
            <input type='text' className='w-full border border-black p-2' />
          </div>

          <div>
            <label className='block text-[#6600ff] font-bold mb-1'>
              Categories (select all that apply)
            </label>
            <div className='flex flex-wrap gap-2'>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-1' />
                <span>DJ</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-1' />
                <span>PRODUCER</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-1' />
                <span>LIVE ARTIST</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-1' />
                <span>COLLECTIVE</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-1' />
                <span>VISUAL ARTIST</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-1' />
                <span>TECHNICIAN</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-1' />
                <span>SAFETY</span>
              </label>
            </div>
          </div>

          <div>
            <label className='block text-[#6600ff] font-bold mb-1'>
              Tags (comma separated)
            </label>
            <input
              type='text'
              className='w-full border border-black p-2'
              placeholder='ambient, experimental, bass...'
            />
          </div>

          <div>
            <label className='block text-[#6600ff] font-bold mb-1'>
              Contact Email
            </label>
            <input type='email' className='w-full border border-black p-2' />
          </div>

          <div>
            <label className='block text-[#6600ff] font-bold mb-1'>Bio</label>
            <textarea className='w-full border border-black p-2 h-32'></textarea>
          </div>

          <div>
            <label className='block text-[#6600ff] font-bold mb-1'>
              Links (SoundCloud, Instagram, etc.)
            </label>
            <textarea className='w-full border border-black p-2 h-20'></textarea>
          </div>

          <button
            type='submit'
            className='w-full bg-[#6600ff] text-white py-2 font-bold'
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  )
}
