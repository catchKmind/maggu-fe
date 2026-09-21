import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapView } from '../features/map/components/MapView'
import { Tag } from '../features/map/components/Tag'
import { SearchButton } from '../features/map/components/SearchButton'
import { StickerButton } from '../features/map/components/StickerButton'
import { PlaceDetailSheet } from '../features/map/components/PlaceDetailSheet'
import type { PhotoSpot } from '../features/map/types'
import { BottomNavigation } from '../shared/components/BottomNavigation'
import { BottomSheet } from '../shared/components/BottomSheet'
import { useMyStickers } from '../features/sticker/hooks/useMyStickers'
import { useDeleteSticker } from '../features/sticker/hooks/useDeleteSticker'
import type { MapPostCategory } from '../features/map/api/mapPosts.types'

/** 필터 칩과 API category 값 대응. "카페"는 API에 대응하는 값이 없어 아직 필터로 못 씀 */
const CATEGORY_TAGS: { labelKey: string; category?: MapPostCategory }[] = [
  { labelKey: 'tags.hotplace', category: 'POPULAR' },
  { labelKey: 'tags.cafe' },
  { labelKey: 'tags.restaurant', category: 'FOOD' },
  { labelKey: 'tags.spot', category: 'LANDMARK' },
  { labelKey: 'tags.accommodation', category: 'STAY' },
]

export default function MapPage() {
  const { t } = useTranslation('map')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchKeyword = searchParams.get('spot')
  const [isStickerSheetOpen, setIsStickerSheetOpen] = useState(false)
  const [selectedSpot, setSelectedSpot] = useState<PhotoSpot | null>(null)
  const [category, setCategory] = useState<MapPostCategory | undefined>()
  const { data: myStickers } = useMyStickers(isStickerSheetOpen)
  const deleteSticker = useDeleteSticker()

  return (
    <div className="relative flex flex-1 flex-col">
      <MapView onSpotClick={setSelectedSpot} searchKeyword={searchKeyword} category={category} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#D6D6D6] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-200/80 to-transparent" />
      <div className="absolute inset-x-0 top-7 flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <SearchButton onClick={() => navigate('/search')} />
          {CATEGORY_TAGS.map(({ labelKey, category: tagCategory }) => (
            <Tag
              key={labelKey}
              isSelected={tagCategory !== undefined && category === tagCategory}
              // 같은 칩을 다시 누르면 필터를 해제한다
              onClick={
                tagCategory && (() => setCategory((prev) => (prev === tagCategory ? undefined : tagCategory)))
              }
            >
              {t(labelKey)}
            </Tag>
          ))}
        </div>
        <div className="flex justify-end px-4 py-7">
          <StickerButton onClick={() => setIsStickerSheetOpen(true)} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[35px] flex justify-center">
        <BottomNavigation />
      </div>
      <BottomSheet
        isOpen={isStickerSheetOpen}
        onClose={() => setIsStickerSheetOpen(false)}
        myStickers={myStickers}
        onDeleteSticker={(stickerId) => deleteSticker.mutate(stickerId)}
      />
      <PlaceDetailSheet spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
    </div>
  )
}
