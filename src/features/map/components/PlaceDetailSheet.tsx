import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSlideSheet } from '../../../shared/hooks/useSlideSheet'
import { PhotoGrid } from '../../../shared/components/PhotoGrid'
import { JsonLd } from '../../../shared/components/JsonLd'
import { toImageUrl } from '../../../shared/lib/imageUrl'
import { useContentFeed } from '../hooks/useContentFeed'
import { useMapSpot } from '../hooks/useMapSpot'
import { PlaceScrapSheet } from '../../myplaces/components/PlaceScrapSheet'
import { toPlaceJsonLd } from '../mappers/toPlaceJsonLd'
import type { FeedSort } from '../../community/api/posts.types'
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1.5a4.8 4.8 0 0 0-4.8 4.8c0 3.5 4.8 8.2 4.8 8.2s4.8-4.7 4.8-8.2A4.8 4.8 0 0 0 8 1.5Zm0 6.6a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm.75 3.25a.75.75 0 0 0-1.5 0V8c0 .26.14.5.36.64l2.2 1.3a.75.75 0 1 0 .78-1.28L8.75 7.6V4.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.9 1.8c-.8 0-1.4.6-1.4 1.4 0 5.8 4.7 10.5 10.5 10.5.8 0 1.4-.6 1.4-1.4v-1.6c0-.4-.2-.7-.6-.9l-2.4-.9c-.3-.1-.7 0-.9.2l-.9.9a8.2 8.2 0 0 1-3.5-3.5l.9-.9c.2-.2.3-.6.2-.9L6.1 2.4c-.1-.4-.5-.6-.9-.6H3.9Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="m4.5 6.5 3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ListAddIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 5h8M3 9h6M3 13h4" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="13" r="3.2" fill="white" stroke="var(--color-icon-default)" strokeWidth="1.2" />
      <path d="M14 11.6v2.8M12.6 13h2.8" stroke="var(--color-icon-default)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600">{icon}</span>
      <span className="typo-body-m text-gray-700">{text}</span>
    </div>
  )
}

interface PlaceDetailSheetProps {
  spot: PhotoSpot | null
  onClose: () => void
}

