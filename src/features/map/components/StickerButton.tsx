import stickerIcon from '../../../assets/map/icon_sticker.svg'

interface StickerButtonProps {
  onClick?: () => void
}

export function StickerButton({ onClick }: StickerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-50">
      <img src={stickerIcon} alt="sticker" className="h-6 w-6" />
    </button>
  )
}
