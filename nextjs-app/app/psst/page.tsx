export default function PsstPage() {
  return (
    <>
      <div className='p-6 rounded-md max-w-4xl mx-auto'>
        <h1 className='text-[#A20018] text-4xl font-bold mb-6 text-center h-full'>
          Charter
        </h1>

        <p className='text-[#A20018] text-center mb-8 text-2xl'>
          We invite anyone willing to work with us to agree with the charter
          below:
        </p>

        {/* What we try to bring */}
        <div className='bg-[#A20018] text-[#dfff3d] p-6 rounded-3xl mb-8'>
          <h2 className='text-2xl font-bold mb-4'>What we try to bring</h2>
          <div className='space-y-2'>
            <p>
              A space where everyone can express themselves while respecting
              others.
            </p>
            <p>A space to share knowledge and experience.</p>
            <p>A space where we can question ourselves.</p>
            <p>
              A space where we deconstruct the codes established by the
              patriarchy.
            </p>
            <p>A space where we question our own codes.</p>
            <p>A space where under-represented issues are raised.</p>
            <p>A space where the invisible can express themselves.</p>
            <p>A space where party and care go hand in hand.</p>
            <p>
              A space where emerging and established talents are valued equally.
            </p>
            <p>A redefinition of the party space.</p>
            <p>And some lightness and love, too.</p>
          </div>
        </div>

        <p className='text-[#A20018] text-center mb-8'>
          Psst Mlle is a space dedicated to coming together and reinventing
          things from scratch.
        </p>

        {/* What we expect from you */}
        <div className='bg-[#A20018] text-[#dfff3d] p-6 rounded-3xl'>
          <h2 className='text-2xl font-bold mb-4'>What we expect from you</h2>
          <p>
            We expect from the people we interact with — audiences,
            institutions, venues, artists, collectives, media — to respect our
            values and the people we work with.
          </p>
        </div>
      </div>
    </>
  )
}
