import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MyPageHeader, HeaderTextButton } from '../features/mypage/components/MyPageHeader'
import { FolderIcon } from '../features/mypage/components/FolderIcon'
import { FolderIconPicker } from '../features/mypage/components/FolderIconPicker'
import { usePlaceFolders } from '../features/myplaces/hooks/usePlaceFolders'
import { useCreatePlaceFolder } from '../features/myplaces/hooks/useCreatePlaceFolder'
import { DEFAULT_FOLDER_ICON } from '../features/myplaces/folderIcons'
import pencilMiniDarkIcon from '../assets/mypage/icon_pencil_mini_dark.svg'
import xMarkIcon from '../assets/mypage/icon_x_mark_mini.svg'

/**
 * 리스트 편집 (Figma: 마이페이지- 내 리스트 - 리스트 편집).
 * /my-page/lists/new 이면 같은 화면으로 새 리스트를 만든다 (POST /api/v1/my-places/folders).
 */
export default function MyListEditPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { folderId } = useParams()
  const isNew = folderId === undefined
  const { data: folders = [] } = usePlaceFolders()
  const folder = folders.find((item) => String(item.placeFolderId) === folderId)
  const createFolder = useCreatePlaceFolder()

  // 수정 전에는 서버 값을 그대로 보여준다.
  const [editedName, setEditedName] = useState<string | null>(null)
  const [editedIcon, setEditedIcon] = useState<string | null>(null)
  const name = editedName ?? folder?.name ?? ''
  const icon = editedIcon ?? folder?.icon ?? DEFAULT_FOLDER_ICON
  const [isPickingIcon, setIsPickingIcon] = useState(false)

  const handleDone = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    if (isNew) {
      createFolder.mutate({ name: trimmed, icon }, { onSuccess: () => navigate(-1) })
      return
    }
    // TODO: 리스트 이름·아이콘 수정 API가 아직 없음. 생기면 여기서 호출하고 ['placeFolders'] 무효화.
  }

  if (isPickingIcon) {
    return (
      <FolderIconPicker
        initialIcon={icon}
        onBack={() => setIsPickingIcon(false)}
        onSelect={(next) => {
          setEditedIcon(next)
          setIsPickingIcon(false)
        }}
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)]">
      <MyPageHeader
        title={isNew ? t('myPage.createList') : t('myPage.editList')}
        action={
          <HeaderTextButton onClick={handleDone} disabled={!name.trim() || createFolder.isPending}>
            {t('myPage.done')}
          </HeaderTextButton>
        }
      />

      <section className="flex justify-center pt-6 pb-8">
        <button
          type="button"
          onClick={() => setIsPickingIcon(true)}
          aria-label={t('myPage.selectIcon')}
          className="relative flex size-[76px] items-center justify-center rounded-[22px] bg-gray-100"
        >
          <FolderIcon icon={icon} size={40} />
          <span className="absolute top-[54px] left-[54px] size-8 rounded-2xl border-2 border-gray-100 bg-white p-[6px]">
            <img src={pencilMiniDarkIcon} alt="" className="size-4" />
          </span>
        </button>
      </section>

      <section className="flex flex-col gap-3 py-[18px]">
        <label htmlFor="list-name" className="px-4 text-14 leading-[20px] tracking-[-0.28px] text-gray-500">
          {t('myPage.listName')}
        </label>
        <div className="px-4">
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-[10px] py-3">
            <input
              id="list-name"
              value={name}
              onChange={(e) => setEditedName(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-14 leading-[20px] tracking-[-0.28px] text-gray-700 caret-purple-400 outline-none"
            />
            {name && (
              <button type="button" onClick={() => setEditedName('')} aria-label={t('myPage.clearInput')}>
                <img src={xMarkIcon} alt="" className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
