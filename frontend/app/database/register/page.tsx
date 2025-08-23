// 'use client'

// import { useState } from 'react'

// const CATEGORIES = [
//   { id: 'dj', label: 'DJ', color: 'bg-[#6600ff] text-white' },
//   { id: 'producer', label: 'PRODUCER', color: 'bg-[#6600ff] text-white' },
//   { id: 'vocalist', label: 'VOCALIST', color: 'bg-[#6600ff] text-white' },
//   {
//     id: 'instrumentalist',
//     label: 'INSTRUMENTALIST',
//     color: 'bg-[#6600ff] text-white',
//   },
// ]

// const TAGS = [
//   { id: 'electronic', label: 'electronic', color: 'bg-[#6600ff] text-white' },
//   { id: 'ambient', label: 'ambient', color: 'bg-[#07f25b] text-[#81520A]' },
//   { id: 'breaks', label: 'breaks', color: 'bg-[#1D53FF] text-white' },
//   { id: 'bass', label: 'bass', color: 'bg-[#FFCC00] text-[#81520A]' },
//   { id: 'dub', label: 'dub', color: 'bg-[#A20018] text-white' },
//   { id: 'techno', label: 'techno', color: 'bg-[#6600ff] text-white' },
//   { id: 'house', label: 'house', color: 'bg-[#00FFDD] text-[#4E4E4E]' },
//   {
//     id: 'experimental',
//     label: 'experimental',
//     color: 'bg-[#FE93E7] text-[#1D53FF]',
//   },
// ]

// export default function RegisterPage() {
//   const [formData, setFormData] = useState({
//     artistName: '',
//     pronouns: '',
//     email: '',
//   })

