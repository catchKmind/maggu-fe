import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MyPageHeader, HeaderTextButton } from '../features/mypage/components/MyPageHeader'
import { EmptyState } from '../features/mypage/components/EmptyState'
import { ConfirmDialog } from '../features/mypage/components/ConfirmDialog'
import { SelectCheck } from '../features/mypage/components/SelectCheck'
import { BottomActionButton } from '../features/mypage/components/BottomActionButton'
import { PlaceResultItem } from '../features/map/components/PlaceResultItem'
import { usePlaceFolders } from '../features/myplaces/hooks/usePlaceFolders'
import { MOCK_MY_PLACES } from '../features/mypage/mocks/myPlaces'
import mapPinIcon from '../assets/mypage/icon_map_pin.svg'

/**
 * 리스트 상세 (Figma: 마이페이지- 내 리스트 - 상세 / 상세 빈 상태).
 * TODO: 폴더별 저장 장소 목록·삭제 API가 아직 없어서 목업(MOCK_MY_PLACES)으로 UI만 구현했다.
 * API가 생기면 places를 useQuery 결과로, handleDelete를 삭제 API 호출로 교체한다.
 */
export default function MyListDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { folderId } = useParams()
  const { data: folders = [] } = usePlaceFolders()
  const folder = folders.find((item) => String(item.placeFolderId) === folderId)

  const [places, setPlaces] = useState(MOCK_MY_PLACES)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const toggleEditing = () => {
    setIsEditing((prev) => !prev)
    setSelectedIds(new Set())
  }

  const toggleSelect = (contentId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(contentId)) next.delete(contentId)
      else next.add(contentId)
      return next
    })
  }

  const handleDelete = () => {
    setPlaces((prev) => prev.filter((place) => !selectedIds.has(place.contentId)))
    setIsConfirmOpen(false)
    setSelectedIds(new Set())
    setIsEditing(false)
  }

  const selectedCount = selectedIds.size

  return (
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)] pb-32">
      <MyPageHeader
        title={folder?.name ?? ''}
        action={
          places.length > 0 && (
            <HeaderTextButton onClick={toggleEditing}>{isEditing ? t('myPage.done') : t('myPage.edit')}</HeaderTextButton>
          )
        }
      />

      {places.length === 0 ? (
        <EmptyState
          icon={mapPinIcon}
          title={t('myPage.emptyPlacesTitle')}
          description={t('myPage.emptyPlacesDescription')}
          actionLabel={t('myPage.addPlace')}
          onAction={() => navigate('/')}
          topPadding={200}
        />
      ) : (
        <>
          <p className="px-4 pt-4 pb-1 text-14 leading-[20px] tracking-[-0.28px] text-gray-500">
            {isEditing
              ? selectedCount > 0
                ? t('myPage.selectedCount', { count: selectedCount })
                : t('myPage.selectPlacesToDelete')
              : t('myPage.placeCount', { count: places.length })}
          </p>

          <div className="flex flex-col">
            {places.map((place) => {
              if (!isEditing) {
                return (
                  <div key={place.contentId} className="border-b border-gray-100">
                    <PlaceResultItem place={place} />
                  </div>
                )
              }

              const isSelected = selectedIds.has(place.contentId)
              return (
                <div
                  key={place.contentId}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleSelect(place.contentId)}
                  className="flex items-start gap-1 border-b border-gray-100 pl-4"
                >
                  <span className="pt-[18px]">
                    <SelectCheck checked={isSelected} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <PlaceResultItem place={place} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {isEditing && (
        <BottomActionButton
          label={
            selectedCount > 0
              ? t('myPage.deleteSelectedPlacesCount', { count: selectedCount })
              : t('myPage.deleteSelectedPlaces')
          }
          disabled={selectedCount === 0}
          onClick={() => setIsConfirmOpen(true)}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={t('myPage.deletePlacesConfirm', { count: selectedCount })}
        description={t('myPage.deletePlacesDescription')}
        cancelLabel={t('myPage.cancel')}
        confirmLabel={t('myPage.delete')}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
