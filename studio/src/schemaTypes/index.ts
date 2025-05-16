import {artist} from './documents/artist'
import {page} from './documents/page'
import {post} from './documents/post'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import {psstPage} from './singletons/psstPage'
import {category} from './documents/category'
import {tag} from './documents/tag'
import {guidelines} from './singletons/guidelines'
import {workshop} from './documents/workshop'
import {workshopRegistration} from './documents/workshopRegistration'
import {workshopTag} from './documents/workshopTag'
import {event} from './documents/event'
import {pssoundRequest} from './documents/pssoundRequest'
import {pssoundManual} from './singletons/pssoundManual'
import {pssoundCalendar} from './documents/pssoundCalendar'
import {pageSettings} from './singletons/pageSettings'
import {resource} from './documents/resource'

import archiveMedia from './documents/archiveMedia'
import {archiveTag} from './documents/archiveTag'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  guidelines,
  pageSettings,
  // Documents
  psstPage,
  category,
  page,
  post,
  artist,
  tag,
  workshopTag,
  workshop,
  workshopRegistration,
  event,
  pssoundRequest,
  pssoundManual,
  pssoundCalendar,
  resource,
  archiveMedia,
  archiveTag,
  // Objects
  blockContent,
  infoSection,
  callToAction,
  link,
]