//   const [selectedCategories, setSelectedCategories] = useState<string[]>([])
//   const [selectedTags, setSelectedTags] = useState<string[]>([])
//   const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
//   const [showTagDropdown, setShowTagDropdown] = useState(false)
//   const [socialLinks, setSocialLinks] = useState<
//     { platform: string; url: string }[]
//   >([])
//   const [newLinkUrl, setNewLinkUrl] = useState('')
//   const [description, setDescription] = useState('')

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const toggleCategory = (categoryId: string) => {
//     setSelectedCategories((prev) =>
//       prev.includes(categoryId)
//         ? prev.filter((id) => id !== categoryId)
//         : [...prev, categoryId]
//     )
//   }

//   const toggleTag = (tagId: string) => {
//     setSelectedTags((prev) =>
//       prev.includes(tagId)
//         ? prev.filter((id) => id !== tagId)
//         : [...prev, tagId]
//     )
//   }

//   const removeCategory = (categoryId: string) => {
//     setSelectedCategories((prev) => prev.filter((id) => id !== categoryId))
//   }

//   const removeTag = (tagId: string) => {
//     setSelectedTags((prev) => prev.filter((id) => id !== tagId))
//   }

//   // Function to detect platform from URL
//   const detectPlatform = (url: string): string => {
//     const cleanUrl = url.toLowerCase()

//     if (cleanUrl.includes('instagram.com')) return 'Instagram'
//     if (cleanUrl.includes('soundcloud.com')) return 'SoundCloud'
//     if (cleanUrl.includes('bandcamp.com')) return 'Bandcamp'
//     if (cleanUrl.includes('spotify.com')) return 'Spotify'
//     if (cleanUrl.includes('music.apple.com')) return 'Apple Music'
//     if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be'))
//       return 'YouTube'
//     if (cleanUrl.includes('mixcloud.com')) return 'Mixcloud'
//     if (cleanUrl.includes('residentadvisor.net')) return 'Resident Advisor'
//     if (cleanUrl.includes('discogs.com')) return 'Discogs'
//     if (cleanUrl.includes('beatport.com')) return 'Beatport'
//     if (cleanUrl.includes('tiktok.com')) return 'TikTok'
//     if (cleanUrl.includes('twitter.com') || cleanUrl.includes('x.com'))
//       return 'Twitter/X'
//     if (cleanUrl.includes('facebook.com')) return 'Facebook'

//     // Extract domain for unknown platforms
//     try {
//       const domain = new URL(url).hostname.replace('www.', '')
//       return domain.charAt(0).toUpperCase() + domain.slice(1)
//     } catch {
//       return 'Website'
//     }
//   }

//   const addSocialLink = () => {
//     if (!newLinkUrl.trim()) return

//     const platform = detectPlatform(newLinkUrl)
//     const newLink = { platform, url: newLinkUrl }

//     setSocialLinks((prev) => [...prev, newLink])
//     setNewLinkUrl('')
//   }

//   const removeSocialLink = (index: number) => {
//     setSocialLinks((prev) => prev.filter((_, i) => i !== index))
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       addSocialLink()
//     }
//   }

//   const [submitting, setSubmitting] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSubmitting(true)
//     setError(null)
//     setSuccess(false)

//     try {
//       const res = await fetch('/api/register-artist', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...formData,
//           categories: selectedCategories,
//           tags: selectedTags,
//           links: socialLinks,
//           description,
//         }),
//       })

//       if (!res.ok) throw new Error('Submission failed')
//       setSuccess(true)
//       // Optionally reset form here
//     } catch (err: any) {
//       setError(err.message || 'Something went wrong')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className='p-4 h-full w-full md:max-w-[65vw] mx-auto'>
//       <form className='space-y-4' onSubmit={handleSubmit}>
//         {/* Name Field */}
//         <div className='w-full bg-[#6600ff] text-white rounded-lg mb-6 md:flex md:items-center md:justify-center h-auto'>
//           <label className='block text-white font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//             Name
//           </label>
//           <input
//             type='text'
//             value={formData.artistName}
//             onChange={(e) => handleInputChange('artistName', e.target.value)}
//             className='w-full rounded-t-none rounded-b-lg text-[#6600ff] px-4 py-2 text-2xl md:text-3xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full'
//           />
//         </div>

//         {/* Pronouns Field */}
//         <div className='w-full bg-[#6600ff] text-white rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//           <label className='block text-white font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//             Pronouns
//           </label>
//           <input
//             type='text'
//             value={formData.pronouns}
//             onChange={(e) => handleInputChange('pronouns', e.target.value)}
//             className='w-full rounded-t-none rounded-b-lg text-[#6600ff] px-4 py-2 text-2xl md:text-3xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full'
//           />
//         </div>

//         {/* Email Field */}
//         <div className='w-full bg-[#6600ff] text-white rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//           <label className='block text-white font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//             E-mail
//           </label>
//           <input
//             type='email'
//             value={formData.email}
//             onChange={(e) => handleInputChange('email', e.target.value)}
//             className='w-full rounded-t-none rounded-b-lg text-[#6600ff] px-4 py-2 text-2xl md:text-3xl border-0 outline-0 md:rounded-l-none md:rounded-tr-lg bg-white h-full'
//           />
//         </div>

//         {/* Categories Field */}
//         <div className='w-full bg-[#6600ff] text-white rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//           <div className='flex items-center justify-between p-0 md:w-[30%]'>
//             <label className='block text-white font-medium text-center uppercase font-mono flex-1'>
//               Categorie(s)
//             </label>
//             <button
//               type='button'
//               onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
//               className='text-white text-lg mr-2'
//             >
//               {showCategoryDropdown ? '▲' : '▼'}
//             </button>
//           </div>

//           <div className='bg-white rounded-b-lg p-0 md:w-full md:rounded-l-none md:rounded-tr-lg'>
//             {/* Selected Categories */}
//             <div className='flex flex-wrap gap-2 mb-3 py-2 px-4'>
//               {selectedCategories.map((categoryId) => {
//                 const category = CATEGORIES.find((c) => c.id === categoryId)
//                 return category ? (
//                   <span
//                     key={categoryId}
//                     className={`${category.color} p-1.25 py-0.25 font-mono text-lg uppercase font-thin leading-tight flex items-center gap-3`}
//                   >
//                     {category.label}
//                     <button
//                       type='button'
//                       onClick={() => removeCategory(categoryId)}
//                       className='text-current hover:opacity-70'
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ) : null
//               })}
//             </div>

//             {/* Category Dropdown */}
//             {showCategoryDropdown && (
//               <div className='border border-gray-200 rounded-lg p-2 bg-gray-50'>
//                 {CATEGORIES.map((category) => (
//                   <button
//                     key={category.id}
//                     type='button'
//                     onClick={() => toggleCategory(category.id)}
//                     className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
//                       selectedCategories.includes(category.id)
//                         ? 'bg-gray-200 font-medium'
//                         : ''
//                     }`}
//                   >
//                     {category.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Tags Field */}
//         <div className='w-full bg-[#6600ff] text-white rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//           <div className='flex items-center justify-between p-0 md:w-[30%]'>
//             <label className='block text-white font-medium text-center uppercase font-mono flex-1'>
//               Tag(s)
//             </label>
//             <button
//               type='button'
//               onClick={() => setShowTagDropdown(!showTagDropdown)}
//               className='text-white text-lg mr-2'
//             >
//               {showTagDropdown ? '▲' : '▼'}
//             </button>
//           </div>

