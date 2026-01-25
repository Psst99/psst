import type {SectionSlug} from '@/lib/theme/sections'
import PsstLoading from './PsstLoading'
import DatabaseLoading from './DatabaseLoading'

// import WorkshopsLoading from './workshops-loading'
// import EventsLoading from './events-loading'
// import PssoundSystemLoading from './pssound-system-loading'
// import ResourcesLoading from './resources-loading'
// import ArchiveLoading from './archive-loading'

export default function SectionLoading({section}: {section: SectionSlug}) {
  switch (section) {
    case 'psst':
      return <PsstLoading />
    case 'database':
      return <DatabaseLoading />
    // case 'workshops':
    //   return <WorkshopsLoading />
    // case 'events':
    //   return <EventsLoading />
    // case 'pssound-system':
    //   return <PssoundSystemLoading />
    // case 'resources':
    //   return <ResourcesLoading />
    // case 'archive':
    //   return <ArchiveLoading />
    case 'home':
    default:
      return null
  }
}
