'use client'

import { useRouter } from 'next/navigation'

export default function TestModal({ artist }: { artist: any }) {
  const router = useRouter()

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white p-8 rounded-lg max-w-md w-full'>
        <h2 className='text-xl font-bold mb-4'>
          Test Modal: {artist.artistName}
        </h2>
        <p>This is a test modal with no animations</p>
        <button
          className='mt-4 bg-blue-500 text-white px-4 py-2 rounded'
          onClick={() => router.back()}
        >
          Close Modal
        </button>
      </div>
    </div>
  )
}
