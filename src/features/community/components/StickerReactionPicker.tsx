import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMyStickers } from '../../sticker/hooks/useMyStickers'
import { useReactToPost } from '../hooks/useReactToPost'

function AddReactionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2.5 8.5c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6-2.9 6-6.5 6c-.7 0-1.5-.1-2.1-.4L3.5 15l.9-2.9C3.2 11 2.5 9.8 2.5 8.5Z"
        stroke="#A3A3A3"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M9 6.3v4.4M6.8 8.5h4.4" stroke="#A3A3A3" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

interface StickerReactionPickerProps {
  postId: number
}

export function StickerReactionPicker({ postId }: StickerReactionPickerProps) {
  const { t } = useTranslation('community')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: stickers } = useMyStickers()
  const reactToPost = useReactToPost()

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleReact = (stickerId: number) => {
    reactToPost.mutate({ postId, stickerId })
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t('reaction.label')}
        className="flex h-[18px] w-[18px] items-center justify-center"
      >
        <AddReactionIcon />
      </button>
      {isOpen && (
        <div className="absolute bottom-7 left-0 z-10 flex max-w-[220px] gap-2 overflow-x-auto rounded-2xl bg-white p-2 shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
          {stickers && stickers.length > 0 ? (
            stickers.map((sticker) => (
              <button
                key={sticker.stickerId}
                type="button"
                onClick={() => handleReact(sticker.stickerId)}
                className="h-10 w-10 shrink-0 overflow-hidden rounded-lg"
              >
                <img src={sticker.imageUrl} alt="" className="h-full w-full object-cover" />
              </button>
            ))
          ) : (
            <span className="px-2 py-1 text-13 whitespace-nowrap text-gray-400">{t('reaction.empty')}</span>
          )}
        </div>
      )}
    </div>
  )
}
