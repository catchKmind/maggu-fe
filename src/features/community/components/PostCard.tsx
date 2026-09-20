import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../../../shared/components/Avatar'
import { useToggleScrap } from '../hooks/useToggleScrap'
import type { CommunityPost } from '../types'
import { PostPhotoGrid } from './PostPhotoGrid'
import { PostMenu } from './PostMenu'
import { StickerReactionPicker } from './StickerReactionPicker'

const TRUNCATE_THRESHOLD = 70

function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 8.2a5.5 5.5 0 1 1 2.3 4.4L2.5 13.5l.9-2.8a5.4 5.4 0 0 1-.9-2.5Z"
        stroke="#A3A3A3"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 2.5h8v11l-4-2.8-4 2.8v-11Z"
        stroke={filled ? '#5b6cff' : '#A3A3A3'}
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill={filled ? '#5b6cff' : 'none'}
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
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-13 text-gray-400">{count}</span>
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
  const canTruncate = post.content.length > TRUNCATE_THRESHOLD
  const postId = Number(post.id)
  const toggleScrap = useToggleScrap()

  const handleToggleScrap = () => {
    toggleScrap.mutate({ postId, scrapped: post.scrappedByMe })
  }

  const goToDetail = () => navigate(`/community/posts/${postId}`)

  return (
    <article className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={post.author.name} avatarUrl={post.author.avatarUrl} size={32} />
          <span className="text-14 font-semibold text-gray-900">{post.author.name}</span>
          <span className="text-13 text-gray-400">{post.createdAgo}</span>
        </div>
        <PostMenu postId={postId} />
      </div>

      <div onClick={goToDetail} className="cursor-pointer">
        <p className={`text-14 whitespace-pre-line text-gray-700 ${!isExpanded && canTruncate ? 'line-clamp-2' : ''}`}>
          {post.content}
        </p>
        {canTruncate && !isExpanded && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(true)
            }}
            className="text-13 text-gray-400"
          >
            {t('readMore')}
          </button>
        )}
      </div>

      <div onClick={goToDetail} className="cursor-pointer">
        <PostPhotoGrid photos={post.photos} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stat icon={<Avatar name={post.author.name} avatarUrl={post.author.avatarUrl} size={16} />} count={post.participantCount} />
          <StickerReactionPicker postId={postId} />
        </div>
        <div className="flex items-center gap-3">
          <Stat icon={<CommentIcon />} count={post.commentCount} />
          <button
            type="button"
            onClick={handleToggleScrap}
            disabled={toggleScrap.isPending}
            aria-label={t(post.scrappedByMe ? 'unscrap' : 'scrap')}
            className="flex items-center gap-1 disabled:opacity-50"
          >
            <BookmarkIcon filled={post.scrappedByMe} />
            <span className="text-13 text-gray-400">{post.scrapCount}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
