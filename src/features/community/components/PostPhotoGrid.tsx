const MAX_VISIBLE = 3

interface PostPhotoGridProps {
  photos: string[]
}

/**
 * 게시글 사진 그리드. 1장: 전체 채움 / 2장: 좌우 반반 / 3장 이상: 상단 2장 + 하단 1장(가로로 넓게),
 * 4장 이상이면 마지막 칸에 "+N" 오버레이.
 */
export function PostPhotoGrid({ photos }: PostPhotoGridProps) {
  if (photos.length === 0) return null

  if (photos.length === 1) {
    return (
      <div className="overflow-hidden rounded-2xl">
        <img src={photos[0]} alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
    )
  }

  if (photos.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-2xl">
        {photos.map((photo) => (
          <img key={photo} src={photo} alt="" className="aspect-square w-full object-cover" />
        ))}
      </div>
    )
  }

  const visible = photos.slice(0, MAX_VISIBLE)
  const remaining = photos.length - MAX_VISIBLE

  return (
    <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-2xl">
      {visible.slice(0, 2).map((photo) => (
        <img key={photo} src={photo} alt="" className="aspect-square w-full object-cover" />
      ))}
      <div className="relative col-span-2">
        <img src={visible[2]} alt="" className="aspect-[2/1] w-full object-cover" />
        {remaining > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-16 font-semibold text-white">
            +{remaining}
          </div>
        )}
      </div>
    </div>
  )
}
