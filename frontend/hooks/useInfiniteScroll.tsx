import { useCallback, useEffect, useRef, useState } from 'react'

type UseInfiniteScrollOptions = {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export function useInfiniteScroll(
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 0.1, rootMargin = '100px', enabled = true } = options
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<HTMLDivElement | null>(null)

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      if (!node || !enabled) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry.isIntersecting) {
            callback()
          }
        },
        { threshold, rootMargin }
      )

      elementRef.current = node
      observerRef.current.observe(node)
    },
    [callback, threshold, rootMargin, enabled]
  )

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return setRef
}
