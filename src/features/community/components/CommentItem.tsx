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
        stroke={filled ? 'var(--color-primary)' : 'var(--color-icon-muted)'}
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill={filled ? 'var(--color-primary)' : 'none'}
      />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5-2.7 5.5-6 5.5c-.7 0-1.4-.1-2-.3L3 14l.8-2.7C2.7 10.3 2 9.2 2 8Z"
        stroke="var(--color-icon-muted)"
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
  /** 작성자가 숨긴 댓글 번호들 */
  hiddenIds?: Set<number>
  /** 내가 이 게시글의 작성자라서 댓글을 숨길 수 있는지 */
  canHide?: boolean
  onToggleHide?: (commentId: number) => void
}

export function CommentItem({ comment, depth = 0, onReply, onToggleLike, hiddenIds, canHide = false, onToggleHide }: CommentItemProps) {
  const { t } = useTranslation('community')
  const isHidden = hiddenIds?.has(comment.commentId) ?? false

  return (
    <div className="flex items-start gap-1 py-3">
      {depth > 0 && <ReplyConnectorIcon />}
      <div className="flex flex-1 flex-col gap-2">
        {isHidden ? (
          // 숨긴 댓글은 내용 대신 안내 문구만 남긴다 (답글 구조와 댓글 수가 유지되도록 자리는 둔다)
          <div className="flex items-center justify-between gap-2 py-1">
            <p className="text-14 text-gray-400">{t('postDetail.hiddenComment')}</p>
            {canHide && (
              <button type="button" onClick={() => onToggleHide?.(comment.commentId)} className="text-13 text-gray-500 underline">
                {t('postDetail.unhideComment')}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Avatar name={comment.writerNickname} size={28} />
              <span className="text-14 font-semibold text-gray-900">{comment.writerNickname}</span>
              <span className="text-13 text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
              {comment.postWriter && <span className="text-13 text-gray-400">· {t('postDetail.author')}</span>}
              <div className="ml-auto">
                <CommentMenu commentId={comment.commentId} />
              </div>
            </div>

            <p className="text-14 whitespace-pre-line wrap-anywhere text-gray-700">{comment.content}</p>

            <div className="flex items-center gap-4">
              <button type="button" onClick={() => onToggleLike(comment.commentId)} className="flex items-center gap-1">
                <HeartIcon filled={comment.likedByMe} />
                <span className="text-13 text-gray-400">{comment.likeCount}</span>
              </button>
              <button type="button" onClick={() => onReply(comment)} className="flex items-center gap-1">
                <CommentIcon />
                <span className="text-13 text-gray-400">{comment.replies.length}</span>
              </button>
              {canHide && (
                <button type="button" onClick={() => onToggleHide?.(comment.commentId)} className="ml-auto text-13 text-gray-400">
                  {t('postDetail.hideComment')}
                </button>
              )}
            </div>
          </>
        )}

        {comment.replies.map((reply) => (
          <CommentItem
            key={reply.commentId}
            comment={reply}
            depth={depth + 1}
            onReply={onReply}
            onToggleLike={onToggleLike}
            hiddenIds={hiddenIds}
            canHide={canHide}
            onToggleHide={onToggleHide}
          />
        ))}
      </div>
    </div>
  )
}
