import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../shared/components/Avatar'
import { formatRelativeTime } from '../shared/lib/formatRelativeTime'
import { PostPhotoGrid } from '../features/community/components/PostPhotoGrid'
import { PostMenu } from '../features/community/components/PostMenu'
import { StickerReactionPicker } from '../features/community/components/StickerReactionPicker'
import { CommentItem } from '../features/community/components/CommentItem'
import { usePostDetail } from '../features/community/hooks/usePostDetail'
import { useComments } from '../features/community/hooks/useComments'
import { useCreateComment } from '../features/community/hooks/useCreateComment'
import { useToggleCommentLike } from '../features/community/hooks/useToggleCommentLike'
import { useToggleScrap } from '../features/community/hooks/useToggleScrap'
import { useSharePost } from '../features/community/hooks/useSharePost'
import type { CommentResponse } from '../features/community/api/comments.types'

function countComments(comments: CommentResponse[]): number {
  return comments.reduce((sum, comment) => sum + 1 + countComments(comment.replies), 0)
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 4.5 6 11l6.5 6.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.5 5.5a1.8 1.8 0 1 0-1.7-2.4L5.4 5.6a1.8 1.8 0 0 0 0 2.8l4.4 2.5a1.8 1.8 0 1 0 .6-1l-4-2.3a1.8 1.8 0 0 0 0-.2l4-2.3c.3.2.7.4 1.1.4Z"
        stroke="#374151"
        strokeWidth="1.1"
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

export default function CommunityPostDetailPage() {
  const { t } = useTranslation('community')
  const navigate = useNavigate()
  const { postId: postIdParam } = useParams<{ postId: string }>()
  const postId = Number(postIdParam)

  const { data: post, isLoading, isError } = usePostDetail(postId)
  const { data: comments } = useComments(postId)
  const createComment = useCreateComment(postId)
  const toggleLike = useToggleCommentLike(postId)
  const toggleScrap = useToggleScrap()
  const sharePost = useSharePost()

  const [commentText, setCommentText] = useState('')
  const [replyTarget, setReplyTarget] = useState<CommentResponse | null>(null)
  const [isLinkCopied, setIsLinkCopied] = useState(false)

  const handleShare = async () => {
    const result = await sharePost.mutateAsync(postId)
    if (navigator.share) {
      try {
        await navigator.share({ url: result.url })
      } catch {
        // 사용자가 공유 취소 - 별도 처리 없음
      }
      return
    }
    await navigator.clipboard.writeText(result.url)
    setIsLinkCopied(true)
    setTimeout(() => setIsLinkCopied(false), 2000)
  }

  const handleSubmitComment = () => {
    const content = commentText.trim()
    if (!content) return

    createComment.mutate(
      { content, parentCommentId: replyTarget?.commentId },
      {
        onSuccess: () => {
          setCommentText('')
          setReplyTarget(null)
        },
      },
    )
  }

  const totalReactions = post ? Object.values(post.stickerReactionCounts).reduce((sum, count) => sum + count, 0) : 0
  const totalComments = comments ? countComments(comments) : 0

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={t('searchPage.back')}
          className="flex h-9 w-9 items-center justify-center"
        >
          <BackIcon />
        </button>
        {post && (
          <div className="flex items-center gap-1">
            {isLinkCopied && <span className="text-13 text-gray-400">{t('postDetail.linkCopied')}</span>}
            <button
              type="button"
              onClick={handleShare}
              disabled={sharePost.isPending}
              aria-label={t('postDetail.share')}
              className="flex h-9 w-9 items-center justify-center"
            >
              <ShareIcon />
            </button>
            <PostMenu postId={postId} />
          </div>
        )}
      </div>

      {isLoading && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.loading')}</p>}
      {isError && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.error')}</p>}

      {post && (
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="flex flex-col gap-3 px-5 py-4">
            <div className="flex items-center gap-2">
              <Avatar name={post.writerNickname} size={36} />
              <div className="flex flex-col">
                <span className="text-15 font-semibold text-gray-900">{post.writerNickname}</span>
                <span className="text-13 text-gray-400">{formatRelativeTime(post.createdAt)}</span>
              </div>
            </div>

            <p className="text-15 whitespace-pre-line text-gray-800">{post.content}</p>

            <PostPhotoGrid photos={post.imageUrls} />

            {post.placeName && <p className="text-13 text-gray-400">📍 {post.placeName}</p>}

            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-1">
                <StickerReactionPicker postId={postId} />
                <span className="text-13 text-gray-400">{totalReactions}</span>
              </div>
              <button
                type="button"
                onClick={() => toggleScrap.mutate({ postId, scrapped: post.scrappedByMe })}
                disabled={toggleScrap.isPending}
                className="flex items-center gap-1 disabled:opacity-50"
              >
                <BookmarkIcon filled={post.scrappedByMe} />
                <span className="text-13 text-gray-400">{post.scrapCount}</span>
              </button>
              <span className="text-13 text-gray-400">{t('postDetail.commentCount', { count: totalComments })}</span>
            </div>
          </div>

          <div className="flex flex-col px-5">
            {comments?.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                onReply={setReplyTarget}
                onToggleLike={(commentId) => toggleLike.mutate(commentId)}
              />
            ))}
            {comments && comments.length === 0 && (
              <p className="py-8 text-center text-14 text-gray-400">{t('postDetail.noComments')}</p>
            )}
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col border-t border-gray-100 bg-white px-4 py-3">
        {replyTarget && (
          <div className="mb-2 flex items-center justify-between">
            <span className="text-13 text-gray-400">
              {t('postDetail.replyingTo', { name: replyTarget.writerNickname })}
            </span>
            <button type="button" onClick={() => setReplyTarget(null)} className="text-13 text-gray-400">
              {t('postDetail.cancelReply')}
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t('postDetail.commentPlaceholder')}
            className="h-11 flex-1 rounded-full bg-gray-50 px-4 text-14 text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || createComment.isPending}
            className="shrink-0 rounded-full bg-purple-500 px-4 py-2.5 text-14 font-semibold text-white disabled:opacity-40"
          >
            {t('postDetail.send')}
          </button>
        </div>
      </div>
    </div>
  )
}
