import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import chevronLeftMicroIcon from '../../../assets/mypage/icon_chevron_left_micro.svg'
import cropMask from '../../../assets/mypage/crop_mask.svg'
import cropGuide from '../../../assets/mypage/crop_guide.svg'
import cropCorner from '../../../assets/mypage/crop_corner.svg'

// Figma 기준 자르기 영역 (343×374 프레임 안의 지름 319 원, 왼쪽 12 / 위 27.5)
const FRAME_WIDTH = 343
const FRAME_HEIGHT = 374
const CIRCLE_LEFT = 12
const CIRCLE_TOP = 27.5
const CIRCLE_SIZE = 319
const OUTPUT_SIZE = 512
const MAX_SCALE = 4

interface Transform {
  scale: number
  x: number
  y: number
}

interface ProfilePhotoCropScreenProps {
  source: string
  onCancel: () => void
  onConfirm: (photo: Blob) => void
}

/** 프로필 사진 원형 자르기 (Figma: 마이페이지- 프로필 사진 변경 - 자르기). 드래그로 이동, 두 손가락으로 확대한다. */
export function ProfilePhotoCropScreen({ source, onCancel, onConfirm }: ProfilePhotoCropScreenProps) {
  const { t } = useTranslation()
  const frameRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const [transform, setTransform] = useState<Transform>({ scale: 1, x: 0, y: 0 })
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null)

  /** 프레임 크기와 이미지 원본 크기로, 확대 1배일 때 프레임을 꽉 채우는(cover) 배율을 구한다. */
  const getLayout = () => {
    const frame = frameRef.current
    if (!frame || !naturalSize) return null
    const width = frame.clientWidth
    const height = frame.clientHeight
    const ratio = width / FRAME_WIDTH
    const coverScale = Math.max(width / naturalSize.width, height / naturalSize.height)
    const circle = { left: CIRCLE_LEFT * ratio, top: CIRCLE_TOP * ratio, size: CIRCLE_SIZE * ratio }
    return { width, height, coverScale, circle }
  }

  /** 원 바깥으로 빈 공간이 보이지 않도록 이동 범위를 제한한다. */
  const clamp = (next: Transform): Transform => {
    const layout = getLayout()
    if (!layout || !naturalSize) return next
    const scale = Math.min(Math.max(next.scale, 1), MAX_SCALE)
    const displayWidth = naturalSize.width * layout.coverScale * scale
    const displayHeight = naturalSize.height * layout.coverScale * scale
    const { circle } = layout
    // 이미지 왼쪽 위 = 프레임 중앙 + 이동량 - 표시 크기/2
    const minX = circle.left + circle.size - layout.width / 2 - displayWidth / 2
    const maxX = circle.left - layout.width / 2 + displayWidth / 2
    const minY = circle.top + circle.size - layout.height / 2 - displayHeight / 2
    const maxY = circle.top - layout.height / 2 + displayHeight / 2
    return {
      scale,
      x: Math.min(Math.max(next.x, minX), maxX),
      y: Math.min(Math.max(next.y, minY), maxY),
    }
  }

  useEffect(() => {
    // 이미지를 처음 불러오면 원 영역이 가운데 오도록 맞춘다.
    if (naturalSize) setTransform((prev) => clamp(prev))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [naturalSize])

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const pointers = pointersRef.current
    const prev = pointers.get(e.pointerId)
    if (!prev) return

    if (pointers.size === 1) {
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      setTransform((current) => clamp({ ...current, x: current.x + dx, y: current.y + dy }))
    } else if (pointers.size === 2) {
      const other = [...pointers.entries()].find(([id]) => id !== e.pointerId)?.[1]
      if (other) {
        const before = Math.hypot(prev.x - other.x, prev.y - other.y)
        const after = Math.hypot(e.clientX - other.x, e.clientY - other.y)
        if (before > 0) setTransform((current) => clamp({ ...current, scale: current.scale * (after / before) }))
      }
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId)
  }

  const handleConfirm = () => {
    const layout = getLayout()
    const image = imageRef.current
    if (!layout || !image || !naturalSize) return

    const totalScale = layout.coverScale * transform.scale
    const imageLeft = layout.width / 2 + transform.x - (naturalSize.width * totalScale) / 2
    const imageTop = layout.height / 2 + transform.y - (naturalSize.height * totalScale) / 2

    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT_SIZE
    canvas.height = OUTPUT_SIZE
    const context = canvas.getContext('2d')
    if (!context) return
    context.drawImage(
      image,
      (layout.circle.left - imageLeft) / totalScale,
      (layout.circle.top - imageTop) / totalScale,
      layout.circle.size / totalScale,
      layout.circle.size / totalScale,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE,
    )
    canvas.toBlob((blob) => blob && onConfirm(blob), 'image/jpeg', 0.9)
  }

  const layout = getLayout()

  return (
    <div className="fixed inset-0 z-[60] mx-auto flex max-w-[430px] flex-col bg-gray-900">
      <div className="bg-gray-800 pt-[var(--safe-top)] pb-2">
        <div className="flex items-center justify-between px-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            aria-label={t('stickerCreate.back')}
            className="flex size-9 items-center justify-center rounded-lg bg-white/90 backdrop-blur-[10px]"
          >
            <img src={chevronLeftMicroIcon} alt="" className="size-4" />
          </button>
          <span className="text-14 leading-[15px] font-bold text-white">{t('myPage.profilePhoto')}</span>
          <span className="size-9" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-[54px] px-4">
        <div className="relative w-full">
          <div
            ref={frameRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative w-full touch-none overflow-hidden rounded-3xl select-none"
            style={{ aspectRatio: `${FRAME_WIDTH} / ${FRAME_HEIGHT}` }}
          >
            <img
              ref={imageRef}
              src={source}
              alt=""
              draggable={false}
              onLoad={(e) => setNaturalSize({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })}
              className="absolute top-1/2 left-1/2 max-w-none"
              style={{
                // 확대 1배일 때 프레임을 꽉 채우는 크기로 그리고, 그 위에 이동·확대를 적용한다.
                // (object-cover로 그리면 프레임 밖 부분이 img 박스에서 잘려 이동해도 보이지 않는다)
                width: layout ? naturalSize!.width * layout.coverScale : '100%',
                height: layout ? naturalSize!.height * layout.coverScale : '100%',
                transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              }}
            />
            <img src={cropMask} alt="" className="pointer-events-none absolute inset-0 size-full" />
            <img
              src={cropGuide}
              alt=""
              className="pointer-events-none absolute"
              style={{
                left: `${(CIRCLE_LEFT / FRAME_WIDTH) * 100}%`,
                top: `${(CIRCLE_TOP / FRAME_HEIGHT) * 100}%`,
                width: `${(CIRCLE_SIZE / FRAME_WIDTH) * 100}%`,
              }}
            />
          </div>
          {/* 프레임 모서리 표시 (프레임보다 위아래로 8px 바깥) */}
          <img src={cropCorner} alt="" className="pointer-events-none absolute -top-2 left-0 size-[15px]" />
          <img src={cropCorner} alt="" className="pointer-events-none absolute -top-2 right-0 size-[15px] -scale-x-100" />
          <img src={cropCorner} alt="" className="pointer-events-none absolute -bottom-2 left-0 size-[15px] -scale-y-100" />
          <img src={cropCorner} alt="" className="pointer-events-none absolute right-0 -bottom-2 size-[15px] rotate-180" />
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!naturalSize}
          className="rounded-lg bg-purple-500 px-5 py-4 text-14 leading-[15px] font-bold text-white disabled:opacity-60"
        >
          {t('myPage.usePhoto')}
        </button>
      </div>

      <div className="h-[calc(var(--safe-bottom)+80px)] bg-gray-800" />
    </div>
  )
}
