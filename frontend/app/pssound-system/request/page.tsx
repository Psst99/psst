// 'use client'

// import Calendar from '@/components/calendar'
// import { useState } from 'react'

// export default function SoundSystemRequestPage() {
//   const [formData, setFormData] = useState({
//     eventTitle: '',
//     eventLink: '',
//     eventLocation: '',
//     eventDescription: '',
//     isPolitical: {
//       feminist: false,
//       queer: false,
//       racial: false,
//       disability: false,
//       fundraiser: '',
//       other: '',
//     },
//     marginalizedArtists: [{ name: '', link: '' }],
//     wagePolicy: '',
//     eventDate: '',
//     pickupDate: '',
//     returnDate: '',
//     vehicleCert: false,
//     teamCert: false,
//     charterCert: false,
//     membershipCert: false,
//   })

//   // Handle input changes
//   const handleInputChange = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   // Handle checkbox group for isPolitical
//   const handlePoliticalChange = (key: string, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       isPolitical: { ...prev.isPolitical, [key]: value },
//     }))
//   }

//   // Handle marginalized artists array
//   const handleArtistChange = (
//     idx: number,
//     key: 'name' | 'link',
//     value: string
//   ) => {
//     setFormData((prev) => {
//       const updated = [...prev.marginalizedArtists]
//       updated[idx][key] = value
//       return { ...prev, marginalizedArtists: updated }
//     })
//   }
//   const addArtist = () => {
//     setFormData((prev) => ({
//       ...prev,
//       marginalizedArtists: [
//         ...prev.marginalizedArtists,
//         { name: '', link: '' },
//       ],
//     }))
//   }
//   const removeArtist = (idx: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       marginalizedArtists: prev.marginalizedArtists.filter((_, i) => i !== idx),
//     }))
//   }

//   // Handle submit
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     // Submit logic here
//     alert('Request submitted!')
//   }

//   return (
//     <>
//       <Calendar />
//       <div className='p-4 h-full'>
//         <form className='space-y-4' onSubmit={handleSubmit}>
//           {/* Event Title */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//             <label className='block text-[#81520A] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//               Event Title
//             </label>
//             <input
//               type='text'
//               value={formData.eventTitle}
//               onChange={(e) => handleInputChange('eventTitle', e.target.value)}
//               className='w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-1 border-0 outline-0 md:rounded-l-none md:rounded-tr-lg'
//               required
//             />
//           </div>

//           {/* Event Link */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//             <label className='block text-[#81520A] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//               Event Link
//             </label>
//             <input
//               type='url'
//               value={formData.eventLink}
//               onChange={(e) => handleInputChange('eventLink', e.target.value)}
//               className='w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-1 border-0 outline-0 md:rounded-l-none md:rounded-tr-lg'
//             />
//           </div>

//           {/* Event Location */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//             <label className='block text-[#81520A] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//               Event Location
//             </label>
//             <input
//               type='text'
//               value={formData.eventLocation}
//               onChange={(e) =>
//                 handleInputChange('eventLocation', e.target.value)
//               }
//               className='w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-1 border-0 outline-0 md:rounded-l-none md:rounded-tr-lg'
//               required
//             />
//           </div>

//           {/* Event Description */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//             <label className='block text-[#81520A] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//               Event Description
//             </label>
//             <textarea
//               value={formData.eventDescription}
//               onChange={(e) =>
//                 handleInputChange('eventDescription', e.target.value)
//               }
//               rows={4}
//               className='w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-2 border-0 outline-0 resize-none md:rounded-l-none md:rounded-tr-lg'
//               required
//             />
//           </div>

