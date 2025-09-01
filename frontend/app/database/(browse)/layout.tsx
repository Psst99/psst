import type { ReactNode } from 'react'

export default function DatabaseBrowseLayout({
  children,
  modal, // name must match the folder @modals
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
