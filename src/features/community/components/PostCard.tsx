import { useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../../../shared/components/Avatar'
import { useToggleScrap } from '../hooks/useToggleScrap'
import type { CommunityPost } from '../types'
import { PostPhotoGrid } from './PostPhotoGrid'
import { PostMenu } from './PostMenu'
import { StickerReactionPicker } from './StickerReactionPicker'

function CommentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 8.2a5.5 5.5 0 1 1 2.3 4.4L2.5 13.5l.9-2.8a5.4 5.4 0 0 1-.9-2.5Z"
        stroke="var(--color-icon-muted)"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 2.5h8v11l-4-2.8-4 2.8v-11Z"
        stroke={filled ? 'var(--color-gray-800)' : 'var(--color-icon-muted)'}
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill={filled ? 'var(--color-gray-800)' : 'none'}
      />
    </svg>
  )
}

interface StatProps {
  icon: React.ReactNode
  count: number
}

function Stat({ icon, count }: StatProps) {
  return (
    <div className="flex items-center gap-[2px]">
      {icon}
      <span className="typo-body-s text-gray-400">{count}</span>
    </div>
  )
}

interface PostCardProps {
  post: CommunityPost
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation('community')
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  // 본문은 3줄까지만 보여준다. 글자 수가 아니라 실제로 3줄을 넘어 잘렸는지를 재서 '더보기'를 띄운다.
  const contentRef = useRef<HTMLParagraphElement>(null)
  const [isClamped, setIsClamped] = useState(false)

  useLayoutEffect(() => {
    const element = contentRef.current
    if (!element || isExpanded) return
    const measure = () => setIsClamped(element.scrollHeight > element.clientHeight + 1)
    measure()
    // 화면 폭이 바뀌면 줄 수도 바뀌므로 다시 잰다.
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [post.content, isExpanded])
  const postId = Number(post.id)
  const toggleScrap = useToggleScrap()

  const handleToggleScrap = () => {
    toggleScrap.mutate({ postId, scrapped: post.scrappedByMe })
  }

  const goToDetail = () => navigate(`/community/posts/${postId}`)

  return (
    <article className="flex flex-col border-b border-gray-200 px-4 pt-[18px] pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={post.author.name} avatarUrl={post.author.avatarUrl} size={32} />
          <div className="flex items-center gap-[6px]">
            <span className="text-12 leading-[19px] font-medium tracking-[-0.48px] text-gray-900">{post.author.name}</span>
            <span className="text-14 leading-[19px] tracking-[-0.48px] text-gray-400">{post.createdAgo}</span>
          </div>
        </div>
        <PostMenu postId={postId} />
      </div>

      <div onClick={goToDetail} className="mt-[6px] cursor-pointer">
        <p
          ref={contentRef}
          className={`text-14 leading-[1.4] tracking-[-0.48px] whitespace-pre-line wrap-anywhere text-gray-900 ${isExpanded ? '' : 'line-clamp-3'}`}
        >
          {post.content}
        </p>
        {isClamped && !isExpanded && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(true)
            }}
            className="mt-1 text-14 leading-[1.4] tracking-[-0.48px] text-gray-400"
          >
            {t('readMore')}
          </button>
        )}
      </div>

      {post.photos.length > 0 && (
        <div onClick={goToDetail} className="mt-[10px] cursor-pointer">
          <PostPhotoGrid photos={post.photos} />
        </div>
      )}

      <div className="mt-[18px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stat icon={<Avatar name={post.author.name} avatarUrl={post.author.avatarUrl} size={16} />} count={post.participantCount} />
          <StickerReactionPicker postId={postId} />
        </div>
        <div className="flex items-center gap-2">
          <Stat icon={<CommentIcon />} count={post.commentCount} />
          <button
            type="button"
            onClick={handleToggleScrap}
            disabled={toggleScrap.isPending}
            aria-label={t(post.scrappedByMe ? 'unscrap' : 'scrap')}
            className="flex items-center gap-1 disabled:opacity-50"
          >
            <BookmarkIcon filled={post.scrappedByMe} />
            <span className={`typo-body-s ${post.scrappedByMe ? 'text-gray-800' : 'text-gray-400'}`}>{post.scrapCount}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
