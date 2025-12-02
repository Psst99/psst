import {stegaClean} from '@sanity/client/stega'
import {Image} from 'next-sanity/image'
import {urlForImage} from '@/sanity/lib/utils'

interface CoverImageArchiveProps {
  image: any
  priority?: boolean
  className?: string
  alt?: string
}

export default function CoverImageArchive(props: CoverImageArchiveProps) {
  const {image: source, priority, alt} = props

  // 1. If no asset, return placeholder
  if (!source?.asset?._ref) {
    return <div className="bg-slate-100 w-full aspect-square" />
  }

  // 2. Generate the URL
  const imageUrl = urlForImage(source)
    ?.width(1200) // Fetch a reasonable max width
    .auto('format')
    .url()

  return (
    <div className="relative w-full">
      <Image
        className="w-full h-auto object-cover"
        // 3. IMPORTANT: Removing 'fill'.
        // We use width/height to let the browser calculate layout.
        // 1200/800 are base dimensions, CSS 'w-full h-auto' makes it responsive.
        width={1200}
        height={800}
        alt={stegaClean(alt) || stegaClean(source?.alt) || ''}
        src={imageUrl as string}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    </div>
  )
}
