import { toImageUrl } from '../../../shared/lib/imageUrl'
import type { StickerReactionItem } from '../api/posts.types'
import { useReactToPost } from '../hooks/useReactToPost'

interface StickerReactionChipsProps {
  postId: number
  reactions: StickerReactionItem[]
  /** 보여줄 최대 개수. 많이 받은 순으로 자른다. 없으면 전부 보여준다 */
  max?: number
}

/**
 * 게시글에 달린 스티커 반응 칩 (Figma: 스티커 공감 — 스티커 이미지 + 개수).
 * 칩을 누르면 같은 스티커로 공감을 남긴다.
 */
export function StickerReactionChips({ postId, reactions, max }: StickerReactionChipsProps) {
  const reactToPost = useReactToPost()
  const sorted = [...reactions].sort((a, b) => b.count - a.count)
  const visible = max === undefined ? sorted : sorted.slice(0, max)

  return (
    <>
      {visible.map((reaction) => (
        <button
          key={reaction.stickerId}
          type="button"
          onClick={() => reactToPost.mutate({ postId, stickerId: reaction.stickerId })}
          disabled={reactToPost.isPending}
          className="flex h-6 shrink-0 items-center gap-1 rounded-lg bg-gray-50 px-[6px] py-[2px] disabled:opacity-60"
        >
          <img src={toImageUrl(reaction.imageUrl)} alt="" className="h-5 w-[17px] shrink-0 object-contain" />
          <span className="typo-body-xs text-purple-400">{reaction.count}</span>
        </button>
      ))}
    </>
  )
}
