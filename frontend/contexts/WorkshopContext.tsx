'use client'

import {createContext, useContext, useState} from 'react'

const WorkshopsContext = createContext({
  hasActiveWorkshops: false,
  setHasActiveWorkshops: (value: boolean) => {},
})

export function WorkshopsProvider({
  children,
  initialValue = false,
}: {
  children: React.ReactNode
  initialValue?: boolean
}) {
  const [hasActiveWorkshops, setHasActiveWorkshops] = useState(initialValue)

  return (
    <WorkshopsContext.Provider value={{hasActiveWorkshops, setHasActiveWorkshops}}>
      {children}
    </WorkshopsContext.Provider>
  )
}

export const useWorkshops = () => useContext(WorkshopsContext)
