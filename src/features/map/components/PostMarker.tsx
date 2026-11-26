const SMALL_SIZE = 48
const MEDIUM_SIZE = 64
const LARGE_SIZE = 84

/** 같은 장소(또는 묶음 안)의 글이 많을수록 사진을 크게 보여준다 */
function getMarkerSize(postCount: number) {
  if (postCount >= 5) return LARGE_SIZE
  if (postCount >= 2) return MEDIUM_SIZE
  return SMALL_SIZE
}

interface PostMarkerProps {
  imageUrl: string
  postCount?: number
  /** 묶음일 때 모서리에 보여줄 게시글 수. 낱장 장소는 비운다 */
  badgeCount?: number
  onClick?: () => void
}

export function PostMarker({ imageUrl, postCount = 1, badgeCount, onClick }: PostMarkerProps) {
  const size = getMarkerSize(postCount)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <button
        type="button"
        onClick={onClick}
        className="size-full overflow-hidden rounded-lg border-2 border-purple-400 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
      >
        <img src={imageUrl} alt="" decoding="async" className="h-full w-full object-cover" />
      </button>
      {badgeCount !== undefined && (
        <span className="pointer-events-none absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-500 px-1.5 typo-body-xs font-medium text-white shadow-[0_1px_4px_rgba(0,0,0,0.25)]">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </div>
  )
}
