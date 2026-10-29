import { useTranslation } from 'react-i18next'
import { useSlideSheet } from '../../../shared/hooks/useSlideSheet'
import { useImeAwareInput } from '../../../shared/hooks/useImeAwareInput'
import { useSearchMapSpots } from '../../map/hooks/useSearchMapSpots'
import type { PostLocation } from '../types'

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 4.5 6 11l6.5 6.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface LocationPickerSheetProps {
  isOpen: boolean
  onSelect: (location: PostLocation) => void
  onClose: () => void
}

export function LocationPickerSheet({ isOpen, onSelect, onClose }: LocationPickerSheetProps) {
  const { t } = useTranslation('community')
  const { shouldRender } = useSlideSheet(isOpen)
  const { value: keyword, committedValue, onChange, onCompositionStart, onCompositionEnd } = useImeAwareInput()
  const { data: places, isLoading } = useSearchMapSpots(committedValue || null)

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white">
      <div className="px-4 pt-[calc(var(--safe-top)+12px)] pb-3">
        <div className="flex h-11 items-center rounded-full bg-gray-50 pr-4 pl-1">
          <button
            type="button"
            onClick={onClose}
            aria-label={t('compose.locationBack')}
            className="flex h-9 w-9 shrink-0 items-center justify-center"
          >
            <BackIcon />
          </button>
          <input
            value={keyword}
            onChange={onChange}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            placeholder={t('compose.locationSearchPlaceholder')}
            autoFocus
            className="h-full flex-1 bg-transparent text-14 text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.loading')}</p>}
        {!isLoading && committedValue && places?.length === 0 && (
          <p className="px-5 py-8 text-center text-14 text-gray-400">{t('compose.locationEmpty')}</p>
        )}
        {places?.map((place) => (
          <button
            key={place.contentId}
            type="button"
            onClick={() =>
              onSelect({ lat: place.lat, lng: place.lng, placeName: place.title, source: 'MANUAL' })
            }
            className="flex w-full flex-col items-start gap-0.5 border-b border-gray-50 px-5 py-3.5 text-left"
          >
            <span className="text-15 font-medium text-gray-900">{place.title}</span>
            {place.addr && <span className="text-13 text-gray-400">{place.addr}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
