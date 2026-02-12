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
  HomeIcon,
  CheckmarkIcon,
  FolderIcon,
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
import {CiBoxList} from 'react-icons/ci'

import {orderableDocumentListDeskItem, orderRankField} from '@sanity/orderable-document-list'
import pluralize from 'pluralize-esm'
import ThemePreviewTool from '../components/ThemePreviewTool'

import type {StructureBuilder, StructureResolver} from 'sanity/structure'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

// const DISABLED_TYPES = ['settings', 'psstPage', 'assist.instruction.context']
const STUDIO_API_VERSION = '2024-10-28'

export const structure: StructureResolver = (S: StructureBuilder, context) =>
  S.list()
    .title('CMS')
    .items([
      S.listItem()
        .title('Homepage')
        .child(S.document().schemaType('homepage').documentId('homepage'))
        .icon(HomeIcon),

      S.divider(),

      S.documentTypeListItem('psstSection').title('PSƧT').icon(BsFillInfoCircleFill),
      // Database section
      S.listItem()
        .title('Database')
        .icon(ListIcon)
        .child(
          S.list()
            .title('Database')
            .items([
              // Artists section
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
                            .apiVersion(STUDIO_API_VERSION)
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
                            .apiVersion(STUDIO_API_VERSION)
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
                                .apiVersion(STUDIO_API_VERSION)
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

      // ————— RESOURCES SECTION —————
      S.listItem()
        .title('Resources')
        .icon(ArchiveIcon)
        .child(
          S.list()
            .title('Resources')
            .items([
              S.listItem()
                .title('Pending submissions')
                .icon(ClockIcon)
                .child(
                  S.documentTypeList('resourceSubmission')
                    .title('Pending submissions')
                    .apiVersion(STUDIO_API_VERSION)
                    .filter(
                      '_type == "resourceSubmission" && (!defined(approved) || approved == false)',
                    ),
                ),

              S.listItem()
                .title('All submissions')
                .icon(ListIcon)
                .child(
                  S.documentTypeList('resourceSubmission')
                    .title('All submissions')
                    .apiVersion(STUDIO_API_VERSION)
                    .filter('_type == "resourceSubmission"'),
                ),

              S.listItem()
                .title('Approved Resources')
                .icon(ListIcon)
                .child(
                  S.documentTypeList('resource')
                    .title('Approved Resources')
                    .apiVersion(STUDIO_API_VERSION)
                    .filter('_type == "resource" && approved == true'),
                ),

              S.listItem()
                .title('All Resources')
                .icon(ListIcon)
                .child(
                  S.documentTypeList('resource')
                    .title('All Resources')
                    .apiVersion(STUDIO_API_VERSION)
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

      // ————— PSSOUND SYSTEM SECTION —————
      S.listItem()
        .title('PSƧOUND System')
        .icon(BsFillSpeakerFill)
        .child(
          S.list()
            .title('PSƧOUND System')
            .items([
              // Content Pages Group
              S.listItem()
                .title('Pages')
                .icon(BookIcon)
                .child(
                  S.list()
                    .title('Pages')
                    .items([
                      S.listItem()
                        .title('About')
                        .icon(InfoOutlineIcon)
                        .child(
                          S.document()
                            .schemaType('pageSettings')
                            .documentId('pssound-about-pageSettings'),
                        ),
                      S.listItem()
                        .title('Manifesto')
                        .icon(EditIcon)
                        .child(
                          S.document()
                            .schemaType('pageSettings')
                            .documentId('pssound-manifesto-pageSettings'),
                        ),
                    ]),
                ),

              // Request System Group
              S.listItem()
                .title('Request')
                .icon(BsFillInboxFill)
                .child(
                  S.list()
                    .title('Request System')
                    .items([
                      S.listItem()
                        .title('Sound System Requests')
                        .icon(BsFillInboxFill)
                        .child(
                          S.documentTypeList('pssoundRequest')
                            .title('New Requests')
                            .apiVersion(STUDIO_API_VERSION)
                            .filter(
                              '_type == "pssoundRequest" && !defined(archived) || archived == false',
                            ),
                        ),
                      S.listItem()
                        .title('Blocked dates')
                        .icon(CgUnavailable)
                        .child(
                          S.documentTypeList('pssoundCalendar')
                            .title('Blocked dates')
                            .apiVersion(STUDIO_API_VERSION)
                            .filter('_type == "pssoundCalendar"'),
                        ),
                      S.divider(),
                      S.listItem()
                        .title('Membership Requests')
                        .icon(UserIcon)
                        .child(
                          S.documentTypeList('pssoundMembership')
                            .title('Pending Memberships')
                            .apiVersion(STUDIO_API_VERSION)
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
                            .apiVersion(STUDIO_API_VERSION)
                            .filter('_type == "pssoundMembership" && approved == true'),
                        ),
                    ]),
                ),

              // Archive Group
              S.listItem()
                .title('Archive')
                .icon(ArchiveIcon)
                .child(
                  S.list()
                    .title('Archive')
                    .items([
                      S.listItem()
                        .title('Archive items')
                        .icon(ListIcon)
                        .child(
                          S.documentTypeList('pssoundArchive')
                            .title('Archive Items')
                            .apiVersion(STUDIO_API_VERSION)
                            .filter('_type == "pssoundArchive"')
                            .defaultOrdering([{field: 'date', direction: 'desc'}]),
                        ),
                      S.listItem()
                        .title('Page settings')
                        .icon(CogIcon)
                        .child(
                          S.document()
                            .schemaType('pageSettings')
                            .documentId('pssound-archive-pageSettings'),
                        ),
                    ]),
                ),

              // Documentation
              S.divider(),
              S.listItem()
                .title('Documentation')
                .icon(PiNotebookDuotone)
                .child(
                  S.list()
                    .title('Documentation')
                    .items([
                      S.listItem()
                        .title('Guidelines')
                        .icon(CiBoxList)
                        .child(
                          S.document().schemaType('guidelines').documentId('pssound-guidelines'),
                        ),
                      S.listItem()
                        .title('User manual')
                        .icon(PiNotebookDuotone)
                        .child(
                          S.document().schemaType('pssoundManual').documentId('pssound-manual'),
                        ),
                    ]),
                ),
            ]),
        ),

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
                    .apiVersion(STUDIO_API_VERSION)
                    .filter('_type == "workshop"')
                    .defaultOrdering([{field: 'dates', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Upcoming')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('workshop')
                    .title('Upcoming Workshops')
                    .apiVersion(STUDIO_API_VERSION)
                    .filter('_type == "workshop" && count(dates[@ >= now()]) > 0') // Changed to check if any date in array is upcoming
                    .defaultOrdering([{field: 'dates', direction: 'asc'}]), // Changed 'date' to 'dates'
                ),
              S.listItem()
                .title('Past')
                .icon(ArchiveIcon)
                .child(
                  S.documentTypeList('workshop')
                    .title('Past Workshops')
                    .apiVersion(STUDIO_API_VERSION)
                    .filter('_type == "workshop" && count(dates[@ < now()]) > 0') // Changed to check if any date in array is past
                    .defaultOrdering([{field: 'dates', direction: 'desc'}]), // Changed 'date' to 'dates'
                ),
              S.divider(),

              S.listItem()
                .title('Registrations')
                .icon(ClockIcon)
                .child(
                  S.list()
                    .title('Registration Management')
                    .items([
                      S.listItem()
                        .title('Pending Review')
                        .icon(ClockIcon)
                        .child(
                          S.documentList()
                            .title('Pending Registrations')
                            .apiVersion(STUDIO_API_VERSION)
                            .filter('_type == "workshopRegistration" && status == "pending"')
                            .defaultOrdering([{field: 'registrationDate', direction: 'desc'}]),
                        ),
                      S.listItem()
                        .title('Approved')
                        .icon(CheckmarkIcon)
                        .child(
                          S.documentList()
                            .title('Approved Registrations')
                            .apiVersion(STUDIO_API_VERSION)
                            .filter('_type == "workshopRegistration" && status == "approved"')
                            .defaultOrdering([{field: 'registrationDate', direction: 'desc'}]),
                        ),
                      S.listItem()
                        .title('All Registrations')
                        .icon(ListIcon)
                        .child(
                          S.documentList()
                            .title('All Registrations')
                            .apiVersion(STUDIO_API_VERSION)
                            .filter('_type == "workshopRegistration"')
                            .defaultOrdering([{field: 'registrationDate', direction: 'desc'}]),
                        ),
                      S.divider(),
                      S.listItem()
                        .title('By Workshop')
                        .icon(FolderIcon)
                        .child(
                          S.documentTypeList('workshop')
                            .title('Select Workshop')
                            .child((workshopId) =>
                              S.list()
                                .title('Registration Status')
                                .items([
                                  S.listItem()
                                    .title('Pending')
                                    .child(
                                      S.documentList()
                                        .title('Pending Registrations')
                                        .apiVersion(STUDIO_API_VERSION)
                                        .filter(
                                          '_type == "workshopRegistration" && workshop._ref == $workshopId && status == "pending"',
                                        )
                                        .params({workshopId})
                                        .defaultOrdering([
                                          {field: 'registrationDate', direction: 'desc'},
                                        ]),
                                    ),
                                  S.listItem()
                                    .title('Approved')
                                    .child(
                                      S.documentList()
                                        .title('Approved Registrations')
                                        .apiVersion(STUDIO_API_VERSION)
                                        .filter(
                                          '_type == "workshopRegistration" && workshop._ref == $workshopId && status == "approved"',
                                        )
                                        .params({workshopId})
                                        .defaultOrdering([
                                          {field: 'registrationDate', direction: 'desc'},
                                        ]),
                                    ),
                                  S.listItem()
                                    .title('All for this Workshop')
                                    .child(
                                      S.documentList()
                                        .title('All Registrations')
                                        .apiVersion(STUDIO_API_VERSION)
                                        .filter(
                                          '_type == "workshopRegistration" && workshop._ref == $workshopId',
                                        )
                                        .params({workshopId})
                                        .defaultOrdering([
                                          {field: 'registrationDate', direction: 'desc'},
                                        ]),
                                    ),
                                ]),
                            ),
                        ),
                    ]),
                ),
              S.divider(),
              S.listItem()
                .title('Settings')
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
                    .apiVersion(STUDIO_API_VERSION)
                    .filter('_type == "event"')
                    .defaultOrdering([{field: 'date', direction: 'desc'}]),
                ),
              S.listItem()
                .title('Upcoming')
                .icon(CalendarIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Upcoming Events')
                    .apiVersion(STUDIO_API_VERSION)
                    .filter('_type == "event" && date >= now()')
                    .defaultOrdering([{field: 'date', direction: 'asc'}]),
                ),
              S.listItem()
                .title('Past')
                .icon(ArchiveIcon)
                .child(
                  S.documentTypeList('event')
                    .title('Past Events')
                    .apiVersion(STUDIO_API_VERSION)
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
      //   .apiVersion(STUDIO_API_VERSION).filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
      //   // Pluralize the title of each document type.  This is not required but just an option to consider.
      //   .map((listItem) => {
      //     return listItem.title(pluralize(listItem.getTitle() as string))
      //   }),
      // // Settings Singleton in order to view/edit the one particular document for Settings.  Learn more about Singletons: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list

      S.listItem()
        .title('Theme')
        .child(
          S.document()
            .schemaType('themeSettings')
            .documentId('themeSettings')
            .views([
              S.view.form(),
              S.view.component(ThemePreviewTool).title('Preview').id('theme-preview'),
            ]),
        )
        .icon(CogIcon),

      S.listItem()
        .title('Site settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
