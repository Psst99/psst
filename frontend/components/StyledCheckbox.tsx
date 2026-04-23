import React from 'react'

interface StyledCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const StyledCheckbox: React.FC<StyledCheckboxProps> = ({label, ...props}) => (
  <label className="group relative flex cursor-pointer items-center gap-3 section-fg">
    <input
      type="checkbox"
      {...props}
      className="peer h-5 w-5 shrink-0 appearance-none border border-current bg-white transition-colors checked:bg-current focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
    />
    <svg
      className="pointer-events-none absolute left-0 top-1/2 hidden h-5 w-5 -translate-y-1/2 peer-checked:block"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span className="text-lg leading-tight md:text-xl">
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  </label>
)
