const SMALL_SIZE = 64
const MEDIUM_SIZE = 96
const LARGE_SIZE = 128

function getMarkerSize(photoCount: number) {
  if (photoCount >= 5) return LARGE_SIZE
  if (photoCount >= 2) return MEDIUM_SIZE
  return SMALL_SIZE
}

interface PhotoMarkerProps {
  photos: string[]
  onClick?: () => void
}

export function PhotoMarker({ photos, onClick }: PhotoMarkerProps) {
  const size = getMarkerSize(photos.length)

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: size, height: size }}
      className="overflow-hidden rounded-xl border-[3px] border-purple-400 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
    >
      <img src={photos[0]} alt="" className="h-full w-full object-cover" />
    </button>
  )
}
