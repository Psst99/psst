'use client'

import {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {IoMdClose} from 'react-icons/io'
import {useRouter} from 'next/navigation'

export default function WorkshopModalSkeleton() {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setIsVisible(true), 10)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.back()
    }, 300)
  }

  if (!mounted) return null

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-[#f50806]/50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal body */}
      <div
        className={`relative bg-white w-full max-w-3xl rounded-3xl p-8 sm:p-8 transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-[100vh]'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-[#f50806] hover:opacity-70 transition-opacity z-10"
          aria-label="Close"
        >
          <IoMdClose className="w-8 h-8" />
        </button>

        {/* Skeleton content */}
        <div className="animate-pulse">
          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

          {/* Dates skeleton */}
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-2 mb-6">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Image skeleton */}
          <div className="w-full h-64 bg-gray-200 rounded-lg mb-6"></div>

          {/* Description skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
