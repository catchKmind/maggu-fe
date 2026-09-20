import { useTranslation } from 'react-i18next'
import { Avatar } from '../../../shared/components/Avatar'
import { formatRelativeTime } from '../../../shared/lib/formatRelativeTime'
import type { CommentResponse } from '../api/comments.types'

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 13.5S2 9.8 2 5.9A2.9 2.9 0 0 1 8 4.8a2.9 2.9 0 0 1 6 1.1c0 3.9-6 7.6-6 7.6Z"
        stroke={filled ? '#5b6cff' : '#A3A3A3'}
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill={filled ? '#5b6cff' : 'none'}
      />
    </svg>
  )
}

interface CommentItemProps {
  comment: CommentResponse
  depth?: number
  onReply: (comment: CommentResponse) => void
  onToggleLike: (commentId: number) => void
}

export function CommentItem({ comment, depth = 0, onReply, onToggleLike }: CommentItemProps) {
  const { t } = useTranslation('community')

  return (
    <div style={{ marginLeft: depth * 20 }} className="flex flex-col gap-2 border-b border-gray-50 py-3">
      <div className="flex items-center gap-2">
        <Avatar name={comment.writerNickname} size={28} />
        <span className="text-14 font-semibold text-gray-900">{comment.writerNickname}</span>
        {comment.postWriter && (
          <span className="rounded-full bg-purple-50 px-2 py-0.5 text-11 font-medium text-purple-500">
            {t('postDetail.author')}
          </span>
        )}
        <span className="text-13 text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
      </div>

      <p className="text-14 whitespace-pre-line text-gray-700">{comment.content}</p>

      <div className="flex items-center gap-4">
        <button type="button" onClick={() => onToggleLike(comment.commentId)} className="flex items-center gap-1">
          <HeartIcon filled={comment.likedByMe} />
          <span className="text-13 text-gray-400">{comment.likeCount}</span>
        </button>
        <button type="button" onClick={() => onReply(comment)} className="text-13 text-gray-400">
          {t('postDetail.reply')}
        </button>
      </div>

      {comment.replies.map((reply) => (
        <CommentItem key={reply.commentId} comment={reply} depth={depth + 1} onReply={onReply} onToggleLike={onToggleLike} />
      ))}
    </div>
  )
}
