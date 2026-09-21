import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  isSelected?: boolean
  onClick?: () => void
}

export function Tag({ children, isSelected = false, onClick }: TagProps) {
  const className =
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-[20px] px-5 py-2 text-14 font-regular leading-[20px] tracking-[-0.28px] transition-colors'

  if (!onClick) {
    return <div className={`${className} bg-white text-[#404040]`}>{children}</div>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`${className} ${isSelected ? 'bg-gray-900 text-white' : 'bg-white text-[#404040]'}`}
    >
      {children}
    </button>
  )
}
