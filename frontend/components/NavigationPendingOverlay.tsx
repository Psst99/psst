'use client'

import SectionScope from '@/components/SectionScope'
import {useNavigationPending} from '@/app/NavigationPendingProvider'
import SectionLoading from './loading/SectionLoading'

export default function NavigationPendingOverlay() {
  const ctx = useNavigationPending()
  if (!ctx?.state.pending) return null

  const {section} = ctx.state

  // Overlay sits above page, shows exact section skeleton immediately
  return (
    <SectionScope section={section} variant="page" className="contents">
      <div className="fixed inset-0 z-[9998] pointer-events-none panel-bg panel-fg">
        <div className="pointer-events-none">
          <SectionLoading section={section} />
        </div>
      </div>
    </SectionScope>
  )
}