//           <div className='bg-white rounded-b-lg p-4 md:w-full md:rounded-l-none md:rounded-tr-lg'>
//             {/* Selected Tags */}
//             <div className='flex flex-wrap gap-2 mb-3'>
//               {selectedTags.map((tagId) => {
//                 const tag = TAGS.find((t) => t.id === tagId)
//                 return tag ? (
//                   <span
//                     key={tagId}
//                     className={`${tag.color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}
//                   >
//                     {tag.label}
//                     <button
//                       type='button'
//                       onClick={() => removeTag(tagId)}
//                       className='text-current hover:opacity-70'
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ) : null
//               })}
//             </div>

//             {/* Tag Dropdown */}
//             {showTagDropdown && (
//               <div className='border border-gray-200 rounded-lg p-2 bg-gray-50 max-h-48 overflow-y-auto'>
//                 {TAGS.map((tag) => (
//                   <button
//                     key={tag.id}
//                     type='button'
//                     onClick={() => toggleTag(tag.id)}
//                     className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
//                       selectedTags.includes(tag.id)
//                         ? 'bg-gray-200 font-medium'
//                         : ''
//                     }`}
//                   >
//                     {tag.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className='w-full bg-[#6600ff] text-white rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//           <label className='block text-white font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//             Link(s)
//           </label>

//           <div className='bg-white rounded-b-lg p-4 md:w-full md:rounded-l-none md:rounded-tr-lg'>
//             {/* Selected Links as Tags */}
//             <div className='flex flex-wrap gap-2 mb-3'>
//               {socialLinks.map((link, index) => (
//                 <span
//                   key={index}
//                   className='bg-white border border-[#6600ff] text-[#6600ff] px-1 py-0 rounded-md text-sm font-medium flex items-center gap-2 font-mono'
//                 >
//                   {link.platform}
//                   <button
//                     type='button'
//                     onClick={() => removeSocialLink(index)}
//                     className='text-current hover:opacity-70'
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//             </div>

//             {/* URL Input */}
//             <div className='flex gap-2'>
//               <input
//                 type='url'
//                 value={newLinkUrl}
//                 onChange={(e) => setNewLinkUrl(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder='Paste your link here (Instagram, SoundCloud, etc.)'
//                 className='flex-1 px-3 py-0 border border-[#6600ff] rounded-sm text-[#6600ff] placeholder-gray-400'
//               />
//               <button
//                 type='button'
//                 onClick={addSocialLink}
//                 className='bg-[#6600ff] text-white px-4 py-0 rounded-sm hover:opacity-90'
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Description Field */}
//         <div className='w-full h-full bg-[#6600ff] text-white rounded-lg md:flex md:items-center md:justify-center mb-32'>
//           <label className='block text-white font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//             Description
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows={4}
//             className='w-full rounded-t-none rounded-b-lg text-[#6600ff] px-4 py-2 text-2xl md:text-3xl border-0 outline-0 resize-none md:rounded-l-none md:rounded-tr-lg h-full bg-white'
//             // placeholder='Tell us about your music, style, influences...'
//           />
//         </div>

//         {/* Submit Button */}
//         {success && (
//           <div className='text-green-600'>
//             Thank you! Your submission was received.
//           </div>
//         )}
//         {error && <div className='text-red-600'>{error}</div>}
//         {/* <button
//           type='submit'
//           className='mt-16 bg-[#6600ff] text-white text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block'
//         >
//           Submit
//         </button> */}
//         <button
//           type='submit'
//           className='mt-16 bg-[#6600ff] text-white text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block'
//           disabled={submitting}
//         >
//           {submitting ? 'Submitting...' : 'Submit'}
//         </button>
//       </form>
//     </div>
//   )
// }

import { ArtistRegistrationForm } from '@/components/database/ArtistRegistrationForm'

import { sanityFetch } from '@/sanity/lib/live'
import { categoriesAndTagsQuery } from '@/sanity/lib/queries'

export default async function RegisterPage() {
  const { data } = await sanityFetch({ query: categoriesAndTagsQuery })
  const { categories, tags } = data

  return <ArtistRegistrationForm categories={categories} tags={tags} />
}
