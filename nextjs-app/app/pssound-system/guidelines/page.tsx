export default function GuidelinesPage() {
  return (
    <div className='max-w-3xl mx-auto px-4'>
      <h1 className='text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-[#07f25b]'>
        SOUND SYSTEM GUIDELINES
      </h1>
      <div className='bg-white p-4 sm:p-6 rounded-lg'>
        <div className='space-y-6'>
          <section>
            <h2 className='text-xl sm:text-2xl font-bold text-[#81520a] mb-2'>
              Eligibility
            </h2>
            <p>
              Our sound system is available to collectives and events that align
              with our values of intersectional feminism, inclusion, and
              representation in nightlife and music. We prioritize MaGe* artists
              and cultural workers, especially those facing discrimination based
              on gender, race, sexuality, disability, or economic background.
            </p>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-bold text-[#81520a] mb-2'>
              Rental Fees
            </h2>
            <p>
              We operate on a sliding scale pricing model based on your event
              budget:
            </p>
            <ul className='list-disc pl-5 mt-2'>
              <li>Community events (non-profit): €50-150</li>
              <li>Small events with ticket sales: €150-300</li>
              <li>Larger commercial events: €300-500</li>
            </ul>
            <p className='mt-2'>
              If your collective or organization cannot afford these rates,
              please contact us to discuss alternative arrangements.
            </p>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-bold text-[#81520a] mb-2'>
              Equipment Available
            </h2>
            <ul className='list-disc pl-5'>
              <li>2 × Active PA Speakers (1000W each)</li>
              <li>2 × Subwoofers (800W each)</li>
              <li>1 × 6-channel Mixer</li>
              <li>2 × CDJ-2000</li>
              <li>1 × DJM-900 Mixer</li>
              <li>Basic lighting setup</li>
              <li>Cables and accessories</li>
            </ul>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-bold text-[#81520a] mb-2'>
              Booking Process
            </h2>
            <ol className='list-decimal pl-5'>
              <li>Check the calendar for availability</li>
              <li>Submit a request form with your event details</li>
              <li>
                Our team will review your request (usually within 3-5 days)
              </li>
              <li>If approved, you'll receive a confirmation and invoice</li>
              <li>Payment must be made at least 7 days before the event</li>
              <li>Pickup and return arrangements will be confirmed</li>
            </ol>
          </section>

          <section>
            <h2 className='text-xl sm:text-2xl font-bold text-[#81520a] mb-2'>
              Care and Responsibility
            </h2>
            <p>
              The borrower is responsible for the equipment from pickup to
              return. Any damage beyond normal wear and tear will be charged. We
              require a security deposit of €300, which will be returned upon
              safe return of all equipment.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
