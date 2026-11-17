const MAX_VISIBLE = 3

interface PostPhotoGridProps {
  photos: string[]
  /** 사진을 눌렀을 때(몇 번째인지 전달). 없으면 눌러도 아무 일도 없다 — 호출하는 쪽이 감싸서 쓴다 */
  onPhotoClick?: (index: number) => void
}

interface PhotoProps {
  src: string
  index: number
  className: string
  onPhotoClick?: (index: number) => void
}

function Photo({ src, index, className, onPhotoClick }: PhotoProps) {
  const image = <img src={src} alt="" className={className} />
  if (!onPhotoClick) return image

  return (
    <button type="button" onClick={() => onPhotoClick(index)} className="block size-full">
      {image}
    </button>
  )
}

/**
 * 게시글 사진 그리드 컴포넌트. 1장: 전체 채움 / 2장: 좌우 반반 / 3장 이상: 왼쪽 1장(세로 꽉) + 오른쪽 2장(위아래) — 모두 높이 162 (Figma: image format),
 * 4장 이상이면 마지막 칸에 "+N" 오버레이.
 */
export function PostPhotoGrid({ photos, onPhotoClick }: PostPhotoGridProps) {
  if (photos.length === 0) return null

  if (photos.length === 1) {
    return (
      <div className="h-[162px] overflow-hidden rounded-lg">
        <Photo src={photos[0]} index={0} onPhotoClick={onPhotoClick} className="h-[162px] w-full object-cover" />
      </div>
    )
  }

  if (photos.length === 2) {
    return (
      <div className="grid h-[162px] grid-cols-2 gap-[1.5px] overflow-hidden rounded-lg">
        {photos.map((photo, index) => (
          <Photo key={photo} src={photo} index={index} onPhotoClick={onPhotoClick} className="size-full object-cover" />
        ))}
      </div>
    )
  }

  const visible = photos.slice(0, MAX_VISIBLE)
  const remaining = photos.length - MAX_VISIBLE

  return (
    <div className="grid h-[162px] grid-cols-2 grid-rows-2 gap-[1.5px] overflow-hidden rounded-lg">
      <div className="row-span-2 size-full">
        <Photo src={visible[0]} index={0} onPhotoClick={onPhotoClick} className="size-full object-cover" />
      </div>
      <div className="size-full">
        <Photo src={visible[1]} index={1} onPhotoClick={onPhotoClick} className="size-full object-cover" />
      </div>
      <div className="relative size-full">
        <Photo src={visible[2]} index={2} onPhotoClick={onPhotoClick} className="size-full object-cover" />
        {remaining > 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-16 font-semibold text-white">
            +{remaining}
          </div>
        )}
      </div>
    </div>
  )
}
