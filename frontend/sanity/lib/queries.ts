import {defineQuery} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings" && _id == "siteSettings"][0]`)
export const themeSettingsQuery = defineQuery(
  `coalesce(*[_id == "drafts.themeSettings"][0], *[_id == "themeSettings"][0]){sectionColors}`,
)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

// export const psstPageQuery = `
//   *[_type == "psstPage"][0]{
//     about,
//     charter,
//     legal
//   }
// `

export const psstPageQuery = `
  *[_type == "psstPage"][0]{
    sections[]->{
      title,
      "slug": slug.current
    }
  }
`

export const eventsPageQuery = `
{
  "settings": *[_type == "pageSettings" && _id == "events-pageSettings"][0]{
    title,
    description
  },
  "events": *[_type == "event"] | order(date desc){
    _id,
    title,
    slug,
    date,
    location,
    "image": image.asset->url,
    description,
    url,
    tags[]->{
      _id,
      title,
      slug
    }
  }
}
`

export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    date,
    location,
    description,
    coverImage,
    tags[] -> { _id, title, slug }
  }
`

export const membershipPageQuery = `
  *[_type == "membershipPage"][0]{
    title,
    description
  }
`

export const resourcesPageQuery = `
{
  "settings": *[_type == "pageSettings" && _id == "resources-pageSettings"][0]{
    title,
    about
  },
  "resources": *[_type == "resource" && approved == true] | order(submittedAt desc) {
    title,
    description,
    link,
    tags,
    submittedAt
  }
}`

export const archivePageQuery = `
{
  "settings": *[_type == "pageSettings" && _id == "archive-pageSettings"][0]{
    title,
    description
  },
  "archiveMedia": *[_type == "archiveMedia"] | order(_createdAt desc){
    _id,
    title,
    description,
    image,
    tags[]->{
      _id,
      title
    }
  }
}
`
export const databaseGuidelinesQuery = `
  *[_type == "guidelines" && _id == "database-guidelines"][0]{
    content
  }
`

export const pssoundGuidelinesQuery = `
  *[_type == "guidelines" && _id == "pssound-guidelines"][0]{
    content
  }
`

export const resourcesGuidelinesQuery = `
  *[_type == "guidelines" && _id == "resources-guidelines"][0]{
    content,
    layout
  }
`

export function getDatabaseBrowseQuery(orderClause: string, offset = 0, limit = 20) {
  return `
  {
    "artists": *[
      _type == "artist" && approved == true &&

      // TAGS (supports mode = "all" | "any") - unchanged
      (
        count($tagSlugs) == 0 ||
        ($mode == "all" && count((tags[]->slug.current)[@ in $tagSlugs]) == count($tagSlugs)) ||
        ($mode == "any" && array::intersects(tags[]->slug.current, $tagSlugs))
      ) &&

      // TEXT SEARCH - UPDATED: now includes name, bio, tags, and categories
      (
        $search == "" ||
        artistName match "*" + $search + "*" ||
        description match "*" + $search + "*" ||
        tags[]->title match "*" + $search + "*" ||
        categories[]->title match "*" + $search + "*"
      ) &&

      // CATEGORIES (require ALL selected categories) - unchanged
      (
        count($categorySlugs) == 0 ||
        count((categories[]->slug.current)[@ in $categorySlugs]) == count($categorySlugs)
      )
    ]
    ${orderClause}
    [${offset}...${offset + limit}]
    {
      _id,
      artistName,
      slug,
      pronouns,
      customPronouns,
      email,
      categories[]->{ _id, title, "slug": slug.current },
      links,
      description,
      tags[]->{ _id, title, "slug": slug.current },
      _createdAt
    },

    "totalCount": count(*[
      _type == "artist" && approved == true &&
      (
        count($tagSlugs) == 0 ||
        ($mode == "all" && count((tags[]->slug.current)[@ in $tagSlugs]) == count($tagSlugs)) ||
        ($mode == "any" && array::intersects(tags[]->slug.current, $tagSlugs))
      ) &&
      // TEXT SEARCH - UPDATED: same as above
      (
        $search == "" ||
        artistName match "*" + $search + "*" ||
        description match "*" + $search + "*" ||
        tags[]->title match "*" + $search + "*" ||
        categories[]->title match "*" + $search + "*"
      ) &&
      (
        count($categorySlugs) == 0 ||
        count((categories[]->slug.current)[@ in $categorySlugs]) == count($categorySlugs)
      )
    ]),

    "categories": *[_type == "category"] | order(title asc) {
      _id, title, "slug": slug.current
    },

    "tags": *[_type == "tag"] | order(title asc) {
      _id, title, "slug": slug.current
    }
  }
  `
}

// You can also update your existing databaseBrowseQuery if needed:
export const databaseBrowseQuery = /* groq */ `
{
  "artists": *[
    _type == "artist" && approved == true && (
      // no filtering if no tagSlugs provided - unchanged
      count($tagSlugs) == 0 ||
      // ALL tags must match
      ($mode == "all" && count($tagSlugs[slug in tags[]->slug.current]) == count($tagSlugs)) ||
      // ANY tag matches
      ($mode == "any" && count(tags[@->slug.current in $tagSlugs]) > 0)
    ) && (
      // TEXT SEARCH - UPDATED: now includes name, bio, tags, and categories
      $search == "" || 
      artistName match "*" + $search + "*" || 
      description match "*" + $search + "*" ||
      tags[]->title match "*" + $search + "*" ||
      categories[]->title match "*" + $search + "*"
    ) && (
      $category == "" || $category in categories[]->slug.current
    )
  ] | order(artistName asc) {
    _id,
    artistName,
    slug,
    pronouns,
    customPronouns,
    email,
    categories[]->{ _id, title, "slug": slug.current },
    links,
    description,
    tags[]->{ _id, title, "slug": slug.current },
    _createdAt
  },

  "categories": *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  },

  "tags": *[_type == "tag"] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
}
`

export const databaseRegisterQuery = `
{
  "categories": *[_type == "category"] | order(title asc){
    _id,
    title
  },
  "tags": *[_type == "tag"] | order(title asc){
    _id,
    title
  }
}
`
export const artistBySlugQuery = `
  *[_type == "artist" && slug.current == $slug][0]{
    _id,
    artistName,
    pronouns,
    customPronouns,
    email,
    categories[]->{_id, title},
    links,
    description,
    tags[]->{_id, title}
  }
