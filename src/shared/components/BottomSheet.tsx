import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera, type MediaResult } from '@capacitor/camera'

type StickerTab = 'mySticker' | 'giphy'

const TABS: { key: StickerTab; labelKey: string }[] = [
  { key: 'mySticker', labelKey: 'bottomSheet.mySticker' },
  { key: 'giphy', labelKey: 'bottomSheet.giphy' },
]

const TRANSITION_MS = 300

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onAdd?: (media: MediaResult) => void
  children?: ReactNode
}

export function BottomSheet({ isOpen, onClose, onAdd, children }: BottomSheetProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<StickerTab>('mySticker')
  const activeTabIndex = TABS.findIndex((tab) => tab.key === activeTab)
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)

  // chooseFromGallery는 모바일 브라우저/웹뷰에서 파일 입력을 여는데,
  // 이때 OS가 자체적으로 "카메라로 촬영 / 사진 보관함" 액션시트를 띄워주므로
  // 커스텀 선택 UI를 따로 만들 필요가 없음 (만들면 선택창이 두 번 뜨게 됨).
  const handlePickPhoto = async () => {
    try {
      const { results } = await Camera.chooseFromGallery({ quality: 90 })
      if (results[0]) onAdd?.(results[0])
    } catch {
      // 사용자가 선택을 취소한 경우 - 별도 처리 없음
    }
  }

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      return
    }

    setIsVisible(false)
    const timeout = setTimeout(() => setShouldRender(false), TRANSITION_MS)
    return () => clearTimeout(timeout)
  }, [isOpen])

  // shouldRender=true는 위 effect에서 커밋되고 브라우저가 닫힌 상태를 페인트한 "뒤"에
  // 이 effect가 실행되는 것이 보장되므로, 여기서 isVisible을 true로 바꿔야
  // translate-y-full -> translate-y-0 트랜지션이 매번 제대로 재생됨.
  useEffect(() => {
    if (shouldRender && isOpen) {
      setIsVisible(true)
    }
  }, [shouldRender, isOpen])

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        aria-label={t('bottomSheet.close')}
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative flex h-[70vh] w-full max-w-[430px] flex-col rounded-t-[24px] bg-white transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-9 rounded-full bg-gray-200" />
        </div>

        <div className="relative flex border-b border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 pt-3 pb-3 text-center text-14 transition-colors ${
                activeTab === tab.key ? 'font-semibold text-gray-800' : 'font-medium text-gray-500'
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
          <span
            className="absolute bottom-0 h-0.5 bg-gray-800 transition-all duration-300 ease-out"
            style={{
              left: `calc(${activeTabIndex} * ${100 / TABS.length}% + 1rem)`,
              width: `calc(${100 / TABS.length}% - 2rem)`,
            }}
          />
        </div>

        <div className="relative flex-1">
          {children}
          <button
            type="button"
            onClick={handlePickPhoto}
            aria-label={t('bottomSheet.addSticker')}
            className="absolute bottom-12 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 3v14M3 10h14" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
