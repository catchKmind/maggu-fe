import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createSticker } from './createSticker'

type CornerPosition = 'tl' | 'tr' | 'bl' | 'br'

const CORNER_CLASSES: Record<CornerPosition, string> = {
  tl: 'top-3 left-3 border-t-2 border-l-2 rounded-tl-lg',
  tr: 'top-3 right-3 border-t-2 border-r-2 rounded-tr-lg',
  bl: 'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg',
  br: 'bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg',
}

const LONG_PRESS_MS = 500
const MOVE_TOLERANCE_PX = 10

function CornerBracket({ position }: { position: CornerPosition }) {
  return <div className={`absolute h-6 w-6 border-white/70 ${CORNER_CLASSES[position]}`} />
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M11.5 4.5 6 10l5.5 5.5" stroke="#171717" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface StickerCreateScreenProps {
  source: string
  onCancel: () => void
  onConfirm: (sticker: Blob) => void
}

/**
 * 사진 → 스티커 화면. 아이폰 사진 앱의 "길게 눌러 피사체 추출"처럼,
 * 이미지를 길게 누르면 그때 배경 제거 + 다이컷 테두리 처리가 시작된다.
 */
export function StickerCreateScreen({ source, onCancel, onConfirm }: StickerCreateScreenProps) {
  const { t } = useTranslation()
  const [stickerBlob, setStickerBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState(source)
  const [isPressing, setIsPressing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const objectUrlRef = useRef<string | null>(null)
  const pressTimerRef = useRef<number | null>(null)
  const pressStartRef = useRef<{ x: number; y: number } | null>(null)

  const isReady = stickerBlob !== null

  const clearPressTimer = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
    }
  }

  const runCutout = async () => {
    setIsProcessing(true)
    try {
      const blob = await createSticker(source)
      const url = URL.createObjectURL(blob)
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = url
      setStickerBlob(blob)
      setPreviewUrl(url)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isProcessing) return
    pressStartRef.current = { x: e.clientX, y: e.clientY }
    setIsPressing(true)
    pressTimerRef.current = window.setTimeout(() => {
      setIsPressing(false)
      runCutout()
    }, LONG_PRESS_MS)
  }

  const cancelPress = () => {
    clearPressTimer()
    setIsPressing(false)
    pressStartRef.current = null
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const start = pressStartRef.current
    if (!start) return
    const dist = Math.hypot(e.clientX - start.x, e.clientY - start.y)
    if (dist > MOVE_TOLERANCE_PX) cancelPress()
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black">
      <div className="flex items-center gap-3 px-4 pt-[calc(var(--safe-top)+12px)] pb-3">
        <button
          type="button"
          onClick={onCancel}
          aria-label={t('stickerCreate.back')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
        >
          <BackIcon />
        </button>
        <span className="flex-1 text-center text-16 font-semibold text-white">{t('stickerCreate.title')}</span>
        <div className="w-9 shrink-0" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8">
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={cancelPress}
          onPointerCancel={cancelPress}
          onContextMenu={(e) => e.preventDefault()}
          className="relative aspect-square w-full max-w-[320px] touch-none overflow-hidden rounded-3xl bg-gray-700 select-none [-webkit-touch-callout:none]"
        >
          <img
            src={previewUrl}
            alt=""
            draggable={false}
            className={`h-full w-full object-contain p-6 transition-transform duration-150 [-webkit-touch-callout:none] ${isPressing ? 'scale-95' : 'scale-100'}`}
          />
          <CornerBracket position="tl" />
          <CornerBracket position="tr" />
          <CornerBracket position="bl" />
          <CornerBracket position="br" />
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </div>
          )}
        </div>
        {!isReady && !isProcessing && <p className="text-13 text-white/60">{t('stickerCreate.hint')}</p>}
      </div>

      <div className="px-6 pb-[calc(var(--safe-bottom)+24px)] pt-4">
        <button
          type="button"
          disabled={!isReady}
          onClick={() => stickerBlob && onConfirm(stickerBlob)}
          className={`w-full rounded-2xl py-4 text-16 font-semibold transition-colors ${
            isReady ? 'bg-purple-500 text-white' : 'bg-purple-900/30 text-white/40'
          }`}
        >
          {t('stickerCreate.use')}
        </button>
      </div>
    </div>
  )
}
