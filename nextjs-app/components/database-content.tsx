'use client'

import { X } from '@/components/icons'
import { artists } from '@/data/artists'
import { Search } from 'lucide-react'
import CustomLink from './custom-link'

export default function DatabaseContent() {
  return (
    <div className='p-4 pt-0'>
      <div className='flex flex-col md:flex-row gap-4'>
        {/* Left Sidebar - Full width on mobile, sidebar on desktop */}
        <div className='w-full md:w-80 space-y-3'>
          {/* Search */}
          <div className='bg-white p-4 rounded-md relative hidden md:block'>
            <div className='text-center text-[#6600ff] font-bold mb-2 md:block hidden'>
              SEARCH
            </div>
            <input
              type='text'
              className='w-full p-1 text-center'
              placeholder='Search...'
            />
            <button className='md:hidden absolute right-6 top-4 bg-[#6600ff] text-white p-2 rounded-full'>
              <Search size={20} />
            </button>
          </div>

          <div className='flex items-center-justify-center w-full'>
            <button className='md:hidden bg-[#6600ff] text-white p-3 rounded-full mx-auto'>
              <Search size={25} className='rotate-90' />
            </button>
          </div>

          {/* Sort - Hidden on mobile */}
          <div className='bg-white p-4 rounded-md hidden md:block'>
            <div className='text-center text-[#6600ff] font-bold mb-2'>
              SORT
            </div>
            <div className='space-y-2'>
              <button className='w-full border border-[#6600ff] text-[#6600ff] p-1 rounded-md'>
                Alphabetically
              </button>
              <button className='w-full border border-[#6600ff] text-[#6600ff] p-1 rounded-md'>
                Chronologically
              </button>
              <button className='w-full bg-[#6600ff] text-white p-1 rounded-md'>
                Randomly
              </button>
            </div>
          </div>

          {/* Categories - Hidden on mobile */}
          <div className='bg-white p-4 rounded-md hidden md:block'>
            <div className='text-center text-[#6600ff] font-bold mb-2'>
              CATEGORIES
            </div>
            <div className='flex flex-wrap gap-1'>
              <div className='bg-[#6600ff] text-white px-2 py-0.5 rounded-full text-sm'>
                COLLECTIVE
              </div>
              <div className='bg-[#6600ff] text-white px-2 py-0.5 rounded-full text-sm flex items-center'>
                DJ <X size={14} className='ml-1' />
              </div>
              <div className='bg-[#6600ff] text-white px-2 py-0.5 rounded-full text-sm'>
                LIVE ARTIST
              </div>
              <div className='bg-[#6600ff] text-white px-2 py-0.5 rounded-full text-sm flex items-center'>
                PRODUCER <X size={14} className='ml-1' />
              </div>
              <div className='bg-[#f50806] text-white px-2 py-0.5 rounded-full text-sm'>
                SAFETY
              </div>
              <div className='bg-[#6600ff] text-white px-2 py-0.5 rounded-full text-sm'>
                TECHNICIAN
              </div>
              <div className='bg-[#6600ff] text-white px-2 py-0.5 rounded-full text-sm'>
                VISUAL ARTIST
              </div>
            </div>
          </div>

          {/* Tags - Hidden on mobile */}
          <div className='bg-white p-4 rounded-md hidden md:block'>
            <div className='text-center text-[#6600ff] font-bold mb-2'>
              TAGS
            </div>
            <div className='flex flex-wrap gap-1'>
              <div className='bg-[#f50806] text-white px-2 py-0.5 rounded-full text-xs'>
                90s
              </div>
              <div className='bg-[#07f25b] text-black px-2 py-0.5 rounded-full text-xs'>
                ambient
              </div>
              <div className='bg-[#ffcc00] text-black px-2 py-0.5 rounded-full text-xs'>
                bass
              </div>
              <div className='bg-[#4e4e4e] text-white px-2 py-0.5 rounded-full text-xs'>
                bedroom
              </div>
              <div className='bg-[#1d53ff] text-white px-2 py-0.5 rounded-full text-xs'>
                breaks
              </div>
              <div className='bg-[#ffcc00] text-black px-2 py-0.5 rounded-full text-xs'>
                club
              </div>
              <div className='bg-[#07f25b] text-black px-2 py-0.5 rounded-full text-xs'>
                costume design
              </div>
              <div className='bg-[#d2d2d2] text-black px-2 py-0.5 rounded-full text-xs'>
                dance
              </div>
              <div className='bg-[#fe93e7] text-black px-2 py-0.5 rounded-full text-xs'>
                dancehall
              </div>
              <div className='bg-[#81520a] text-white px-2 py-0.5 rounded-full text-xs'>
                decor
              </div>
              <div className='bg-[#f50806] text-white px-2 py-0.5 rounded-full text-xs'>
                dub
              </div>
              <div className='bg-[#07f25b] text-black px-2 py-0.5 rounded-full text-xs'>
                electro
              </div>
              <div className='bg-[#fe93e7] text-black px-2 py-0.5 rounded-full text-xs flex items-center'>
                electronic <X size={14} className='ml-1' />
              </div>
              <div className='bg-[#81520a] text-white px-2 py-0.5 rounded-full text-xs'>
                experimental
              </div>
              <div className='bg-[#f50806] text-white px-2 py-0.5 rounded-full text-xs'>
                feminist
              </div>
              <div className='bg-[#ffcc00] text-black px-2 py-0.5 rounded-full text-xs'>
                fourth world
              </div>
              <div className='bg-[#d2d2d2] text-black px-2 py-0.5 rounded-full text-xs'>
                gabber
              </div>
              <div className='bg-[#07f25b] text-black px-2 py-0.5 rounded-full text-xs'>
                glitchrap
              </div>
              <div className='bg-[#f50806] text-white px-2 py-0.5 rounded-full text-xs'>
                hardcore
              </div>
              <div className='bg-[#1d53ff] text-white px-2 py-0.5 rounded-full text-xs'>
                hard dance
              </div>
              <div className='bg-[#4e4e4e] text-white px-2 py-0.5 rounded-full text-xs'>
                heartbroken
              </div>
              <div className='bg-[#07f25b] text-black px-2 py-0.5 rounded-full text-xs'>
                hip hop
              </div>
              <div className='bg-[#f50806] text-white px-2 py-0.5 rounded-full text-xs'>
                hyperpop
              </div>
              <div className='bg-[#d2d2d2] text-black px-2 py-0.5 rounded-full text-xs'>
                installations
              </div>
              <div className='bg-[#ffcc00] text-black px-2 py-0.5 rounded-full text-xs'>
                jazz
              </div>
              <div className='bg-[#fe93e7] text-black px-2 py-0.5 rounded-full text-xs'>
                jumpstyle
              </div>
              <div className='bg-[#81520a] text-white px-2 py-0.5 rounded-full text-xs'>
                party
              </div>
              <div className='bg-[#f50806] text-white px-2 py-0.5 rounded-full text-xs'>
                perrocore
              </div>
              <div className='bg-[#d2d2d2] text-black px-2 py-0.5 rounded-full text-xs'>
                poc
              </div>
              <div className='bg-[#07f25b] text-black px-2 py-0.5 rounded-full text-xs'>
                protest
              </div>
              <div className='bg-[#fe93e7] text-black px-2 py-0.5 rounded-full text-xs'>
                psytrance
              </div>
              <div className='bg-[#00ffdd] text-black px-2 py-0.5 rounded-full text-xs'>
                queer
              </div>
            </div>
          </div>
        </div>

        {/* Artist List */}
        <div className='flex-1 space-y-3 mt-4 md:mt-0'>
          {artists.map((artist) => (
            <CustomLink
              key={artist.id}
              href={`/database/${artist.id}`}
              className='block w-full'
            >
              <div className='bg-white p-4 rounded-lg hover:shadow-md transition-shadow'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                  <h2 className='text-[#6600ff] text-4xl md:text-3xl'>
                    {artist.name}
                  </h2>
                  <div className='flex flex-wrap gap-2'>
                    {artist.roles.map((role) => (
                      <span
                        key={role}
                        className='bg-[#6600ff] text-white px-1 py-0 text-sm font-mono flex items-center gap-2'
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className='flex flex-wrap gap-1 mt-4'>
                  {artist.tags.map((tag, index) => {
                    // Assign colors based on tag categories
                    let bgColor = ''
                    if (['video', 'installations', 'visual'].includes(tag))
                      bgColor = 'bg-[#81520a]'
                    else if (['bass', 'dancehall', 'reggaeton'].includes(tag))
                      bgColor = 'bg-[#ffcc00]'
                    else if (['electronic', 'psst-mlle'].includes(tag))
                      bgColor = 'bg-[#1d53ff]'
                    else if (['ambient'].includes(tag)) bgColor = 'bg-[#07f25b]'
                    else if (['experimental'].includes(tag))
                      bgColor = 'bg-[#ffcc00]'
                    else if (['fourth world'].includes(tag))
                      bgColor = 'bg-[#ffcc00]'
                    else bgColor = 'bg-[#f50806]'

                    return (
                      <span
                        key={tag}
                        className={`${bgColor} text-white px-2 py-0.5 rounded-full text-xs`}
                      >
                        {tag}
                      </span>
                    )
                  })}
                </div>
              </div>
            </CustomLink>
          ))}
        </div>
      </div>
    </div>
  )
}
