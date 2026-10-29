import { useTranslation } from 'react-i18next'
import { useSlideSheet } from '../../../shared/hooks/useSlideSheet'
import { useMyStickers } from '../../sticker/hooks/useMyStickers'
import type { StickerResponse } from '../../sticker/api/stickers.types'

interface StickerPickerSheetProps {
  isOpen: boolean
  onSelect: (sticker: StickerResponse) => void
  onClose: () => void
}

export function StickerPickerSheet({ isOpen, onSelect, onClose }: StickerPickerSheetProps) {
  const { t } = useTranslation('community')
  const { shouldRender, isVisible } = useSlideSheet(isOpen)
  const { data: stickers } = useMyStickers(isOpen)

  if (!shouldRender) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label={t('bottomSheet.close')}
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 mx-auto flex h-[70vh] w-full max-w-[430px] flex-col rounded-t-[24px] bg-white transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-9 rounded-full bg-gray-200" />
        </div>
        <div className="border-b border-gray-100 pb-3 text-center text-14 font-semibold text-gray-800">
          {t('bottomSheet.mySticker')}
        </div>
        <div className="flex-1 overflow-y-auto">
          {stickers?.length === 0 && (
            <p className="px-5 py-8 text-center text-14 text-gray-400">{t('reaction.empty')}</p>
          )}
          <div className="grid grid-cols-3 gap-3 p-4">
            {stickers?.map((sticker) => (
              <button
                key={sticker.stickerId}
                type="button"
                onClick={() => {
                  onSelect(sticker)
                  onClose()
                }}
                className="aspect-square overflow-hidden rounded-2xl bg-gray-50"
              >
                <img src={sticker.imageUrl} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
