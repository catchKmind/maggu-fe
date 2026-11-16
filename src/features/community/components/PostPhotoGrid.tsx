const MAX_VISIBLE = 3

interface PostPhotoGridProps {
  photos: string[]
}

/**
 * 게시글 사진 그리드 컴포넌트. 1장: 전체 채움 / 2장: 좌우 반반 / 3장 이상: 왼쪽 1장(세로 꽉) + 오른쪽 2장(위아래) — 모두 높이 162 (Figma: image format),
 * 4장 이상이면 마지막 칸에 "+N" 오버레이.
 */
export function PostPhotoGrid({ photos }: PostPhotoGridProps) {
  if (photos.length === 0) return null

  if (photos.length === 1) {
    return (
      <div className="overflow-hidden rounded-lg">
        <img src={photos[0]} alt="" className="h-[162px] w-full object-cover" />
      </div>
    )
  }

  if (photos.length === 2) {
    return (
      <div className="grid h-[162px] grid-cols-2 gap-[1.5px] overflow-hidden rounded-lg">
        {photos.map((photo) => (
          <img key={photo} src={photo} alt="" className="size-full object-cover" />
        ))}
      </div>
    )
  }

  const visible = photos.slice(0, MAX_VISIBLE)
  const remaining = photos.length - MAX_VISIBLE

  return (
    <div className="grid h-[162px] grid-cols-2 grid-rows-2 gap-[1.5px] overflow-hidden rounded-lg">
      <img src={visible[0]} alt="" className="row-span-2 size-full object-cover" />
      <img src={visible[1]} alt="" className="size-full object-cover" />
      <div className="relative size-full">
        <img src={visible[2]} alt="" className="size-full object-cover" />
        {remaining > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-16 font-semibold text-white">
            +{remaining}
          </div>
        )}
      </div>
    </div>
  )
}
