import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera } from '@capacitor/camera'
import { usePlaceFolders } from '../hooks/usePlaceFolders'
import { useCreatePlaceFolder } from '../hooks/useCreatePlaceFolder'
import { useCreatePlaceScrap } from '../hooks/useCreatePlaceScrap'
import { useMyStickers } from '../../sticker/hooks/useMyStickers'
import { StickerCreateScreen } from '../../../shared/sticker/StickerCreateScreen'

type ScrapStep = 'folder' | 'newFolder' | 'sticker' | 'confirm'

const DEFAULT_FOLDER_ICON = '📍'
const ICON_OPTIONS = ['📍', '❤️', '⭐️', '🌸', '🍜', '☕️', '🏖️', '🎡', '🐶', '🐱', '🎵', '🏔️', '🍔', '🌙', '🔥', '💜']

function BackIcon({ color = '#171717' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M11.5 4.5 6 10l5.5 5.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon({ color = '#374151' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 3v12M3 9h12" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.2 5.5 10.2 11.5 3.8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface PlaceScrapSheetProps {
  tourismContentId: string
  placeName: string
  placeCategory?: string
  placeImageUrl?: string
  onClose: () => void
  onScrapped?: () => void
}

export function PlaceScrapSheet({
  tourismContentId,
  placeName,
  placeCategory,
  placeImageUrl,
  onClose,
  onScrapped,
}: PlaceScrapSheetProps) {
  const { t } = useTranslation('map')
  const { data: folders } = usePlaceFolders()
  const { data: stickers } = useMyStickers()
  const createFolder = useCreatePlaceFolder()
  const createScrap = useCreatePlaceScrap()

  const [step, setStep] = useState<ScrapStep>('folder')
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null)
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderIcon, setNewFolderIcon] = useState(DEFAULT_FOLDER_ICON)
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false)
  const [pendingStickerSource, setPendingStickerSource] = useState<string | null>(null)

  const selectedSticker = stickers?.find((sticker) => sticker.stickerId === selectedStickerId) ?? null

  const handleCreateFolder = () => {
    const name = newFolderName.trim()
    if (!name) return

    createFolder.mutate(
      { name, icon: newFolderIcon },
      {
        onSuccess: (folder) => {
          setSelectedFolderId(folder.placeFolderId)
          setNewFolderName('')
          setNewFolderIcon(DEFAULT_FOLDER_ICON)
          setStep('folder')
        },
      },
    )
  }

  const handlePickStickerPhoto = async () => {
    try {
      const { results } = await Camera.chooseFromGallery({ quality: 90 })
      const photo = results[0]
      const source = photo?.webPath ?? photo?.uri
      if (source) setPendingStickerSource(source)
    } catch {
      // 취소 - 별도 처리 없음
    }
  }

  const handleSubmit = () => {
    if (selectedFolderId === null || selectedStickerId === null) return

    createScrap.mutate(
      { tourismContentId, placeFolderId: selectedFolderId, stickerId: selectedStickerId },
      {
        onSuccess: () => {
          onScrapped?.()
          onClose()
        },
      },
    )
  }

  if (step === 'folder') {
    return (
      <div className="fixed inset-0 z-[70] flex items-end justify-center">
        <button type="button" aria-label={t('placeDetail.close')} onClick={onClose} className="absolute inset-0 bg-black/40" />

        <div className="relative flex max-h-[85vh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[24px] bg-white">
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-9 rounded-full bg-gray-200" />
          </div>

          <div className="flex items-center justify-between px-5 pb-4">
            <div>
              <h2 className="text-20 font-bold text-gray-900">{placeName}</h2>
              {placeCategory && <p className="text-14 text-gray-400">{placeCategory}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('placeDetail.close')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto border-t border-gray-100 px-5">
            <button
              type="button"
              onClick={() => setStep('newFolder')}
              className="flex w-full items-center gap-3 border-b border-gray-50 py-3.5 text-left"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50">
                <PlusIcon />
              </span>
              <span className="text-15 text-gray-700">{t('placeScrap.newFolder')}</span>
            </button>

            {folders?.map((folder) => (
              <button
                key={folder.placeFolderId}
                type="button"
                onClick={() => setSelectedFolderId(folder.placeFolderId)}
                className="flex w-full items-center justify-between border-b border-gray-50 py-3.5"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-18">
                    {folder.icon}
                  </span>
                  <span className="text-15 text-gray-900">{folder.name}</span>
                </span>
                {selectedFolderId === folder.placeFolderId && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500">
                    <CheckIcon />
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="px-5 py-4">
            <button
              type="button"
              disabled={selectedFolderId === null}
              onClick={() => setStep('sticker')}
              className="w-full rounded-2xl bg-purple-500 py-3.5 text-16 font-semibold text-white disabled:opacity-40"
            >
              {t('placeScrap.next')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'newFolder') {
    return (
      <div className="fixed inset-0 z-[70] flex items-end justify-center">
        <button type="button" aria-label={t('placeDetail.close')} onClick={onClose} className="absolute inset-0 bg-black/40" />

        <div className="relative flex max-h-[85vh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[24px] bg-white">
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-9 rounded-full bg-gray-200" />
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 px-5 pb-4">
            <span className="text-16 font-semibold text-gray-900">{t('placeScrap.newFolderTitle')}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('placeDetail.close')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <button
              type="button"
              onClick={() => setIsIconPickerOpen(true)}
              className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-28"
            >
              {newFolderIcon}
              <span className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-gray-200 text-11">
                ✎
              </span>
            </button>

            {isIconPickerOpen && (
              <div className="mt-4">
                <p className="mb-2 text-13 font-semibold text-gray-500">{t('placeScrap.iconPickerTitle')}</p>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        setNewFolderIcon(icon)
                        setIsIconPickerOpen(false)
                      }}
                      className={`flex aspect-square items-center justify-center rounded-xl text-20 ${
                        newFolderIcon === icon ? 'bg-purple-50 ring-2 ring-purple-500' : 'bg-gray-50'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-6 mb-2 text-13 font-semibold text-gray-500">{t('placeScrap.folderNameLabel')}</p>
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder={t('placeScrap.folderNamePlaceholder')}
              maxLength={50}
              autoFocus
              className="h-11 w-full rounded-2xl bg-gray-50 px-4 text-14 text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="px-5 py-4">
            <button
              type="button"
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || createFolder.isPending}
              className="w-full rounded-2xl bg-purple-500 py-3.5 text-16 font-semibold text-white disabled:opacity-40"
            >
              {t('placeScrap.save')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'sticker') {
    return (
      <div className="fixed inset-0 z-[70] flex flex-col bg-black">
        <div className="flex items-center gap-3 px-4 pt-[calc(var(--safe-top)+12px)] pb-3">
          <button
            type="button"
            onClick={() => setStep('folder')}
            aria-label={t('stickerCreate.back')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
          >
            <BackIcon />
          </button>
          <span className="flex-1 rounded-full bg-white py-2.5 text-center text-14 font-medium text-gray-900">
            {t('placeScrap.stickerPrompt')}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('placeDetail.close')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          {placeImageUrl && (
            <img src={placeImageUrl} alt="" className="h-16 w-16 rounded-full border-2 border-white object-cover" />
          )}
          <span className="text-14 font-medium text-white">{placeName}</span>
        </div>

        <div className="flex flex-col rounded-t-[24px] bg-white">
          <div className="flex justify-center pt-3 pb-2">
            <div className="h-1 w-9 rounded-full bg-gray-200" />
          </div>

          <div className="grid grid-cols-4 gap-3 px-5 py-4">
            <button
              type="button"
              onClick={handlePickStickerPhoto}
              aria-label={t('bottomSheet.addSticker')}
              className="flex aspect-square items-center justify-center rounded-2xl bg-gray-50"
            >
              <PlusIcon />
            </button>
            {stickers?.map((sticker) => (
              <button
                key={sticker.stickerId}
                type="button"
                onClick={() => {
                  setSelectedStickerId(sticker.stickerId)
                  setStep('confirm')
                }}
                className="aspect-square overflow-hidden rounded-2xl bg-gray-50"
              >
                <img src={sticker.imageUrl} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>

          <div className="flex border-t border-gray-100 pb-[calc(var(--safe-bottom)+8px)]">
            <span className="flex-1 border-b-2 border-gray-900 py-3 text-center text-14 font-semibold text-gray-900">
              {t('bottomSheet.mySticker')}
            </span>
            <span className="flex-1 py-3 text-center text-14 text-gray-400">{t('bottomSheet.giphy')}</span>
          </div>
        </div>

        {pendingStickerSource && (
          <StickerCreateScreen
            source={pendingStickerSource}
            onCancel={() => setPendingStickerSource(null)}
            onConfirm={() => {
              // 업로드 API가 아직 없어서 방금 만든 스티커를 서버 목록에 반영할 수 없음 —
              // UI 플로우만 우선 구현. 업로드 API 생기면 여기서 createMySticker까지 이어서 호출.
              setPendingStickerSource(null)
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-black">
      <div className="flex items-center gap-3 px-4 pt-[calc(var(--safe-top)+12px)] pb-3">
        <button
          type="button"
          onClick={() => setStep('sticker')}
          aria-label={t('stickerCreate.back')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
        >
          <BackIcon />
        </button>
        <span className="flex-1 rounded-full bg-white py-2.5 text-center text-14 font-medium text-gray-900">
          {t('placeScrap.confirmPrompt')}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('placeDetail.close')}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <div className="relative">
          {placeImageUrl && (
            <img src={placeImageUrl} alt="" className="h-20 w-20 rounded-full border-2 border-white object-cover" />
          )}
          {selectedSticker && (
            <img
              src={selectedSticker.imageUrl}
              alt=""
              className="absolute -right-2 -bottom-2 h-10 w-10 object-contain"
            />
          )}
        </div>
        <span className="text-14 font-medium text-white">{placeName}</span>
      </div>

      <div className="px-4 pb-[calc(var(--safe-bottom)+16px)]">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
          {placeImageUrl && <img src={placeImageUrl} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />}
          <div className="min-w-0 flex-1">
            <p className="truncate text-14 font-semibold text-gray-900">{placeName}</p>
            {placeCategory && <p className="truncate text-13 text-gray-400">{placeCategory}</p>}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={createScrap.isPending}
            className="shrink-0 rounded-full bg-purple-500 px-5 py-2.5 text-14 font-semibold text-white disabled:opacity-50"
          >
            {t('placeScrap.save')}
          </button>
        </div>
        {createScrap.isError && <p className="mt-2 text-center text-13 text-red-400">{t('placeScrap.error')}</p>}
      </div>
    </div>
  )
}
