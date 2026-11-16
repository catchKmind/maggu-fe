import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  isSelected?: boolean
  onClick?: () => void
}

export function Tag({ children, isSelected = false, onClick }: TagProps) {
  const className =
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-2 typo-body-m transition-colors'

  if (!onClick) {
    return <div className={`${className} bg-gray-50 text-gray-700`}>{children}</div>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`${className} ${isSelected ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-700'}`}
    >
      {children}
    </button>
  )
}
