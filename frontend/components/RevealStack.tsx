'use client'

import {Children, cloneElement, isValidElement} from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  staggerMs?: number
}

export default function RevealStack({children, className = '', staggerMs = 90}: Props) {
  const childrenArray = Children.toArray(children)

  return (
    <div className={className}>
      {childrenArray.map((child, index) => {
        if (isValidElement(child) && child.type && (child.type as any).name === 'Reveal') {
          // If it's already a Reveal component, clone it with added delay
          return cloneElement(child as React.ReactElement<any>, {
            key: index,
            delayMs: (child.props.delayMs || 0) + index * staggerMs,
          })
        }
        return child
      })}
    </div>
  )
}
