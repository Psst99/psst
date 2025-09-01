import { defineQuery } from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

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

export const psstPageQuery = `
  *[_type == "psstPage"][0]{
    about,
    charter,
    legal
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
    content
  }
`

export function getDatabaseBrowseQuery(
  orderClause: string,
  offset = 0,
  limit = 20
) {
  return `
  {
    "artists": *[
      _type == "artist" && approved == true &&

      // TAGS (supports mode = "all" | "any")
      (
        count($tagSlugs) == 0 ||
        ($mode == "all" && count((tags[]->slug.current)[@ in $tagSlugs]) == count($tagSlugs)) ||
        ($mode == "any" && array::intersects(tags[]->slug.current, $tagSlugs))
      ) &&

      // TEXT SEARCH
      (
        $search == "" ||
        artistName match "*" + $search + "*" ||
        description match "*" + $search + "*"
      ) &&

      // CATEGORIES (require ALL selected categories)
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
      (
        $search == "" ||
        artistName match "*" + $search + "*" ||
        description match "*" + $search + "*"
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
      // no filtering if no tagSlugs provided
      count($tagSlugs) == 0 ||
      // ALL tags must match
      ($mode == "all" && count($tagSlugs[slug in tags[]->slug.current]) == count($tagSlugs)) ||
      // ANY tag matches
      ($mode == "any" && count(tags[@->slug.current in $tagSlugs]) > 0)
    ) && (
      $search == "" || 
      artistName match "*" + $search + "*" || 
      description match "*" + $search + "*"
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
  "workshops": *[_type == "workshop"] | order(date desc){
    _id,
    title,
    date,
    location,
    description,
    tags[]->{
      _id,
      title,
      slug
    }
  }
}
`

export const nextWorkshopQuery = `
  *[_type == "workshop" && date >= now()] | order(date asc)[0]{
    _id,
    title,
    description,
    date
  }
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
