// app/workshops/register/success/page.tsx
import Link from 'next/link'

export default function WorkshopSuccessPage() {
  return (
    <div className="flex items-center h-full justify-center">
      <div className="max-w-md w-full text-center">
        {/* <div className="bg-[#F50806] rounded-lg shadow-lg p-8"> */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#F50806]">
          <svg
            className="w-12 h-12 text-[#D2D2D2]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#F50806] mb-2">
          Workshop registration successful.
        </h1>
        <p className="text-[#F50806] mb-6">
          {`Thank you for registering for the workshop. Your application is
            being reviewed and you'll hear back from us soon.`}
        </p>

        <div className="space-y-3">
          <Link
            href="/workshops"
            className="block w-full bg-[#F50806] text-[#D2D2D2] py-2 px-4 rounded-lg"
          >
            View All Workshops
          </Link>
        </div>
        {/* </div> */}
      </div>
    </div>
  )
}
