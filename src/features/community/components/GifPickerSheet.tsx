import { useTranslation } from 'react-i18next'
import { useSlideSheet } from '../../../shared/hooks/useSlideSheet'
import { GiphyPicker, type Gif } from '../../../shared/gif/GiphyPicker'

interface GifPickerSheetProps {
  isOpen: boolean
  onSelect: (gif: Gif) => void
  onClose: () => void
}

export function GifPickerSheet({ isOpen, onSelect, onClose }: GifPickerSheetProps) {
  const { t } = useTranslation()
  const { shouldRender, isVisible } = useSlideSheet(isOpen)

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
        <GiphyPicker
          onSelect={(gif) => {
            onSelect(gif)
            onClose()
          }}
        />
      </div>
    </div>
  )
}
