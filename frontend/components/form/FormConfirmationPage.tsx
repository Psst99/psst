import type {ReactNode} from 'react'

interface FormConfirmationPageProps {
  title: string
  children: ReactNode
}

export function FormConfirmationPage({title, children}: FormConfirmationPageProps) {
  return (
    <div className="px-6 py-16 min-[69.375rem]:px-20 min-[69.375rem]:max-w-5xl min-[69.375rem]:mx-auto">
      <div
        className="relative p-6 min-[69.375rem]:p-8 rounded-3xl min-[69.375rem]:text-xl"
        style={{
          backgroundColor: 'var(--panel-fg)',
          color: 'var(--panel-bg)',
        }}
      >
        <h1 className="text-3xl min-[69.375rem]:text-3xl mb-6 text-center tracking-tight break-after-avoid break-inside-avoid">
          {title}
        </h1>

        <p className="last:mb-0 text-base min-[69.375rem]:text-2xl leading-snug">{children}</p>
      </div>
    </div>
  )
}
