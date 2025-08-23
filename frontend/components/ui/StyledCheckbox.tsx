import React from 'react'

interface StyledCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const StyledCheckbox: React.FC<StyledCheckboxProps> = ({
  label,
  ...props
}) => (
  <label className='flex items-center gap-1 text-[#81520a] relative cursor-pointer'>
    <input
      type='checkbox'
      {...props}
      className='peer appearance-none w-4 h-4 border-0 rounded bg-white checked:bg-[#81520a] checked:border-0 focus:outline-none'
    />
    <svg
      className='absolute w-4 h-4 hidden peer-checked:block pointer-events-none'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='white'
      strokeWidth='4'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='20 6 9 17 4 12'></polyline>
    </svg>
    <span className='pl-1'>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  </label>
)
