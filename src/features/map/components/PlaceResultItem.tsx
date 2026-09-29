import { useTranslation } from 'react-i18next'
import { parseOpeningStatus } from '../businessHours'
import type { MapSpotDetail } from '../api/mapSpots.types'

interface PlaceResultItemProps {
  place: MapSpotDetail
}

export function PlaceResultItem({ place }: PlaceResultItemProps) {
  const { t } = useTranslation('map')
  const status = parseOpeningStatus(place.businessHours)

  return (
    <div className="flex flex-col gap-2 px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="text-18 font-bold text-gray-900">{place.title}</span>
        <span className="text-14 text-gray-500">{t(`placeDetail.contentType.${place.contentType}`)}</span>
        {place.placeScrapCount !== null && place.placeScrapCount > 0 && (
          <span className="text-14 text-gray-500">🔥 x {place.placeScrapCount}</span>
        )}
      </div>

      {place.addr && <p className="text-14 text-gray-600">{place.addr}</p>}

      {status && (
        <p className="text-14 text-gray-600">
          {status.isOpen
            ? `${t('searchPage.open')} · ${t('searchPage.closesAt', { time: status.time })}`
            : `${t('searchPage.closed')} · ${t('searchPage.opensAt', { time: status.time })}`}
        </p>
      )}

      {place.images.length > 0 && (
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {place.images.map((image) => (
            <img
              key={image}
              src={image}
              alt=""
              className="h-[120px] w-[120px] shrink-0 rounded-xl object-cover"
            />
          ))}
        </div>
      )}
    </div>
  )
}
