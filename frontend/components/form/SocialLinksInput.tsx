import React, { useState } from 'react'
import { Control, Controller } from 'react-hook-form'

interface SocialLinksInputProps {
  name: string
  control: Control<any>
}

export const SocialLinksInput: React.FC<SocialLinksInputProps> = ({
  name,
  control,
}) => {
  const [newLinkUrl, setNewLinkUrl] = useState('')

  const detectPlatform = (url: string): string => {
    const cleanUrl = url.toLowerCase()

    if (cleanUrl.includes('instagram.com')) return 'Instagram'
    if (cleanUrl.includes('soundcloud.com')) return 'SoundCloud'
    if (cleanUrl.includes('bandcamp.com')) return 'Bandcamp'
    if (cleanUrl.includes('spotify.com')) return 'Spotify'
    if (cleanUrl.includes('music.apple.com')) return 'Apple Music'
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be'))
      return 'YouTube'
    if (cleanUrl.includes('mixcloud.com')) return 'Mixcloud'
    if (cleanUrl.includes('residentadvisor.net')) return 'Resident Advisor'
    if (cleanUrl.includes('discogs.com')) return 'Discogs'
    if (cleanUrl.includes('beatport.com')) return 'Beatport'
    if (cleanUrl.includes('tiktok.com')) return 'TikTok'
    if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com'))
      return 'Twitter/X'
    if (cleanUrl.includes('facebook.com')) return 'Facebook'

    try {
      const domain = new URL(url).hostname.replace('www.', '')
      return domain.charAt(0).toUpperCase() + domain.slice(1)
    } catch {
      return 'Website'
    }
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const addLink = () => {
          if (!newLinkUrl.trim()) return

          try {
            new URL(newLinkUrl) // Validate URL
            onChange([...(value || []), newLinkUrl])
            setNewLinkUrl('')
          } catch {
            // Invalid URL, could show error
          }
        }

        const removeLink = (index: number) => {
          onChange(value?.filter((_: string, i: number) => i !== index) || [])
        }

        return (
          <div className='bg-white rounded-b-lg p-4 md:w-full md:rounded-l-none md:rounded-tr-lg'>
            {/* Selected Links */}
            <div className='flex flex-wrap gap-2 mb-3'>
              {value?.map((url: string, index: number) => (
                <span
                  key={index}
                  className='bg-white border border-[#6600ff] text-[#6600ff] px-1 py-0 rounded-md text-sm font-medium flex items-center gap-2 font-mono'
                >
                  {detectPlatform(url)}
                  <button
                    type='button'
                    onClick={() => removeLink(index)}
                    className='text-current hover:opacity-70'
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* URL Input */}
            <div className='flex gap-2'>
              <input
                type='url'
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addLink())
                }
                placeholder='Paste your link here (Instagram, SoundCloud, etc.)'
                className='flex-1 px-3 py-0 border border-[#6600ff] rounded-sm text-[#6600ff] placeholder-gray-400'
              />
              <button
                type='button'
                onClick={addLink}
                className='bg-[#6600ff] text-white px-4 py-0 rounded-sm hover:opacity-90'
              >
                Add
              </button>
            </div>
          </div>
        )
      }}
    />
  )
}