//           {/* Is the event political? */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 p-4'>
//             <label className='block text-[#81520A] font-bold uppercase font-mono mb-2'>
//               Is the event political? Specify
//             </label>
//             <div className='flex flex-wrap gap-4 mb-2'>
//               {['feminist', 'queer', 'racial', 'disability'].map((key) => (
//                 <label key={key} className='flex items-center gap-1'>
//                   <input
//                     type='checkbox'
//                     checked={
//                       formData.isPolitical[
//                         key as keyof typeof formData.isPolitical
//                       ]
//                     }
//                     onChange={(e) =>
//                       handlePoliticalChange(key, e.target.checked)
//                     }
//                     className='accent-[#81520A]'
//                   />
//                   <span className='font-mono'>
//                     {key.charAt(0).toUpperCase() + key.slice(1)}
//                   </span>
//                 </label>
//               ))}
//             </div>
//             <div className='flex flex-col gap-2'>
//               <label className='flex items-center gap-2'>
//                 <span className='font-mono'>Fundraiser (specify):</span>
//                 <input
//                   type='text'
//                   value={formData.isPolitical.fundraiser}
//                   onChange={(e) =>
//                     handlePoliticalChange('fundraiser', e.target.value)
//                   }
//                   className='rounded px-2 py-1 text-[#07f25b] border-0 outline-0'
//                 />
//               </label>
//               <label className='flex items-center gap-2'>
//                 <span className='font-mono'>Other (specify):</span>
//                 <input
//                   type='text'
//                   value={formData.isPolitical.other}
//                   onChange={(e) =>
//                     handlePoliticalChange('other', e.target.value)
//                   }
//                   className='rounded px-2 py-1 text-[#07f25b] border-0 outline-0'
//                 />
//               </label>
//             </div>
//           </div>

//           {/* Marginalized Artists */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 p-4'>
//             <label className='block text-[#81520A] font-bold uppercase font-mono mb-2'>
//               Does your programme feature marginalized artists? Specify below
//               <span className='block text-xs font-normal'>
//                 *marginalised gender expressions and identities
//               </span>
//             </label>
//             {formData.marginalizedArtists.map((artist, idx) => (
//               <div key={idx} className='flex gap-2 mb-2'>
//                 <input
//                   type='text'
//                   placeholder='Name'
//                   value={artist.name}
//                   onChange={(e) =>
//                     handleArtistChange(idx, 'name', e.target.value)
//                   }
//                   className='rounded px-2 py-1 text-[#07f25b] border-0 outline-0 flex-1'
//                 />
//                 <input
//                   type='url'
//                   placeholder='Link'
//                   value={artist.link}
//                   onChange={(e) =>
//                     handleArtistChange(idx, 'link', e.target.value)
//                   }
//                   className='rounded px-2 py-1 text-[#07f25b] border-0 outline-0 flex-1'
//                 />
//                 {formData.marginalizedArtists.length > 1 && (
//                   <button
//                     type='button'
//                     onClick={() => removeArtist(idx)}
//                     className='text-xs text-red-600 font-bold'
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               type='button'
//               onClick={addArtist}
//               className='text-[#81520A] font-bold underline text-sm'
//             >
//               + Add another artist
//             </button>
//           </div>

//           {/* Wage Policy */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//             <label className='block text-[#81520A] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//               Have you thought of and applied a wage policy which is fair
//               between all participants? Please detail with transparency:
//             </label>
//             <textarea
//               value={formData.wagePolicy}
//               onChange={(e) => handleInputChange('wagePolicy', e.target.value)}
//               rows={3}
//               className='w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-2 border-0 outline-0 resize-none md:rounded-l-none md:rounded-tr-lg'
//               required
//             />
//           </div>

//           {/* Event Date */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//             <label className='block text-[#81520A] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//               Event Date
//             </label>
//             <input
//               type='date'
//               value={formData.eventDate}
//               onChange={(e) => handleInputChange('eventDate', e.target.value)}
//               className='w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-1 border-0 outline-0 md:rounded-l-none md:rounded-tr-lg'
//               required
//             />
//           </div>

//           {/* Pick-up Date */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//             <label className='block text-[#81520A] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//               Pick-up Date (max 2 days before, weekdays)
//             </label>
//             <input
//               type='date'
//               value={formData.pickupDate}
//               onChange={(e) => handleInputChange('pickupDate', e.target.value)}
//               className='w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-1 border-0 outline-0 md:rounded-l-none md:rounded-tr-lg'
//               required
//             />
//           </div>

