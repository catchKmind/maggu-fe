import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera } from '@capacitor/camera'
import { MyPageHeader, HeaderTextButton } from '../features/mypage/components/MyPageHeader'
import { ConfirmDialog } from '../features/mypage/components/ConfirmDialog'
import { SelectCheck } from '../features/mypage/components/SelectCheck'
import { BottomActionButton } from '../features/mypage/components/BottomActionButton'
import { EmptyState } from '../features/mypage/components/EmptyState'
import { useMyStickers } from '../features/sticker/hooks/useMyStickers'
import { useCreateSticker } from '../features/sticker/hooks/useCreateSticker'
import { useDeleteSticker } from '../features/sticker/hooks/useDeleteSticker'
import { StickerCreateScreen } from '../shared/sticker/StickerCreateScreen'
import plusIcon from '../assets/mypage/icon_plus.svg'
import smileIcon from '../assets/mypage/icon_smile.svg'

const TILE_CLASS = 'relative aspect-square overflow-hidden rounded-xl bg-gray-50'

export default function MyStickersPage() {
  const { t } = useTranslation()
  const { data: stickers = [], isSuccess } = useMyStickers()
  const createSticker = useCreateSticker()
  const deleteSticker = useDeleteSticker()

  const [isEditing, setIsEditing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pickedSource, setPickedSource] = useState<string | null>(null)

  const toggleEditing = () => {
    setIsEditing((prev) => !prev)
    setSelectedIds(new Set())
  }

  const toggleSelect = (stickerId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(stickerId)) next.delete(stickerId)
      else next.add(stickerId)
      return next
    })
  }

  // 지도 탭의 스티커 만들기와 같은 흐름: 갤러리 선택 → 누끼/테두리 → 업로드
  const handlePickPhoto = async () => {
    try {
      const { results } = await Camera.chooseFromGallery({ quality: 90 })
      const source = results[0]?.webPath ?? results[0]?.uri
      if (source) setPickedSource(source)
    } catch {
      // 사용자가 선택을 취소한 경우
    }
  }

  const handleDelete = async () => {
    // 일괄 삭제 API가 없어서 선택한 스티커를 하나씩 지운다.
    await Promise.allSettled([...selectedIds].map((id) => deleteSticker.mutateAsync(id)))
    setIsConfirmOpen(false)
    setSelectedIds(new Set())
    setIsEditing(false)
  }

  if (pickedSource) {
    return (
      <StickerCreateScreen
        source={pickedSource}
        onCancel={() => setPickedSource(null)}
        onConfirm={(sticker) => {
          createSticker.mutate(sticker)
          setPickedSource(null)
        }}
      />
    )
  }

  const selectedCount = selectedIds.size

  return (
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)] pb-32">
      <MyPageHeader
        // Figma: 편집 모드에서는 제목이 '편집'으로 바뀐다
        title={isEditing ? t('myPage.edit') : t('myPage.myStickers')}
        action={
          stickers.length > 0 && (
            <HeaderTextButton onClick={toggleEditing}>{isEditing ? t('myPage.done') : t('myPage.edit')}</HeaderTextButton>
          )
        }
      />

      {isSuccess && stickers.length === 0 ? (
        <EmptyState
          icon={smileIcon}
          title={t('myPage.emptyStickersTitle')}
          description={t('myPage.emptyStickersDescription')}
          actionLabel={t('myPage.createSticker')}
          onAction={handlePickPhoto}
          topPadding={200}
        />
      ) : (
        <>
          <p className="px-4 pt-4 pb-3 text-14 leading-[20px] tracking-[-0.28px] text-gray-500">
            {isEditing
              ? selectedCount > 0
                ? t('myPage.selectedCount', { count: selectedCount })
                : t('myPage.selectStickersToDelete')
              : t('myPage.stickerCount', { count: stickers.length })}
          </p>

          <div className="grid grid-cols-3 gap-2 px-4">
            {!isEditing && (
              <button
                type="button"
                onClick={handlePickPhoto}
                className={`${TILE_CLASS} flex flex-col items-center justify-center gap-[6px]`}
              >
                <img src={plusIcon} alt="" className="size-6" />
                <span className="text-12 leading-[18px] tracking-[-0.24px] text-gray-500">{t('myPage.createNew')}</span>
              </button>
            )}
            {stickers.map((sticker) => {
              const isSelected = selectedIds.has(sticker.stickerId)
              return (
                <button
                  key={sticker.stickerId}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => toggleSelect(sticker.stickerId)}
                  className={`${TILE_CLASS} ${isSelected ? 'border border-gray-700' : ''}`}
                >
                  <img src={sticker.imageUrl} alt="" className="absolute inset-[13%] size-[74%] object-contain" />
                  {isEditing && (
                    // Figma: 체크는 타일 오른쪽 위 (선택 시 테두리 1px만큼 안쪽으로)
                    <span className={`absolute ${isSelected ? 'top-[5px] right-[5px]' : 'top-[6px] right-[6px]'}`}>
                      <SelectCheck checked={isSelected} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}

      {isEditing && (
        <BottomActionButton
          label={
            selectedCount > 0
              ? t('myPage.deleteSelectedStickersCount', { count: selectedCount })
              : t('myPage.deleteSelectedStickers')
          }
          disabled={selectedCount === 0}
          onClick={() => setIsConfirmOpen(true)}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={t('myPage.deleteStickersConfirm', { count: selectedCount })}
        description={t('myPage.deleteStickersDescription')}
        cancelLabel={t('myPage.cancel')}
        confirmLabel={t('myPage.delete')}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        isPending={deleteSticker.isPending}
      />
    </div>
  )
}
