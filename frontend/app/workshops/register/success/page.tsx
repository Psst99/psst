// app/workshops/register/success/page.tsx
import Link from 'next/link'

export default function WorkshopSuccessPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full text-center'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>

          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Workshop Registration Successful!
          </h1>
          <p className='text-gray-600 mb-6'>
            Thank you for registering for the workshop. Your application is
            being reviewed and you'll hear back from us soon.
          </p>

          <div className='space-y-3'>
            <Link
              href='/workshops'
              className='block w-full bg-[#F50806] text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity'
            >
              View All Workshops
            </Link>
            <Link
              href='/'
              className='block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors'
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
