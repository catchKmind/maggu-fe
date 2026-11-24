import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MyPageHeader, HeaderTextButton } from '../features/mypage/components/MyPageHeader'
import { EmptyState } from '../features/mypage/components/EmptyState'
import { ConfirmDialog } from '../features/mypage/components/ConfirmDialog'
import { SelectCheck } from '../features/mypage/components/SelectCheck'
import { BottomActionButton } from '../features/mypage/components/BottomActionButton'
import { PlaceResultItem } from '../features/map/components/PlaceResultItem'
import { useMapSpot } from '../features/map/hooks/useMapSpot'
import { usePlaceFolderScraps } from '../features/myplaces/hooks/usePlaceFolderScraps'
import type { PlaceScrapResponse } from '../features/myplaces/api/placeFolderScraps.types'
import { useLoadMoreOnVisible } from '../shared/hooks/useLoadMoreOnVisible'
import mapPinIcon from '../assets/mypage/icon_map_pin.svg'

/**
 * 장소 삭제 API가 아직 없어서(명세에는 저장 목록 조회만 있다) 편집/삭제 UI는 숨겨 둔다.
 * API가 생기면 true로 바꾸고 handleDelete를 삭제 호출로 교체한다.
 */
const DELETE_API_READY = false

/**
 * 저장한 장소 한 줄. 목록 응답에는 이름·주소만 있어서, 사진·분류·영업 정보는 장소 상세(useMapSpot)로 채운다.
 * 상세를 불러오는 동안이나 실패했을 때는 목록 응답의 이름·주소만 보여준다.
 */
function PlaceScrapRow({ scrap }: { scrap: PlaceScrapResponse }) {
  const { data: place } = useMapSpot(scrap.tourismContentId)

  if (place) return <PlaceResultItem place={place} />

  return (
    <div className="flex flex-col gap-2 px-5 py-4">
      {scrap.placeName ? (
        <span className="text-18 font-bold text-gray-900">{scrap.placeName}</span>
      ) : (
        <span className="h-[27px] w-40 animate-pulse rounded bg-gray-100" />
      )}
      {scrap.placeAddress && <p className="text-14 text-gray-600">{scrap.placeAddress}</p>}
    </div>
  )
}

/** 리스트 상세 (Figma: 마이페이지- 내 리스트 - 상세 / 상세 빈 상태). 리스트에 저장한 장소를 최신 저장순으로 보여준다. */
export default function MyListDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { folderId } = useParams()
  const placeFolderId = folderId === undefined ? null : Number(folderId)

  const scrapsQuery = usePlaceFolderScraps(placeFolderId)
  const firstPage = scrapsQuery.data?.pages[0]
  const places = scrapsQuery.data?.pages.flatMap((page) => page.placeScraps.content) ?? []
  const loadMoreRef = useLoadMoreOnVisible(
    () => void scrapsQuery.fetchNextPage(),
    scrapsQuery.hasNextPage && !scrapsQuery.isFetchingNextPage,
  )

  const [isEditing, setIsEditing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const toggleEditing = () => {
    setIsEditing((prev) => !prev)
    setSelectedIds(new Set())
  }

  const toggleSelect = (placeScrapId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(placeScrapId)) next.delete(placeScrapId)
      else next.add(placeScrapId)
      return next
    })
  }

  const handleDelete = () => {
    // TODO: 장소 삭제 API가 생기면 선택한 placeScrapId들을 지우고 ['placeFolderScraps']를 다시 불러온다.
    setIsConfirmOpen(false)
    setSelectedIds(new Set())
    setIsEditing(false)
  }

  const selectedCount = selectedIds.size

  return (
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)] pb-32">
      <MyPageHeader
        title={firstPage?.placeFolder.name ?? ''}
        action={
          DELETE_API_READY &&
          places.length > 0 && (
            <HeaderTextButton onClick={toggleEditing}>{isEditing ? t('myPage.done') : t('myPage.edit')}</HeaderTextButton>
          )
        }
      />

      {scrapsQuery.isLoading && <p className="px-5 py-8 text-center typo-body-m text-gray-400">{t('myPage.loading')}</p>}
      {scrapsQuery.isError && <p className="px-5 py-8 text-center typo-body-m text-gray-400">{t('myPage.listError')}</p>}

      {scrapsQuery.isSuccess &&
        (places.length === 0 ? (
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
            <p className="px-4 pt-4 pb-1 typo-body-m text-gray-500">
              {isEditing
                ? selectedCount > 0
                  ? t('myPage.selectedCount', { count: selectedCount })
                  : t('myPage.selectPlacesToDelete')
                : t('myPage.placeCount', { count: firstPage?.totalScrapCount ?? places.length })}
            </p>

            <div className="flex flex-col">
              {places.map((scrap) => {
                if (!isEditing) {
                  return (
                    <div key={scrap.placeScrapId} className="border-b border-gray-100">
                      <PlaceScrapRow scrap={scrap} />
                    </div>
                  )
                }

                const isSelected = selectedIds.has(scrap.placeScrapId)
                return (
                  <div
                    key={scrap.placeScrapId}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSelect(scrap.placeScrapId)}
                    className="flex items-start gap-1 border-b border-gray-100 pl-4"
                  >
                    <span className="pt-[18px]">
                      <SelectCheck checked={isSelected} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <PlaceScrapRow scrap={scrap} />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ))}

      {/* 맨 아래에 닿으면 다음 페이지를 불러온다 */}
      <div ref={loadMoreRef} className="h-px" />
      {scrapsQuery.isFetchingNextPage && (
        <p className="px-5 py-4 text-center typo-body-s text-gray-400">{t('myPage.loading')}</p>
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
