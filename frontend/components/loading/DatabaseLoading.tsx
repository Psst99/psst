export default function DatabaseLoading() {
  return (
    <div className="p-6 md:px-20 animate-pulse">
      <div className="md:flex md:items-start md:gap-20">
        {/* Left column */}
        <div className="w-full text-base leading-tight md:text-xl">
          {/* First paragraph - larger text */}
          <div className="h-24 md:h-32 bg-[#6600ff]/30 rounded-lg mb-16"></div>

          {/* Second paragraph - after mt-16 */}
          <div className="h-16 bg-[#6600ff]/30 rounded-lg mt-16 mb-5"></div>

          {/* Third paragraph - after mt-5 */}
          <div className="h-20 bg-[#6600ff]/30 rounded-lg mt-5 mb-5"></div>

          {/* Fourth paragraph - after mt-5 */}
          <div className="h-16 bg-[#6600ff]/30 rounded-lg mt-5"></div>
        </div>

        {/* Right column */}
        <div className="w-full mt-8 md:mt-0">
          {/* First section */}
          <div className="h-8 w-4/5 bg-[#6600ff]/30 rounded-lg mb-5 md:text-3xl"></div>
          <div className="h-24 bg-[#6600ff]/30 rounded-lg mt-5 mb-16"></div>

          {/* Second section - after mt-16 */}
          <div className="h-8 w-4/5 bg-[#6600ff]/30 rounded-lg mt-16 mb-5 md:text-3xl"></div>
          <div className="h-24 bg-[#6600ff]/30 rounded-lg mt-5"></div>
        </div>
      </div>
    </div>
  )
}
