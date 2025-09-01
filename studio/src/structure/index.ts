import {
  BookIcon,
  ClockIcon,
  CalendarIcon,
  CogIcon,
  InfoOutlineIcon,
  ListIcon,
  TagIcon,
  UserIcon,
  EnvelopeIcon,
  EditIcon,
  ArchiveIcon,
} from '@sanity/icons'
import {
  BsFillSpeakerFill,
  BsFillInboxFill,
  BsPlusCircle,
  BsFillInfoCircleFill,
} from 'react-icons/bs'
import {PiNotebookDuotone} from 'react-icons/pi'
import {LuLibrary, LuLightbulb} from 'react-icons/lu'
import {CgUnavailable} from 'react-icons/cg'
import {CiBoxList, CiSettings} from 'react-icons/ci'

import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

// const DISABLED_TYPES = ['settings', 'psstPage', 'assist.instruction.context']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('CMS')
    .items([
      S.listItem()
        .title('Psst')
        .child(S.document().schemaType('psstPage').documentId('psstPage')) // Make sure this matches the documentId for the singleton
        .icon(BsFillInfoCircleFill),

      // ————— DATABASE SECTION —————
      S.listItem()
        .title('Database')
        .icon(ListIcon)
        .child(
          S.list()
            .title('Database')
            .items([
              // ————— ARTISTS SECTION —————
              S.listItem()
                .title('Artists')
                .icon(UserIcon)
                .child(
                  S.list()
                    .title('Artists')
                    .items([
                      // Pending Submissions
                      S.listItem()
                        .title('Pending Submissions')
                        .child(
                          S.documentTypeList('artist')
                            .title('Pending Submissions')
                            .filter(
                              '_type == "artist" && (!defined(approved) || approved == false)',
                            ),
                        ),
                      S.divider(),
                      // All Artists
                      S.listItem()
                        .title('All Artists')
                        .child(
                          S.documentTypeList('artist')
                            .title('All Artists')
                            .filter('_type == "artist" && approved == true'),
                        ),

                      // Browse by Category
                      S.listItem()
                        .title('Browse by Category')
                        .child(
                          S.documentTypeList('category')
                            .title('Categories')
                            .child((categoryId) =>
                              S.documentTypeList('artist')
                                .title(`Artists in selected category`)
                                .filter('_type == "artist" && $categoryId in categories[]._ref')
                                .params({categoryId}),
                            ),
                        ),
                    ]),
                ),

              S.divider(),
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('tag').title('Tags').icon(TagIcon),

              // ————— GUIDELINES SECTION —————
              S.divider(),
              S.listItem()
                .title('Guidelines')
                .icon(BookIcon)
                .child(S.document().schemaType('guidelines').documentId('database-guidelines')),
            ]),
        ),

      // ————— WORKSHOPS SECTION —————
      // S.listItem()
      //   .title('Workshops')
      //   .icon(LuLightbulb)
      //   .child(
      //     S.list()
      //       .title('Workshops')
      //       .items([
      //         // All workshops
      //         S.documentTypeListItem('workshop').title('Workshops'),

      //         // Workshop Registrations grouped by workshop
      //         S.listItem()
      //           .title('Workshop Registrations')
      //           .icon(ClockIcon)
      //           .child(
      //             S.documentTypeList('workshop')
      //               .title('Select Workshop')
      //               .child((workshopId) =>
      //                 S.documentList()
      //                   .title('Registrations')
      //                   .filter('_type == "workshopRegistration" && workshop._ref == $workshopId')
      //                   .params({workshopId}),
      //               ),
      //           ),

      //         S.divider(),
      //         S.listItem()
      //           .title('Page settings')
      //           .icon(CogIcon)
      //           .child(
      //             S.document().schemaType('pageSettings').documentId('workshops-pageSettings'),
      //           ),
      //       ]),
      //   ),
      S.listItem()
        .title('Workshops')
        .icon(LuLightbulb)
        .child(
          S.list()
            .title('Workshops')
            .items([
              S.listItem()
                .title('All')
                .icon(ListIcon)
                .child(
                  S.documentTypeList('workshop')
                    .title('All Workshops')
                    .filter('_type == "workshop"')
                    .defaultOrdering([{field: 'date', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Upcoming')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('workshop')
                    .title('Upcoming Workshops')
                    .filter('_type == "workshop" && date >= now()')
                    .defaultOrdering([{field: 'date', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Past')
                .icon(ArchiveIcon)
                .child(
                  S.documentTypeList('workshop')
                    .title('Past Workshops')
                    .filter('_type == "workshop" && date < now()')
                    .defaultOrdering([{field: 'date', direction: 'desc'}]),
                ),
              S.divider(),
              S.listItem()
                .title('Workshop Registrations')
                .icon(ClockIcon)
                .child(
                  S.documentTypeList('workshop')
                    .title('Select Workshop')
                    .child((workshopId) =>
                      S.documentList()
                        .title('Registrations')
                        .filter('_type == "workshopRegistration" && workshop._ref == $workshopId')
                        .params({workshopId}),
                    ),
                ),
              S.divider(),
              S.listItem()
                .title('Page settings')
                .icon(CogIcon)
                .child(
                  S.document().schemaType('pageSettings').documentId('workshops-pageSettings'),
                ),
            ]),
        ),

      // ————— EVENTS SECTION —————
      S.listItem()
        .title('Events')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Events')
            .items([
              S.listItem()
                .title('All')
                .icon(ListIcon)
                .child(
                  S.documentTypeList('event')
                    .title('All Events')
                    .filter('_type == "event"')
                    .defaultOrdering([{field: 'date', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Upcoming')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Upcoming Events')
                    .filter('_type == "event" && date >= now()')
                    .defaultOrdering([{field: 'date', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Past')
                .icon(ArchiveIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Past Events')
                    .filter('_type == "event" && date < now()')
                    .defaultOrdering([{field: 'date', direction: 'desc'}]),
                ),

              S.divider(),
              S.documentTypeListItem('eventTag').title('Tags').icon(TagIcon),
              S.divider(),
              S.listItem()
                .title('Page settings')
                .icon(CogIcon)
                .child(S.document().schemaType('pageSettings').documentId('events-pageSettings')),
            ]),
        ),

      // ————— PSSOUND SYSTEM SECTION —————
      S.listItem()
        .title('Pssound System')
        .icon(BsFillSpeakerFill)
        .child(
          S.list()
            .title('Pssound System')
            .items([
              S.listItem()
                .title('Requests')
                .icon(BsFillInboxFill)
                .child(
                  S.documentTypeList('pssoundRequest')
                    .title('New Requests')
                    .filter('_type == "pssoundRequest" && !defined(archived) || archived == false'),
                ),

              S.listItem()
                .title('Blocked dates')
                .icon(CgUnavailable)
                .child(
                  S.documentTypeList('pssoundCalendar')
                    .title('Blocked dates')
                    .filter('_type == "pssoundCalendar"'),
                ),
              S.divider(),
              S.listItem()
                .title('Membership Requests')
                .icon(UserIcon)
                .child(
                  S.documentTypeList('pssoundMembership')
                    .title('Pending Memberships')
                    .filter(
                      '_type == "pssoundMembership" && (!defined(approved) || approved == false)',
                    ),
                ),

              S.listItem()
                .title('Accepted Memberships')
                .icon(UserIcon)
                .child(
                  S.documentTypeList('pssoundMembership')
                    .title('Accepted Memberships')
                    .filter('_type == "pssoundMembership" && approved == true'),
                ),

              S.listItem()
                .title('Membership page')
                .icon(CogIcon)
                .child(S.document().schemaType('membershipPage')),
              S.divider(),

              S.listItem()
                .title('Guidelines')
                .icon(CiBoxList)
                .child(S.document().schemaType('guidelines').documentId('pssound-guidelines')),

              S.listItem()
                .title('User manual')
                .icon(PiNotebookDuotone)
                .child(S.document().schemaType('pssoundManual').documentId('pssound-manual')),

              S.divider(),
              S.listItem()
                .title('Page settings')
                .icon(CogIcon)
                .child(S.document().schemaType('pageSettings').documentId('pssound-pageSettings')),
            ]),
        ),

      // ————— RESOURCES SECTION —————
      S.listItem()
        .title('Resources')
        .icon(ArchiveIcon)
        .child(
          S.list()
            .title('Resources')
            .items([
              S.listItem().title('Pending submissions').icon(ClockIcon).child(
                S.documentTypeList('resource')
                  .title('Pending submissions')
                  .filter(
                    '_type == "resource" && (!defined(approved) || approved == false) && defined(email)',
                  ), // Added email check to distinguish submissions
              ),

              S.listItem()
                .title('Approved Resources')
                .icon(ListIcon)
                .child(
                  S.documentTypeList('resource')
                    .title('Approved Resources')
                    .filter('_type == "resource" && approved == true'),
                ),

              S.listItem()
                .title('All Resources')
                .icon(ListIcon)
                .child(
                  S.documentTypeList('resource')
                    .title('All Resources')
                    .filter('_type == "resource"'),
                ),

              S.divider(),

              S.listItem()
                .title('Guidelines')
                .icon(BookIcon)
                .child(S.document().schemaType('guidelines').documentId('resources-guidelines')),

              S.divider(),

              S.listItem()
                .title('Page settings')
                .icon(CogIcon)
                .child(
                  S.document().schemaType('pageSettings').documentId('resources-pageSettings'),
                ),
            ]),
        ),

      S.listItem()
        .title('Archive')
        .icon(LuLibrary)
        .child(
          S.list()
            .title('Archive')
            .items([
              // 1. Browse media (all archiveMedia docs)
              S.documentTypeListItem('archiveMedia').title('Media').icon(ListIcon),

              S.divider(),
              S.documentTypeListItem('archiveTag').title('Tags').icon(TagIcon),

              S.divider(),

              // 3. Archive Page Settings (singleton)
              S.listItem()
                .title('Page settings')
                .icon(CogIcon)
                .child(S.document().schemaType('pageSettings').documentId('archive-pageSettings')),
            ]),
        ),

      S.divider(),

      // ...S.documentTypeListItems()
      //   // Remove the "assist.instruction.context" and "settings" content  from the list of content types
      //   .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
      //   // Pluralize the title of each document type.  This is not required but just an option to consider.
      //   .map((listItem) => {
      //     return listItem.title(pluralize(listItem.getTitle() as string))
      //   }),
      // // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list

      S.listItem()
        .title('Site settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
