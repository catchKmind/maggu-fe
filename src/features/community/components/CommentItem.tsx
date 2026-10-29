import { useTranslation } from 'react-i18next'
import { Avatar } from '../../../shared/components/Avatar'
import { formatRelativeTime } from '../../../shared/lib/formatRelativeTime'
import { CommentMenu } from './CommentMenu'
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

function CommentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5-2.7 5.5-6 5.5c-.7 0-1.4-.1-2-.3L3 14l.8-2.7C2.7 10.3 2 9.2 2 8Z"
        stroke="#A3A3A3"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ReplyConnectorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M4 2v6a2 2 0 0 0 2 2h8" stroke="#D4D4D4" strokeWidth="1.3" strokeLinecap="round" />
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
    <div className="flex items-start gap-1 py-3">
      {depth > 0 && <ReplyConnectorIcon />}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <Avatar name={comment.writerNickname} size={28} />
          <span className="text-14 font-semibold text-gray-900">{comment.writerNickname}</span>
          <span className="text-13 text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
          {comment.postWriter && <span className="text-13 text-gray-400">· {t('postDetail.author')}</span>}
          <div className="ml-auto">
            <CommentMenu commentId={comment.commentId} />
          </div>
        </div>

        <p className="text-14 whitespace-pre-line text-gray-700">{comment.content}</p>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => onToggleLike(comment.commentId)} className="flex items-center gap-1">
            <HeartIcon filled={comment.likedByMe} />
            <span className="text-13 text-gray-400">{comment.likeCount}</span>
          </button>
          <button type="button" onClick={() => onReply(comment)} className="flex items-center gap-1">
            <CommentIcon />
            <span className="text-13 text-gray-400">{comment.replies.length}</span>
          </button>
        </div>

        {comment.replies.map((reply) => (
          <CommentItem key={reply.commentId} comment={reply} depth={depth + 1} onReply={onReply} onToggleLike={onToggleLike} />
        ))}
      </div>
    </div>
  )
}
