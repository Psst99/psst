import {ImageOff} from 'lucide-react'
import CustomLink from './custom-link'
import {IoCloseSharp} from 'react-icons/io5'
import {IoMdClose} from 'react-icons/io'

interface SectionNavigationProps {
  currentSection?: string
  showSubNav?: boolean
  position?: 'top' | 'bottom'
}

const SECTION_COLORS = {
  home: '#D2D2D2',
  psst: '#dfff3d',
  database: '#6600ff',
  workshops: '#f50806',
  events: '#00ffdd',
  'pssound-system': '#07f25b',
  resources: '#fe93e7',
  archive: '#81520a',
} as const

export default function SectionNavigation({
  currentSection = '',
  showSubNav = false,
  position = 'top',
}: SectionNavigationProps) {
  return (
    <div className="w-full">
      {/* Main Navigation with overlapping tabs */}

      <div className="flex relative w-full">
        {/* <CustomLink
          href="/"
          className={`bg-[#D2D2D2] text-[#1D53FF] relative font-normal text-[18px] leading-[22px] uppercase tracking-normal px-10 py-1 border-[#1D53FF] border border-b-0 rounded-t-md flex items-center justify-center ${
            currentSection === 'home' ? 'z-20 section-underline' : 'z-10'
          }`}
          style={currentSection === 'home' ? {'--underline-color': SECTION_COLORS.home} : {}}
        >
          Home
        </CustomLink> */}
        <CustomLink
          href="/psst"
          className={`bg-[#DFFF3D] text-[#A20018] relative z-10 font-normal text-[18px] leading-[22px] uppercase tracking-normal px-10 py-1 border-[#A20018] border border-b-0 rounded-t-md flex -ml-px items-center justify-center ${
            currentSection === 'psst' ? 'z-20 section-underline' : ''
          }`}
          style={currentSection === 'psst' ? {'--underline-color': SECTION_COLORS.psst} : {}}
        >
          PSƧT
        </CustomLink>

        <CustomLink
          href="/database"
          className={`bg-[#6600ff] text-[#D3CD7F] relative font-normal text-[18px] leading-[22px] uppercase tracking-normal px-10 py-1 border border-b-0 rounded-t-md flex items-center justify-center border-[#D3CD7F] -ml-px z-9 
      ${currentSection === 'database' ? 'z-20 section-underline' : 'z-10'}
            `}
          style={
            currentSection === 'database' ? {'--underline-color': SECTION_COLORS.database} : {}
          }
        >
          Database
        </CustomLink>

        <CustomLink
          href="/resources"
          className={`bg-[#FE93E7] text-[#1D53FF] relative font-normal text-[18px] leading-[22px] uppercase tracking-normal px-10 py-1 border border-b-0 rounded-t-md flex items-center justify-center border-[#1D53FF] -ml-px z-5 ${
            currentSection === 'resources' ? 'z-20 section-underline' : 'z-10'
          }`}
          style={
            currentSection === 'resources' ? {'--underline-color': SECTION_COLORS.resources} : {}
          }
        >
          Resources
        </CustomLink>

        <CustomLink
          href="/pssound-system"
          className={`bg-[#07F25B] text-[#81520A] relative font-normal text-[18px] leading-[22px] uppercase tracking-normal px-10 py-1 border border-b-0 rounded-t-md flex items-center justify-center border-[#81520A] -ml-px z-6 ${
            currentSection === 'pssound-system' ? 'z-20 section-underline' : 'z-10'
          }`}
          style={
            currentSection === 'pssound-system'
              ? {'--underline-color': SECTION_COLORS['pssound-system']}
              : {}
          }
        >
          PSƧOUND System
        </CustomLink>

        <CustomLink
          href="/workshops"
          className={`bg-[#F50806] text-[#D2D2D2] relative font-normal text-[18px] leading-[22px] uppercase tracking-normal px-10 py-1 border border-b-0 rounded-t-md flex items-center justify-center border-[#D2D2D2] -ml-px z-8 ${
            currentSection === 'workshops' ? 'z-20 section-underline' : 'z-10'
          }`}
          style={
            currentSection === 'workshops' ? {'--underline-color': SECTION_COLORS.workshops} : {}
          }
        >
          Workshops
        </CustomLink>

        <CustomLink
          href="/events"
          className={`bg-[#00FFDD] text-[#4E4E4E] relative font-normal text-[18px] leading-[22px] tracking-normal px-10 py-1 border border-b-0 rounded-t-md flex items-center justify-center border-[#4E4E4E] -ml-px z-7 uppercase ${
            currentSection === 'events' ? 'z-20 section-underline' : 'z-10'
          }`}
          style={currentSection === 'events' ? {'--underline-color': SECTION_COLORS.events} : {}}
        >
          Events
        </CustomLink>

        <CustomLink
          href="/archive"
          className={`bg-[#81520A] text-[#FFCC00] relative font-normal text-[18px] leading-[22px] uppercase tracking-normal px-10 py-1 border border-b-0 rounded-t-md flex items-center justify-center border-[#FFCC00] -ml-px z-4 ${
            currentSection === 'archive' ? 'z-20 section-underline' : 'z-10'
          }`}
          style={currentSection === 'archive' ? {'--underline-color': SECTION_COLORS.archive} : {}}
        >
          Archive
        </CustomLink>

        {/* <CustomLink
          href='/'
          className={`bg-[#D2D2D2] text-[#F50806] relative font-normal text-[18px] leading-[22px] uppercase tracking-normal p-1 border border-b-0 rounded-t-md flex items-center justify-center border-[#F50806] -ml-px z-4 ${
            currentSection === 'archive' ? 'z-20' : 'z-10'
          }`}
        >
          <IoMdClose size={20} className='' />
        </CustomLink> */}
      </div>

      {/* Mobile section title */}
      <div className="md:hidden p-2 text-center">
        {currentSection === 'home' && <h1 className="text-2xl font-bold text-gray-800">HOME</h1>}
        {currentSection === 'psst' && <h1 className="text-2xl font-bold text-[#dfff3d]">PSST</h1>}
        {currentSection === 'database' && (
          <h1 className="text-2xl font-bold text-[#6600ff]">DATABASE</h1>
        )}
        {currentSection === 'workshops' && (
          <h1 className="text-2xl font-bold text-[#f50806]">WORKSHOPS</h1>
        )}
        {currentSection === 'events' && (
          <h1 className="text-2xl font-bold text-[#00ffdd]">EVENTS</h1>
        )}
        {currentSection === 'pssound-system' && (
          <h1 className="text-2xl font-bold text-[#07f25b]">PSSOUND SYSTEM</h1>
        )}
        {currentSection === 'resources' && (
          <h1 className="text-2xl font-bold text-[#fe93e7]">RESOURCES</h1>
        )}
        {currentSection === 'archive' && (
          <h1 className="text-2xl font-bold text-[#81520a]">ARCHIVE</h1>
        )}
      </div>
    </div>
  )
}
