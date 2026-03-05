// app/workshops/register/success/page.tsx
import Link from 'next/link'

export default function WorkshopSuccessPage() {
  return (
    <div className="flex items-center h-full justify-center">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 section-fg">
          <svg
            className="w-12 h-12 text-[color:var(--section-bg)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold section-fg mb-2">
          Workshop registration successful.
        </h1>
        <p className="section-fg mb-6">
          {`Thank you for registering for the workshop. Your application is
            being reviewed and you'll hear back from us soon.`}
        </p>

        <div className="space-y-3">
          <Link
            href="/workshops"
            className="block w-full section-fg text-[color:var(--section-bg)] py-2 px-4 rounded-lg"
          >
            View All Workshops
          </Link>
        </div>
      </div>
    </div>
  )
}
