import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
}

export function Tag({ children }: TagProps) {
  return (
    <div className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[20px] bg-white px-5 py-2 text-14 font-regular leading-[20px] tracking-[-0.28px] text-[#404040]">
      {children}
    </div>
  )
}
