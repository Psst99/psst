'use client'

import {ThemeContext} from '@/app/ThemeProvider'
import {useContext} from 'react'
import {MdInvertColors} from 'react-icons/md'

export default function ThemeToggleButton() {
  const ctx = useContext(ThemeContext)
  if (!ctx) return null

  const isAccessible = ctx.mode === 'accessible'

  return (
    <button
      onClick={ctx.toggle}
      aria-pressed={isAccessible}
      // title={isAccessible ? 'Switch to brand colors' : 'Switch to accessible (high contrast) mode'}
      aria-label="Toggle accessible theme"
      className="
        theme-toggle-fixed
        fixed top-0 right-0 z-[9999]
        w-8 h-8
        flex items-center justify-center
        transition-all
        cursor-pointer
      
      "
    >
      <MdInvertColors className={`h-5 w-5 ${isAccessible ? 'text-black' : 'text-[#1D53FF]'}`} />
    </button>
  )
}
