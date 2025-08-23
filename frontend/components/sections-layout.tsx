import SectionNavigation from '@/components/section-navigation'
import SubNavigation from '@/components/sub-navigation'
import MobileHeader from '@/components/mobile-header'

interface SectionsLayoutProps {
  children: React.ReactNode
  currentSection: string
  mainColor: string
  accentColor: string
  subNavItems?: { label: string; href: string }[]
}

export default function SectionsLayout({
  children,
  currentSection,
  mainColor,
  accentColor,
  subNavItems,
}: SectionsLayoutProps) {
  return (
    <>
      {/* Mobile background */}
      <div
        className={`fixed top-0 inset-0 -z-10 border-b-0 border-t-0 md:hidden`}
        style={{ backgroundColor: mainColor, borderColor: accentColor }}
      />
      <div className='min-h-screen flex flex-col overflow-hidden'>
        {/* Desktop nav */}
        <div className='shrink-0 hidden md:block'>
          <SectionNavigation currentSection={currentSection} />
          {subNavItems && (
            <SubNavigation
              items={subNavItems}
              mainColor={mainColor}
              accentColor={accentColor}
            />
          )}
        </div>
        {/* Main content */}
        <div
          className='flex-1 overflow-y-auto py-16 md:mt-0 z-10'
          style={{
            backgroundColor: accentColor,
            borderColor: mainColor,
            borderWidth: 1,
            borderTopWidth: 0,
            borderRadius: '1rem 0 0 1rem',
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
