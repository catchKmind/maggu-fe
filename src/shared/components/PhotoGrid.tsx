const MAX_VISIBLE = 4

interface PhotoGridProps {
  photos: string[]
  className?: string
}

/**
 * 사진 개수(1~4장)에 따라 레이아웃이 달라지는 그리드.
 * 1장: 전체 채움 / 2장: 좌우 반반 / 3장: 좌측 1장 + 우측 2단 / 4장: 2x2.
 * 5장 이상이면 마지막 칸에 "+N" 오버레이를 보여줌.
 */
export function PhotoGrid({ photos, className = '' }: PhotoGridProps) {
  const visible = photos.slice(0, MAX_VISIBLE)
  const remaining = photos.length - MAX_VISIBLE

  const layoutClassName = visible.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'
  const rowsClassName = visible.length >= 3 ? 'grid-rows-2' : ''

  return (
    <div className={`grid gap-1 overflow-hidden rounded-2xl ${layoutClassName} ${rowsClassName} ${className}`}>
      {visible.map((photo, index) => {
        const isLast = index === visible.length - 1
        const spansFullHeight = visible.length === 3 && index === 0

        return (
          <div key={photo} className={`relative ${spansFullHeight ? 'row-span-2' : ''}`}>
            <img src={photo} alt="" className="h-full w-full object-cover" />
            {isLast && remaining > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-16 font-semibold text-white">
                +{remaining}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
