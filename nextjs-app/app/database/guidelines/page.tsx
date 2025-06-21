export default function GuidelinesPage() {
  return (
    <div className='p-4'>
      <div className='bg-white p-6 border border-black rounded-md max-w-3xl mx-auto'>
        <h1 className='text-[#6600ff] text-3xl font-bold mb-6 text-center'>
          Database Guidelines
        </h1>

        <div className='space-y-4'>
          <div>
            <h2 className='text-[#6600ff] text-xl font-bold mb-2'>
              Who can register?
            </h2>
            <p>
              Our database is open to MaGe* artists and cultural workers in the
              nightlife and music scene who align with our values of
              intersectional feminism, inclusion, and representation. We
              particularly encourage registration from people who face
              discrimination based on gender, race, sexuality, disability, or
              economic background.
            </p>
          </div>

          <div>
            <h2 className='text-[#6600ff] text-xl font-bold mb-2'>
              How we use your information
            </h2>
            <p>
              The information you provide will be displayed in our public
              database to increase your visibility and create connections within
              the community. Event organizers, venues, and other artists use our
              database to find collaborators and talent.
            </p>
          </div>

          <div>
            <h2 className='text-[#6600ff] text-xl font-bold mb-2'>
              Community standards
            </h2>
            <p>By registering in our database, you agree to:</p>
            <ul className='list-disc pl-5 mt-2'>
              <li>Respect the values of our platform</li>
              <li>
                Provide accurate information about yourself/your collective
              </li>
              <li>Update your information when necessary</li>
              <li>Engage respectfully with others in the community</li>
            </ul>
          </div>

          <div>
            <h2 className='text-[#6600ff] text-xl font-bold mb-2'>
              Moderation
            </h2>
            <p>
              All submissions are reviewed by our team before being published.
              We reserve the right to reject or remove entries that don't align
              with our values or community standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
