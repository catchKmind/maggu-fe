import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MyPageHeader, HeaderTextButton } from '../features/mypage/components/MyPageHeader'
import { ConfirmDialog } from '../features/mypage/components/ConfirmDialog'
import { SelectCheck } from '../features/mypage/components/SelectCheck'
import { BottomActionButton } from '../features/mypage/components/BottomActionButton'
import { EmptyState } from '../features/mypage/components/EmptyState'
import { FolderIcon } from '../features/mypage/components/FolderIcon'
import { usePlaceFolders } from '../features/myplaces/hooks/usePlaceFolders'
import chevronIcon from '../assets/mypage/icon_chevron_left.svg'
import plusIcon from '../assets/mypage/icon_plus.svg'
import pencilMiniIcon from '../assets/mypage/icon_pencil_mini.svg'
import listIcon from '../assets/mypage/icon_list.svg'

const ROW_CLASS = 'flex w-full items-center gap-3 overflow-hidden rounded-[14px] bg-gray-100 py-3 pr-4 pl-3 text-left'

/** 리스트 아이콘 타일 (Figma: icon tile 40px) */
function FolderIconTile({ icon }: { icon: string }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white">
      <FolderIcon icon={icon} size={20} />
    </span>
  )
}

export default function MyListsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: folders = [], isSuccess } = usePlaceFolders()

  const [isEditing, setIsEditing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const toggleEditing = () => {
    setIsEditing((prev) => !prev)
    setSelectedIds(new Set())
  }

  const toggleSelect = (folderId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) next.delete(folderId)
      else next.add(folderId)
      return next
    })
  }

  const handleDelete = () => {
    // TODO: 리스트(폴더) 삭제 API가 아직 없음. 생기면 여기서 호출하고 ['placeFolders'] 무효화.
    setIsConfirmOpen(false)
  }

  const goToCreate = () => navigate('/my-page/lists/new')
  const selectedCount = selectedIds.size

  return (
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)] pb-32">
      <MyPageHeader
        title={t('myPage.myLists')}
        action={
          folders.length > 0 && (
            <HeaderTextButton onClick={toggleEditing}>{isEditing ? t('myPage.done') : t('myPage.edit')}</HeaderTextButton>
          )
        }
      />

      {isSuccess && folders.length === 0 ? (
        <EmptyState
          icon={listIcon}
          title={t('myPage.emptyListsTitle')}
          description={t('myPage.emptyListsDescription')}
          actionLabel={t('myPage.createListShort')}
          onAction={goToCreate}
          topPadding={200}
          tileClassName="bg-gray-100"
        />
      ) : (
        <>
          <p className="px-4 pt-4 pb-3 text-14 leading-[20px] tracking-[-0.28px] text-gray-500">
            {isEditing
              ? selectedCount > 0
                ? t('myPage.selectedCount', { count: selectedCount })
                : t('myPage.selectListsToDelete')
              : t('myPage.listCount', { count: folders.length })}
          </p>

          <div className="flex flex-col gap-2 px-4">
            {!isEditing && (
              <button type="button" onClick={goToCreate} className={ROW_CLASS}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white">
                  <img src={plusIcon} alt="" className="size-5" />
                </span>
                <span className="text-14 leading-[20px] tracking-[-0.28px] text-gray-800">{t('myPage.createList')}</span>
              </button>
            )}

            {folders.map((folder) => {
              const isSelected = selectedIds.has(folder.placeFolderId)

              if (!isEditing) {
                return (
                  <button
                    key={folder.placeFolderId}
                    type="button"
                    onClick={() => navigate(`/my-page/lists/${folder.placeFolderId}`)}
                    className={ROW_CLASS}
                  >
                    <FolderIconTile icon={folder.icon} />
                    <span className="min-w-0 flex-1 truncate text-14 leading-[20px] tracking-[-0.28px] text-gray-800">
                      {folder.name}
                    </span>
                    <img src={chevronIcon} alt="" className="size-5 rotate-180" />
                  </button>
                )
              }

              return (
                <div
                  key={folder.placeFolderId}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleSelect(folder.placeFolderId)}
                  className={`${ROW_CLASS} border ${isSelected ? 'border-gray-700' : 'border-transparent'}`}
                >
                  <SelectCheck checked={isSelected} />
                  <FolderIconTile icon={folder.icon} />
                  <span className="min-w-0 flex-1 truncate text-14 leading-[20px] tracking-[-0.28px] text-gray-800">
                    {folder.name}
                  </span>
                  <button
                    type="button"
                    aria-label={t('myPage.editList')}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/my-page/lists/${folder.placeFolderId}/edit`)
                    }}
                    className="rounded-full bg-white p-[6px]"
                  >
                    <img src={pencilMiniIcon} alt="" className="size-4" />
                  </button>
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
              ? t('myPage.deleteSelectedListsCount', { count: selectedCount })
              : t('myPage.deleteSelectedLists')
          }
          disabled={selectedCount === 0}
          onClick={() => setIsConfirmOpen(true)}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={t('myPage.deleteListsConfirm', { count: selectedCount })}
        description={t('myPage.deleteListsDescription')}
        cancelLabel={t('myPage.cancel')}
        confirmLabel={t('myPage.delete')}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
