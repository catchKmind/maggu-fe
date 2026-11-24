import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PhotoViewerProps {
  photos: string[]
  /** 처음에 보여줄 사진 번호 */
  startIndex: number
  onClose: () => void
}

/**
 * 사진 크게 보기. 화면 전체를 검게 덮고 사진을 가득 채워 보여준다.
 * 사진이 여러 장이면 좌우로 넘겨 볼 수 있고, 닫기 버튼·빈 곳·Esc로 닫는다.
 */
export function PhotoViewer({ photos, startIndex, onClose }: PhotoViewerProps) {
  const { t } = useTranslation()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(startIndex)

  // 누른 사진이 맨 처음에 보이도록 위치를 맞춘다
  useEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) scroller.scrollLeft = startIndex * scroller.clientWidth
  }, [startIndex])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    // 뒤의 화면이 같이 스크롤되지 않게 한다
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[60] bg-black">
      <div
        ref={scrollerRef}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex size-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo) => (
          <div key={photo} onClick={onClose} className="flex size-full shrink-0 snap-center items-center justify-center">
            <img
              src={photo}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-[calc(var(--safe-top,0px)+12px)]">
        <span className="pointer-events-auto rounded-full bg-black/40 px-3 py-1 typo-body-s text-white">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('bottomSheet.close')}
          className="pointer-events-auto flex size-9 items-center justify-center rounded-full bg-black/40"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 4l10 10M14 4 4 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
