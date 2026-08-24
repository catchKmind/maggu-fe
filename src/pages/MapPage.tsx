import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapView } from '../features/map/components/MapView'
import { Tag } from '../features/map/components/Tag'
import { SearchButton } from '../features/map/components/SearchButton'
import { StickerButton } from '../features/map/components/StickerButton'
import { PlaceDetailSheet } from '../features/map/components/PlaceDetailSheet'
import { MOCK_PHOTO_SPOTS } from '../features/map/mocks/photoSpots'
import type { PhotoSpot } from '../features/map/types'
import { BottomNavigation } from '../shared/components/BottomNavigation'
import { BottomSheet } from '../shared/components/BottomSheet'

export default function MapPage() {
  const { t } = useTranslation('map')
  const [isStickerSheetOpen, setIsStickerSheetOpen] = useState(false)
  const [selectedSpot, setSelectedSpot] = useState<PhotoSpot | null>(null)

  return (
    <div className="relative flex flex-1 flex-col">
      <MapView photoSpots={MOCK_PHOTO_SPOTS} onSpotClick={setSelectedSpot} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#D6D6D6] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-200/80 to-transparent" />
      <div className="absolute inset-x-0 top-7 flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <SearchButton />
          <Tag>{t('tags.hotplace')}</Tag>
          <Tag>{t('tags.cafe')}</Tag>
          <Tag>{t('tags.restaurant')}</Tag>
          <Tag>{t('tags.spot')}</Tag>
          <Tag>{t('tags.accommodation')}</Tag>
        </div>
        <div className="flex justify-end px-4 py-7">
          <StickerButton onClick={() => setIsStickerSheetOpen(true)} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[35px] flex justify-center">
        <BottomNavigation />
      </div>
      <BottomSheet isOpen={isStickerSheetOpen} onClose={() => setIsStickerSheetOpen(false)} />
      <PlaceDetailSheet spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
    </div>
  )
}
