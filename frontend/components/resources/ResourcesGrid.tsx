'use client'

import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

interface Resource {
  _id: string
  title: string
  description?: string
  url?: string
  fileUrl?: string
  category: string
  tags: Array<{_id: string; title: string; slug: string}> | null
  publishedAt: string
  image?: any
}

interface ResourcesGridProps {
  resources: Resource[]
}

export default function ResourcesGrid({resources}: ResourcesGridProps) {
  if (!resources?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-[#FE93E7] text-xl">No resources found</p>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'text':
        return '📄'
      case 'video':
        return '🎬'
      case 'sound':
        return '🔊'
      case 'website':
        return '🌐'
      default:
        return '📁'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <div
          key={resource._id}
          className="border border-[#FE93E7] rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl" aria-hidden="true">
              {getCategoryIcon(resource.category)}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(resource.publishedAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-xl font-semibold text-[#FE93E7] mb-2">{resource.title}</h3>

          {resource.image && (
            <div className="mb-3 relative h-40">
              <Image
                src={urlForImage(resource.image)?.width(400).height(240).url() ?? ''}
                alt={resource.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}

          {resource.description && (
            <p className="text-gray-700 mb-3 line-clamp-3">{resource.description}</p>
          )}

          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.filter(Boolean).map((tag) => (
                <span
                  key={tag._id}
                  className="text-xs bg-[#FE93E7] bg-opacity-20 text-[#FE93E7] px-2 py-1 rounded"
                >
                  {tag.title}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-auto pt-2">
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FE93E7] hover:underline"
              >
                Visit Link
              </a>
            )}

            {resource.fileUrl && (
              <a
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FE93E7] hover:underline"
              >
                Download
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
