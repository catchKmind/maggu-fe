import { useTranslation } from 'react-i18next'
import { MapView } from '../features/map/components/MapView'
import { Tag } from '../features/map/components/Tag'
import { SearchButton } from '../features/map/components/SearchButton'
import { BottomNavigation } from '../shared/components/BottomNavigation'

export default function MapPage() {
  const { t } = useTranslation('map')

  return (
    <div className="relative flex flex-1 flex-col">
      <MapView />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#D6D6D6] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-200/80 to-transparent" />
      <div
        className="absolute inset-x-0 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ top: 'calc(var(--safe-top) + 16px)' }}
      >
        <SearchButton />
        <Tag>{t('tags.hotplace')}</Tag>
        <Tag>{t('tags.cafe')}</Tag>
        <Tag>{t('tags.restaurant')}</Tag>
        <Tag>{t('tags.spot')}</Tag>
        <Tag>{t('tags.accommodation')}</Tag>
      </div>
      <div className="absolute inset-x-0 bottom-[35px] flex justify-center">
        <BottomNavigation />
      </div>
    </div>
  )
}
