import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSlideSheet } from '../../../shared/hooks/useSlideSheet'
import { PhotoGrid } from '../../../shared/components/PhotoGrid'
import type { PhotoSpot } from '../types'

const PEEK_TOP = 148
const FULL_TOP = 0
const SWIPE_THRESHOLD = 40

type FeedTab = 'popular' | 'recent'

const FEED_TABS: { key: FeedTab; labelKey: string }[] = [
  { key: 'popular', labelKey: 'placeDetail.popular' },
  { key: 'recent', labelKey: 'placeDetail.recent' },
]

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14.5s5-4.2 5-8.2a5 5 0 1 0-10 0c0 4 5 8.2 5 8.2Z"
        stroke="#A3A3A3"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.3" r="1.8" stroke="#A3A3A3" strokeWidth="1.3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="#A3A3A3" strokeWidth="1.3" />
      <path d="M8 4.8V8l2.2 1.3" stroke="#A3A3A3" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 2.5h2l1 3-1.5 1.2a8 8 0 0 0 3.8 3.8L10.5 9l3 1v2c0 .8-.7 1.5-1.5 1.5C6.4 13.5 2.5 9.6 2.5 4.5c0-.8.7-1.5 1.5-1.5Z"
        stroke="#A3A3A3"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-14 text-gray-500">{text}</span>
    </div>
  )
}

interface PlaceDetailSheetProps {
  spot: PhotoSpot | null
  onClose: () => void
}

export function PlaceDetailSheet({ spot, onClose }: PlaceDetailSheetProps) {
  const { t } = useTranslation('map')
  const { shouldRender, isVisible } = useSlideSheet(spot !== null)
  const [activeTab, setActiveTab] = useState<FeedTab>('popular')
  const activeTabIndex = FEED_TABS.findIndex((tab) => tab.key === activeTab)

  const [sheetTop, setSheetTop] = useState(PEEK_TOP)
  const swipeStartYRef = useRef<number | null>(null)

  // 스팟이 바뀔 때마다(새로 열릴 때) 끌어올렸던 위치를 기본값으로 되돌림.
  useEffect(() => {
    setSheetTop(PEEK_TOP)
  }, [spot?.id])

  const handleSwipeStart = (e: React.PointerEvent) => {
    swipeStartYRef.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  // 위치를 손가락에 맞춰 실시간으로 끌어올리는 게 아니라,
  // 스와이프 한 번으로 천장(0)/원래 자리(PEEK_TOP) 사이를 스냅 전환함.
  const handleSwipeEnd = (e: React.PointerEvent) => {
    if (swipeStartYRef.current === null) return
    const delta = e.clientY - swipeStartYRef.current
    swipeStartYRef.current = null

    if (delta < -SWIPE_THRESHOLD) {
      setSheetTop(FULL_TOP)
    } else if (delta > SWIPE_THRESHOLD) {
      if (sheetTop === FULL_TOP) {
        setSheetTop(PEEK_TOP)
      } else {
        onClose()
      }
    }
  }

  if (!shouldRender || !spot) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t('placeDetail.close')}
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        style={{ top: sheetTop }}
        className={`absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col overflow-hidden bg-white transition-[top,transform,border-radius] duration-300 ease-out ${
          sheetTop === FULL_TOP ? 'rounded-t-none' : 'rounded-t-[24px]'
        } ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div
          onPointerDown={handleSwipeStart}
          onPointerUp={handleSwipeEnd}
          onPointerCancel={handleSwipeEnd}
          className="touch-none border-b border-gray-100"
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-9 rounded-full bg-gray-200" />
          </div>

          <div className="flex items-center justify-between px-5 pb-4">
            <h2 className="text-24 font-bold text-gray-900">{spot.name}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('placeDetail.close')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100"
            >
              <XIcon />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-5 pt-4">
            <p className="text-16 text-gray-500">{spot.category}</p>

            <div className="mt-3 flex flex-col gap-2">
              <InfoRow icon={<PinIcon />} text={spot.address} />
              <InfoRow icon={<ClockIcon />} text={spot.hours} />
              <InfoRow icon={<PhoneIcon />} text={spot.phone} />
            </div>

            <PhotoGrid photos={spot.photos} className="mt-4 h-[180px]" />
          </div>

          <div className="sticky top-0 z-10 flex border-b border-gray-100 bg-white">
            {FEED_TABS.map((tab) => (
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
                left: `calc(${activeTabIndex} * ${100 / FEED_TABS.length}% + 1rem)`,
                width: `calc(${100 / FEED_TABS.length}% - 2rem)`,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 px-5 pt-4 pb-8">
            {spot.feedPhotos.map((photo) => (
              <img key={photo} src={photo} alt="" className="aspect-square w-full rounded-lg object-cover" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
