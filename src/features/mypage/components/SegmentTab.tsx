interface SegmentTabProps {
  label: string
  count?: number
  isActive: boolean
  onClick: () => void
}

/** 마이페이지 탭 (Figma: mypage/activity tabs - segment) - 내 활동 글/댓글, 아이콘 선택 기본/내 스티커 */
export function SegmentTab({ label, count, isActive, onClick }: SegmentTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 flex-1 items-center justify-center gap-1 ${
        isActive ? 'border-b-[1.5px] border-gray-800 font-medium text-gray-800' : 'text-gray-500'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && <span className={isActive ? 'text-purple-500' : undefined}>{count}</span>}
    </button>
  )
}

export function SegmentTabs({ children }: { children: React.ReactNode }) {
  return <div className="flex px-4 py-2 text-14 leading-[20px] tracking-[-0.28px]">{children}</div>
}
