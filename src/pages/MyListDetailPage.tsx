import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MyPageHeader } from '../features/mypage/components/MyPageHeader'
import { EmptyState } from '../features/mypage/components/EmptyState'
import { usePlaceFolders } from '../features/myplaces/hooks/usePlaceFolders'
import mapPinIcon from '../assets/mypage/icon_map_pin.svg'

/**
 * 리스트 상세 (Figma: 마이페이지- 내 리스트 - 상세 / 상세 빈 상태).
 * TODO: 폴더별 저장 장소 목록 API가 아직 없어서 항상 빈 상태를 보여준다.
 * API가 생기면 장소 행은 지도 검색 결과와 같은 PlaceResultItem을 쓰고,
 * 편집(장소 선택 → 선택한 장소 삭제)은 내 리스트 편집과 같은 패턴으로 붙인다.
 */
export default function MyListDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { folderId } = useParams()
  const { data: folders = [] } = usePlaceFolders()
  const folder = folders.find((item) => String(item.placeFolderId) === folderId)

  return (
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)]">
      <MyPageHeader title={folder?.name ?? ''} />
      <EmptyState
        icon={mapPinIcon}
        title={t('myPage.emptyPlacesTitle')}
        description={t('myPage.emptyPlacesDescription')}
        actionLabel={t('myPage.addPlace')}
        onAction={() => navigate('/')}
        topPadding={200}
      />
    </div>
  )
}