`
export const categoriesAndTagsQuery = `
{
  "categories": *[_type == "category"] | order(title asc){_id, title},
  "tags": *[_type == "tag"] | order(title asc){_id, title}
}
`
export const allWorkshopsQuery = `
  *[_type == "workshop" && date >= now()] | order(date asc){
    _id,
    title,
    date
  }
`

export const workshopsPageQuery = `
{
  "settings": *[_type == "pageSettings" && _id == "workshops-pageSettings"][0]{
    title,
    description
  },
  "workshops": *[_type == "workshop"] | order(dates[0] desc){
    _id,
    title,
    slug,
    dates,
    tags[] -> { _id, title, slug }
  }
}
`

export const nextWorkshopQuery = `
  *[_type == "workshop" && count(dates[@ >= now()]) > 0] | order(dates[0] asc)[0]{
    _id,
    title,
    description,
    dates,
    coverImage,
    totalSpots
  }
`

export const hasUpcomingWorkshopsQuery = `
  count(*[_type == "workshop" && count(dates[@ >= now()]) > 0]) > 0
`

export const allBlockedDatesQuery = `
  *[_type == "pssoundCalendar"]{
    startDate,
    endDate
  }
`
export const allApprovedCollectivesQuery = `
  *[_type == "pssoundMembership" && approved == true]{
    _id,
    collectiveName
  }
`
export const homepageQuery = `
  *[_type == "homepage"][0]{
    content,
  }
`
export const workshopBySlugQuery = `
  *[_type == "workshop" && slug.current == $slug][0]{
    _id,
    title,
    dates,
    tags[] -> { _id, title, slug },
    description,
    coverImage,
    photos,
    totalSpots,
    "slug": slug.current,
  }
`

export const pssoundArchiveQuery = `
{
  "settings": *[_type == "pageSettings" && _id == "pssound-archive-pageSettings"][0]{
    title,
    description
  },
  "archive": *[_type == "pssoundArchive"] | order(date desc){
    _id,
    title,
    "slug": slug.current,
    date,
    coverImage,
    description,
    tags[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
}
`

export const pssoundArchiveBySlugQuery = `
  *[_type == "pssoundArchive" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    date,
    coverImage,
    description,
    tags[] -> { _id, title, slug }
  }
`

export const pssoundArchivePageQuery = `
{
  "settings": *[_type == "pssoundArchivePage"][0]{
    title,
    about
  },
  "archive": *[_type == "pssoundArchive"] | order(date desc){
    _id,
    title,
    "slug": slug.current,
    date,
    coverImage,
    description,
    tags[]->{
      _id,
      title,
      slug
    }
  }
}
`

export const pssoundArchiveItemQuery = `
  *[_type == "pssoundArchive" && _id == $id][0]{
    _id,
    title,
    date,
    coverImage,
    description,
    tags[] -> { _id, title, slug }
  }
`

export const pssoundAboutQuery = `
{
  "settings": *[_type == "pageSettings" && _id == "pssound-about-pageSettings"][0]{
    title,
    description,
    layout
  }
}
`

export const pssoundManifestoQuery = `
{
  "settings": *[_type == "pageSettings" && _id == "pssound-manifesto-pageSettings"][0]{
    title,
    description,
    layout
  }
}
`

export const psstSectionsQuery = `
  *[_type == "psstSection"] | order(orderRank asc){
    title,
    "slug": slug.current
  }
`
export const psstSectionBySlugQuery = `
  *[_type == "psstSection" && slug.current == $slug][0]{
    title,
    content,
    layout
  }
`

export const manifestoPageQuery = `
  *[_type == "psstSection" && slug.current == "manifesto"][0]{
    title,
    content,
    layout
  }
`

export const aboutPageQuery = `
  *[_type == "psstSection" && slug.current == "about"][0]{
    title,
    content,
    layout
  }
`

export const upcomingWorkshopsQuery = defineQuery(`
  *[_type == "workshop" && count(dates[@ >= now()]) > 0] | order(dates[0] asc){
    _id,
    title,
    "slug": slug.current,
    coverImage,
    dates,
    totalSpots,
    "registrationsCount": count(*[_type == "workshopRegistration" && workshop._ref == ^._id && status == "approved"])
  }
`)

export const resourcesSubmitQuery = `
{
  "categories": [
    {"_id": "text", "title": "TEXT"},
    {"_id": "video", "title": "VIDEO"},
    {"_id": "sound", "title": "SOUND"},
    {"_id": "website", "title": "WEBSITE"}
  ],
  "tags": *[_type == "resourceTag"] | order(title asc){
    _id,
    title
  }
}
`
