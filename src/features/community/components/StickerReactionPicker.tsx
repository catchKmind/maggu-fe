import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { BottomSheet } from '../../../shared/components/BottomSheet'
import type { Gif } from '../../../shared/gif/GiphyPicker'
import { useMyStickers } from '../../sticker/hooks/useMyStickers'
import { useCreateSticker } from '../../sticker/hooks/useCreateSticker'
import { createGiphySticker } from '../../sticker/api/stickers'
import { useReactToPost } from '../hooks/useReactToPost'
import stickerIcon from '../../../assets/community/icon_community_stiker.svg'

interface StickerReactionPickerProps {
  postId: number
}

/**
 * 게시글 스티커 반응 버튼. 누르면 지도 화면과 같은 스티커 바텀시트(내 스티커 / Giphy)가 올라오고,
 * 고른 스티커로 반응을 남긴다 (POST /api/v1/community/posts/{postId}/reactions).
 */
export function StickerReactionPicker({ postId }: StickerReactionPickerProps) {
  const { t } = useTranslation('community')
  const [isOpen, setIsOpen] = useState(false)
  const { data: myStickers } = useMyStickers(isOpen)
  const createSticker = useCreateSticker()
  const reactToPost = useReactToPost()

  // Giphy는 바로 반응할 수 없어서, 먼저 내 스티커로 저장한 뒤 그 stickerId로 반응한다.
  const reactWithGif = useMutation({
    mutationFn: async (gif: Gif) => {
      const sticker = await createGiphySticker({ giphyId: String(gif.id), imageUrl: gif.images.original.url })
      return reactToPost.mutateAsync({ postId, stickerId: sticker.stickerId })
    },
  })

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t('reaction.label')}
        className="flex items-center gap-1 rounded-xl bg-gray-50 px-[10px] py-[6px]"
      >
        <img src={stickerIcon} alt="" className="size-6" />
        <span className="text-14 leading-none text-purple-400">+</span>
      </button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        myStickers={myStickers}
        onAdd={(sticker) => createSticker.mutate(sticker)}
        onSelectSticker={(sticker) => reactToPost.mutate({ postId, stickerId: sticker.stickerId })}
        onSelectGif={(gif) => reactWithGif.mutate(gif)}
      />
    </>
  )
}
