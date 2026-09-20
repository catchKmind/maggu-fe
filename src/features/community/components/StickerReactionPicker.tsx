import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMyStickers } from '../../sticker/hooks/useMyStickers'
import { useReactToPost } from '../hooks/useReactToPost'

function StickerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.5 2.5h7l2 2v7a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
        stroke="#A3A3A3"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M11.5 2.5v2.5H14" stroke="#A3A3A3" strokeWidth="1.3" strokeLinejoin="round" />
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
        className="flex h-4 w-4 items-center justify-center"
      >
        <StickerIcon />
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
