import type { ReactNode } from 'react'

export default function WorkshopsLayout({
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
