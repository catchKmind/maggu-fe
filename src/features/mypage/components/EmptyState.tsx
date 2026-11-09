interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  /** 화면마다 위 여백이 다르다 (내 활동 160 / 스티커·리스트 200) */
  topPadding?: 160 | 200
  /** 아이콘 타일 배경 (리스트 빈 상태만 gray-100) */
  tileClassName?: string
}

/** 마이페이지 빈 상태 (Figma: empty state) - 아이콘 타일 + 안내 문구 + 선택적 버튼 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  topPadding = 160,
  tileClassName = 'bg-gray-50',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${topPadding === 200 ? 'pt-[200px]' : 'pt-40'}`}>
      <div className={`rounded-2xl p-[14px] ${tileClassName}`}>
        <img src={icon} alt="" className="size-7" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-16 leading-[24px] font-medium tracking-[-0.32px] text-gray-800">{title}</p>
        <p className="text-14 leading-[20px] tracking-[-0.28px] text-gray-500">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-3xl bg-purple-500 px-5 py-[10px] text-14 leading-[20px] font-medium tracking-[-0.28px] text-white"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