export function PlaceDetailSheet({ spot, onClose }: PlaceDetailSheetProps) {
  const { t } = useTranslation('map')
  const navigate = useNavigate()
  const { shouldRender, isVisible } = useSlideSheet(spot !== null)
  const [activeTab, setActiveTab] = useState<FeedTab>('popular')
  const feedSort: FeedSort = activeTab === 'popular' ? 'most_scrapped' : 'latest'
  const { data: contentFeed, isLoading: isFeedLoading, isError: isFeedError } = useContentFeed(spot?.tourismContentId ?? null, feedSort)
  const [isHoursOpen, setIsHoursOpen] = useState(false)
  const feedItems = contentFeed?.content ?? []
  const { data: spotDetail, isLoading: isSpotLoading } = useMapSpot(spot?.tourismContentId ?? null)

  const [sheetTop, setSheetTop] = useState(PEEK_TOP)
  const [isScrapSheetOpen, setIsScrapSheetOpen] = useState(false)
  const swipeStartYRef = useRef<number | null>(null)

  // 스팟이 바뀔 때마다(새로 열릴 때) 끌어올렸던 위치를 기본값으로 되돌림.
  useEffect(() => {
    setSheetTop(PEEK_TOP)
    setIsHoursOpen(false)
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

  const address = spotDetail?.addr ?? spot.address
  const hours = spotDetail?.businessHours ?? spot.hours
  const phone = spotDetail?.tel ?? spot.phone
  const closedDays = spotDetail?.closedDays ?? null
  // 검색으로 연 장소는 spot.category가 있고, 지도 마커로 연 장소는 상세 응답의 종류(contentType)로 채운다
  const category =
    spot.category ?? (spotDetail ? t(`placeDetail.contentType.${spotDetail.contentType}`, { defaultValue: '' }) : '')
  // 관광지에 연결되지 않은 게시글(자동 인식 위치 등)은 피드 API로 못 가져와서, 마커가 가리키는 그 게시글만 보여준다
  const fallbackFeed =
    !spot.tourismContentId && spot.isPostPhoto ? [{ postId: Number(spot.id), imageUrl: spot.photos[0] }] : []
  // 장소 사진은 장소 자신의 사진만 쓴다. 지도 마커의 photos는 "다른 게시글의 대표 사진"이라 대신 보여주면 안 된다.
  const placePhotos = spot.isPostPhoto ? [] : spot.photos
  const photos = spotDetail?.images.length ? spotDetail.images : placePhotos

  return (
    <div className="fixed inset-0 z-50">
      {spotDetail && <JsonLd data={toPlaceJsonLd(spotDetail)} />}
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
          className="touch-none"
        >
          <div className="flex justify-center pt-3 pb-3">
            <div className="h-1 w-10 rounded-full bg-gray-200" />
          </div>

          <div className="flex items-center justify-between px-4">
            <h2 className="text-20 leading-[30px] font-medium text-gray-900">{spot.name}</h2>
            {spot.tourismContentId && (
              <button
                type="button"
                onClick={() => setIsScrapSheetOpen(true)}
                aria-label={t('placeScrap.listButton')}
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-50"
              >
                <ListAddIcon />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pt-px pb-8">
            {category && <p className="typo-body-m-medium text-gray-700">{category}</p>}

            {(address || hours || phone) && (
              <div className="mt-1 flex flex-col gap-1">
                {address && <InfoRow icon={<PinIcon />} text={address} />}
                {hours &&
                  (closedDays ? (
                    <button type="button" onClick={() => setIsHoursOpen((open) => !open)} className="flex flex-col gap-1 text-left">
                      <span className="flex items-center gap-2">
                        <span className="text-gray-600">
                          <ClockIcon />
                        </span>
                        <span className="typo-body-m text-gray-700">{hours}</span>
                        <span className="text-gray-600">
                          <ChevronDownIcon open={isHoursOpen} />
                        </span>
                      </span>
                      {isHoursOpen && (
                        <span className="pl-6 typo-body-m text-gray-500">
                          {t('placeDetail.closedDays')}: {closedDays}
                        </span>
                      )}
                    </button>
                  ) : (
                    <InfoRow icon={<ClockIcon />} text={hours} />
                  ))}
                {phone && <InfoRow icon={<PhoneIcon />} text={phone} />}
              </div>
            )}

            {photos.length > 0 && (
              <PhotoGrid photos={photos} className="mt-6 h-[162px]" radiusClassName="rounded-lg" gapClassName="gap-[1.5px]" />
            )}
            {photos.length === 0 && !isSpotLoading && (
              <div className="mt-6 flex h-[162px] flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 text-gray-400">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3.5" y="4.5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="9" cy="10" r="1.6" fill="currentColor" />
                  <path d="m4 17 5-4.5 3.5 3L16 12l4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                <span className="typo-body-m">{t('placeDetail.noPhoto')}</span>
              </div>
            )}
          </div>

          {(spot.tourismContentId || fallbackFeed.length > 0) && (
            <>
              {spot.tourismContentId && (
                <div className="sticky top-0 z-10 flex border-t border-[#d9d9d9] bg-white px-4 py-2">
                  {FEED_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex h-8 flex-1 items-center justify-center border-b-2 text-14 transition-colors ${
                        activeTab === tab.key
                          ? 'border-gray-800 font-semibold text-gray-800'
                          : 'border-transparent font-regular text-gray-500'
                      }`}
                    >
                      {t(tab.labelKey)}
                    </button>
                  ))}
                </div>
              )}

              {spot.tourismContentId && isFeedLoading && (
                <p className="px-4 py-8 text-center typo-body-m text-gray-400">{t('placeDetail.feedLoading')}</p>
              )}
              {spot.tourismContentId && isFeedError && (
                <p className="px-4 py-8 text-center typo-body-m text-gray-400">{t('placeDetail.feedError')}</p>
              )}
              {spot.tourismContentId && !isFeedLoading && !isFeedError && feedItems.length === 0 && (
                <p className="px-4 py-8 text-center typo-body-m text-gray-400">{t('placeDetail.feedEmpty')}</p>
              )}

              <div className="grid grid-cols-2 gap-2 p-4">
                {(spot.tourismContentId ? feedItems : fallbackFeed).map((item) => (
                  // 사진을 누르면 그 게시글 상세로 이동한다
                  <button
                    key={item.postId}
                    type="button"
                    onClick={() => navigate(`/community/posts/${item.postId}`)}
                    className="block h-[200px] w-full overflow-hidden rounded-lg"
                  >
                    <img src={toImageUrl(item.imageUrl)} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {isScrapSheetOpen && spot.tourismContentId && (
        <PlaceScrapSheet
          tourismContentId={spot.tourismContentId}
          placeName={spot.name}
          placeCategory={spot.category}
          placeImageUrl={photos[0]}
          onClose={() => setIsScrapSheetOpen(false)}
        />
      )}
    </div>
  )
}
