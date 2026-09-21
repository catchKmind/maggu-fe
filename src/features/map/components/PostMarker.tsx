const SMALL_SIZE = 48
const MEDIUM_SIZE = 64
const LARGE_SIZE = 84

/** 같은 장소에 글이 많을수록 사진을 크게 보여준다 */
function getMarkerSize(postCount: number) {
  if (postCount >= 5) return LARGE_SIZE
  if (postCount >= 2) return MEDIUM_SIZE
  return SMALL_SIZE
}

interface PostMarkerProps {
  imageUrl: string
  postCount?: number
  onClick?: () => void
}

export function PostMarker({ imageUrl, postCount = 1, onClick }: PostMarkerProps) {
  const size = getMarkerSize(postCount)

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: size, height: size }}
      className="overflow-hidden rounded-lg border-2 border-purple-400 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
    >
      <img src={imageUrl} alt="" className="h-full w-full object-cover" />
    </button>
  )
}
