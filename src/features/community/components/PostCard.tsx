import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CommunityPost } from '../types'
import { PostPhotoGrid } from './PostPhotoGrid'

const TRUNCATE_THRESHOLD = 70

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="4" cy="9" r="1.2" fill="#A3A3A3" />
      <circle cx="9" cy="9" r="1.2" fill="#A3A3A3" />
      <circle cx="14" cy="9" r="1.2" fill="#A3A3A3" />
    </svg>
  )
}

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

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 2.5h8v11l-4-2.8-4 2.8v-11Z" stroke="#A3A3A3" strokeWidth="1.3" strokeLinejoin="round" />
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
  const [isExpanded, setIsExpanded] = useState(false)
  const canTruncate = post.content.length > TRUNCATE_THRESHOLD

  return (
    <article className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={post.author.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-14 font-semibold text-gray-900">{post.author.name}</span>
          <span className="text-13 text-gray-400">{post.createdAgo}</span>
        </div>
        <button type="button" aria-label={t('postMenu')} className="flex h-6 w-6 items-center justify-center">
          <MoreIcon />
        </button>
      </div>

      <div>
        <p className={`text-14 whitespace-pre-line text-gray-700 ${!isExpanded && canTruncate ? 'line-clamp-2' : ''}`}>
          {post.content}
        </p>
        {canTruncate && !isExpanded && (
          <button type="button" onClick={() => setIsExpanded(true)} className="text-13 text-gray-400">
            {t('readMore')}
          </button>
        )}
      </div>

      <PostPhotoGrid photos={post.photos} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stat icon={<img src={post.author.avatarUrl} alt="" className="h-4 w-4 rounded-full object-cover" />} count={post.participantCount} />
          <StickerIcon />
        </div>
        <div className="flex items-center gap-3">
          <Stat icon={<CommentIcon />} count={post.commentCount} />
          <Stat icon={<BookmarkIcon />} count={post.scrapCount} />
        </div>
      </div>
    </article>
  )
}
