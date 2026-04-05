type ContentPageSkeletonProps = {
  layout: 'default' | 'columns'
  tone?: 'section' | 'panel'
}

function lineClass(tone: 'section' | 'panel') {
  return tone === 'panel' ? 'bg-white/15' : 'bg-[color:var(--section-accent)]/30'
}

export default function ContentPageSkeleton({layout, tone = 'section'}: ContentPageSkeletonProps) {
  const block = lineClass(tone)

  if (layout === 'columns') {
    return (
      <div className="animate-pulse">
        <div className="md:flex md:items-start md:gap-20">
          <div className="w-full">
            <div className={`h-24 md:h-32 ${block} rounded-lg mb-16`} />
            <div className={`h-16 ${block} rounded-lg mt-16 mb-5`} />
            <div className={`h-20 ${block} rounded-lg mt-5 mb-5`} />
            <div className={`h-16 ${block} rounded-lg mt-5`} />
          </div>
          <div className="w-full mt-16 md:mt-0">
            <div className={`h-8 w-4/5 ${block} rounded-lg mb-5`} />
            <div className={`h-24 ${block} rounded-lg mt-5 mb-16`} />
            <div className={`h-8 w-4/5 ${block} rounded-lg mt-16 mb-5`} />
            <div className={`h-24 ${block} rounded-lg mt-5`} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pulse xl:max-w-[65vw] xl:mx-auto">
      <div className={`p-4 rounded-3xl mb-8 h-80 ${block}`} />
      <div className={`h-28 rounded-3xl mb-8 ${block}`} />
      <div className={`p-4 rounded-3xl mb-8 h-16 ${block}`} />
    </div>
  )
}
