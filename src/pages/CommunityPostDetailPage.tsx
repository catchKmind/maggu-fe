import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import sendIcon from '../assets/community/icon_community_send.svg'
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
      <path d="M12.5 4.5 6 11l6.5 6.5" stroke="var(--color-icon-default)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5-2.7 5.5-6 5.5c-.7 0-1.4-.1-2-.3L3 14l.8-2.7C2.7 10.3 2 9.2 2 8Z"
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
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)]">
      <div className="flex h-14 items-center gap-1 border-b border-[#eeeeee] px-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={t('searchPage.back')}
          className="flex size-6 items-center justify-center"
        >
          <BackIcon />
        </button>
        <span className="typo-body-l-bold text-gray-700">{t('postDetail.pageTitle')}</span>
        {isLinkCopied && <span className="ml-auto text-13 text-gray-400">{t('postDetail.linkCopied')}</span>}
      </div>

      {isLoading && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.loading')}</p>}
      {isError && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.error')}</p>}

      {post && (
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="border-b border-gray-200">
            <div className="flex flex-col px-4 pt-[18px] pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={post.writerNickname} size={32} />
                  <div className="flex items-center gap-[6px]">
                    <span className="text-12 leading-[19px] font-medium tracking-[-0.48px] text-gray-900">{post.writerNickname}</span>
                    <span className="text-14 leading-[19px] tracking-[-0.48px] text-gray-400">{formatRelativeTime(post.createdAt)}</span>
                  </div>
                </div>
                <PostMenu postId={postId} onShare={handleShare} />
              </div>

              <p className="mt-[6px] text-14 leading-[1.4] tracking-[-0.48px] whitespace-pre-line wrap-anywhere text-gray-900">
                {post.content}
              </p>

              {post.imageUrls.length > 0 && (
                <div className="mt-[10px]">
                  <PostPhotoGrid photos={post.imageUrls} />
                </div>
              )}

              <div className="mt-[18px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {totalReactions > 0 && (
                    <div className="flex h-6 items-center gap-1 rounded-lg bg-gray-50 px-[6px] py-[2px]">
                      <span className="text-14">✨</span>
                      <span className="typo-body-xs text-purple-400">{totalReactions}</span>
                    </div>
                  )}
                  <StickerReactionPicker postId={postId} />
                </div>
                <div className="mr-[11px] flex items-center gap-2">
                  <div className="flex items-center gap-[2px] text-gray-400">
                    <CommentIcon />
                    <span className="typo-body-s">{totalComments}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleScrap.mutate({ postId, scrapped: post.scrappedByMe })}
                    disabled={toggleScrap.isPending}
                    className="flex items-center gap-[2px] disabled:opacity-50"
                  >
                    <BookmarkIcon filled={post.scrappedByMe} />
                    <span className={`typo-body-s ${post.scrappedByMe ? 'text-gray-800' : 'text-gray-400'}`}>{post.scrapCount}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col px-4">
            {comments?.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                onReply={setReplyTarget}
                onToggleLike={(commentId) => toggleLike.mutate(commentId)}
              />
            ))}
            {comments && comments.length === 0 && (
              <p className="pt-[68px] pb-8 text-center text-14 text-gray-400">{t('postDetail.noComments')}</p>
            )}
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[375px] flex-col bg-white px-4 py-[18px]">
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
        <div className="flex h-[46px] items-center gap-2 rounded-[18px] bg-gray-100 pr-2 pl-4">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t('postDetail.commentPlaceholder')}
            className="h-full min-w-0 flex-1 bg-transparent text-14 text-gray-900 outline-none placeholder:text-gray-400"
          />
          {commentText.trim() && (
            <button
              type="button"
              onClick={handleSubmitComment}
              disabled={createComment.isPending}
              aria-label={t('postDetail.send')}
              className="flex shrink-0 items-center justify-center disabled:opacity-40"
            >
              <img src={sendIcon} alt="" className="h-[30px] w-[30px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