//           {/* Return Date */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 md:flex md:items-center md:justify-center'>
//             <label className='block text-[#81520A] font-medium text-center uppercase font-mono p-0 md:w-[30%]'>
//               Return Date (max 2 days after, weekdays)
//             </label>
//             <input
//               type='date'
//               value={formData.returnDate}
//               onChange={(e) => handleInputChange('returnDate', e.target.value)}
//               className='w-full rounded-t-none rounded-b-lg text-[#07f25b] px-4 py-1 border-0 outline-0 md:rounded-l-none md:rounded-tr-lg'
//               required
//             />
//           </div>

//           {/* Certifications */}
//           <div className='w-full bg-[#07f25b] text-[#81520A] rounded-lg mb-6 p-4'>
//             <label className='block text-[#81520A] font-bold uppercase font-mono mb-2'>
//               Certifications
//             </label>
//             <div className='flex flex-col gap-2'>
//               <label className='flex items-center gap-2'>
//                 <input
//                   type='checkbox'
//                   checked={formData.vehicleCert}
//                   onChange={(e) =>
//                     handleInputChange('vehicleCert', e.target.checked)
//                   }
//                   className='accent-[#81520A]'
//                   required
//                 />
//                 <span className='font-mono'>
//                   I certify that I have a vehicle to transport the sound safely
//                   (minimum 8 m³).
//                 </span>
//               </label>
//               <label className='flex items-center gap-2'>
//                 <input
//                   type='checkbox'
//                   checked={formData.teamCert}
//                   onChange={(e) =>
//                     handleInputChange('teamCert', e.target.checked)
//                   }
//                   className='accent-[#81520A]'
//                   required
//                 />
//                 <span className='font-mono'>
//                   I certify that at least 3 people will manage pick-up,
//                   build-up, build-down and return of the system (it’s heavy and
//                   fragile).
//                 </span>
//               </label>
//               <label className='flex items-center gap-2'>
//                 <input
//                   type='checkbox'
//                   checked={formData.charterCert}
//                   onChange={(e) =>
//                     handleInputChange('charterCert', e.target.checked)
//                   }
//                   className='accent-[#81520A]'
//                   required
//                 />
//                 <span className='font-mono'>
//                   I certify that all persons involved in handling the sound have
//                   read and signed the charter of principles and are aware of the
//                   moral, technical and financial requirements of the loan.
//                 </span>
//               </label>
//               <label className='flex items-center gap-2'>
//                 <input
//                   type='checkbox'
//                   checked={formData.membershipCert}
//                   onChange={(e) =>
//                     handleInputChange('membershipCert', e.target.checked)
//                   }
//                   className='accent-[#81520A]'
//                   required
//                 />
//                 <span className='font-mono'>
//                   If you don’t have a membership yet: You understand the
//                   community-based financial aspect of the project and wish to
//                   make an annual contribution adapted to your means (between 75
//                   and 150 euros).
//                 </span>
//               </label>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type='submit'
//             className='mt-16 bg-[#07f25b] text-[#81520A] text-5xl tracking-tighter font-medium hover:opacity-90 transition-opacity w-64 h-64 rounded-full text-center mx-auto block'
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//     </>
//   )
// }

import Calendar from '@/components/calendar'
import { eachDayOfInterval, parseISO, format } from 'date-fns'

import RequestRegistrationForm from '@/components/pssound-system/PssoundRequestForm'
import { sanityFetch } from '@/sanity/lib/live'
import {
  allApprovedCollectivesQuery,
  allBlockedDatesQuery,
} from '@/sanity/lib/queries'

export default async function SoundSystemRequestPage() {
  const { data } = await sanityFetch({ query: allBlockedDatesQuery })
  const blockedDates: string[] = data.flatMap(
    (item: { startDate: string; endDate: string }) => {
      if (!item.startDate || !item.endDate) return []
      return eachDayOfInterval({
        start: parseISO(item.startDate),
        end: parseISO(item.endDate),
      }).map((date) => format(date, 'yyyy-MM-dd'))
    }
  )

  const { data: collectives } = await sanityFetch({
    query: allApprovedCollectivesQuery,
  })

  return (
    <>
      <Calendar bookedDates={blockedDates} />
      <div className='p-4 h-full'>
        <RequestRegistrationForm
          bookedDates={blockedDates}
          collectives={collectives}
        />
      </div>
    </>
  )
}
