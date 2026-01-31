'use client'

import {ThemeContext} from '@/app/ThemeProvider'
import React, {useContext} from 'react'
import {MdRoundedCorner} from 'react-icons/md'
import {TbRectangle} from 'react-icons/tb'
import {MdOutlineSquare} from 'react-icons/md'

export default function RoundedToggleButton() {
  const ctx = useContext(ThemeContext)
  if (!ctx) return null

  const isRounded = ctx.rounded

  return (
    <button
      onClick={ctx.toggleRounded}
      aria-label="Toggle rounded corners"
      className="
        rounded-toggle-fixed
        fixed top-0 right-8 z-[9999]
        w-5 h-8
        flex items-center justify-center
        transition-all
        cursor-pointer
      "
    >
      {isRounded ? (
        <MdRoundedCorner className="text-[#1D53FF] w-5 h-5" />
      ) : (
        <MdOutlineSquare className="w-5 h-5 text-[#1D53FF]" />
      )}
    </button>
  )
}
