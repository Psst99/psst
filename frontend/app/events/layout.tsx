import type { ReactNode } from 'react'

export default function EventsLayout({
  children,
  modal, // name must match the folder @modal
}: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}
