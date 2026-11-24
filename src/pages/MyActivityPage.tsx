import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MyPageHeader } from '../features/mypage/components/MyPageHeader'
import { EmptyState } from '../features/mypage/components/EmptyState'
import { SegmentTab, SegmentTabs } from '../features/mypage/components/SegmentTab'
import { useMyComments, useMyPosts } from '../features/mypage/hooks/useMyActivity'
import { useLoadMoreOnVisible } from '../shared/hooks/useLoadMoreOnVisible'
import { toImageUrl } from '../shared/lib/imageUrl'
import documentIcon from '../assets/mypage/icon_document.svg'
import chatBubbleIcon from '../assets/mypage/icon_chat_bubble.svg'

export type ActivityTab = 'posts' | 'comments'

function formatDate(iso: string) {
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
}

export default function MyActivityPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: ActivityTab = searchParams.get('tab') === 'comments' ? 'comments' : 'posts'

  const changeTab = (next: ActivityTab) => setSearchParams({ tab: next }, { replace: true })

  // 두 탭의 글 수/댓글 수를 한꺼번에 보여줘야 해서 둘 다 불러온다 (응답에 두 개수가 모두 들어 있다)
  const postsQuery = useMyPosts()
  const commentsQuery = useMyComments()
  const posts = postsQuery.data?.pages.flatMap((page) => page.posts.content) ?? []
  const comments = commentsQuery.data?.pages.flatMap((page) => page.comments.content) ?? []
  const counts = postsQuery.data?.pages[0] ?? commentsQuery.data?.pages[0]

  const activeQuery = tab === 'posts' ? postsQuery : commentsQuery
  const loadMoreRef = useLoadMoreOnVisible(
    () => void activeQuery.fetchNextPage(),
    activeQuery.hasNextPage && !activeQuery.isFetchingNextPage,
  )

  return (
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)]">
      <MyPageHeader title={t('myPage.activity')} />

      <SegmentTabs>
        <SegmentTab label={t('myPage.tabPosts')} count={counts?.postCount} isActive={tab === 'posts'} onClick={() => changeTab('posts')} />
        <SegmentTab
          label={t('myPage.tabComments')}
          count={counts?.commentCount}
          isActive={tab === 'comments'}
          onClick={() => changeTab('comments')}
        />
      </SegmentTabs>

      {activeQuery.isLoading && <p className="px-5 py-8 text-center typo-body-m text-gray-400">{t('myPage.loading')}</p>}
      {activeQuery.isError && (
        <p className="px-5 py-8 text-center typo-body-m text-gray-400">{t('myPage.activityError')}</p>
      )}

      {tab === 'posts' &&
        postsQuery.isSuccess &&
        (posts.length === 0 ? (
          <EmptyState
            icon={documentIcon}
            title={t('myPage.emptyPostsTitle')}
            description={t('myPage.emptyPostsDescription')}
            actionLabel={t('myPage.writePost')}
            onAction={() => navigate('/community/write')}
          />
        ) : (
          <div className="grid grid-cols-2 gap-2 p-4">
            {posts.map((post) => (
              <button
                key={post.postId}
                type="button"
                onClick={() => navigate(`/community/posts/${post.postId}`)}
                className="h-[200px] overflow-hidden rounded-lg"
              >
                {post.imageUrl ? (
                  <img src={toImageUrl(post.imageUrl)} alt="" className="size-full object-cover" />
                ) : (
                  // 사진 없는 글은 본문을 2줄까지만 잘라서 보여준다
                  <span className="flex size-full items-center justify-center bg-purple-50 p-4">
                    <span className="line-clamp-2 text-center text-14 leading-[1.4] font-semibold tracking-[-0.28px] wrap-anywhere text-purple-500">
                      {post.content}
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}

      {tab === 'comments' &&
        commentsQuery.isSuccess &&
        (comments.length === 0 ? (
          <EmptyState icon={chatBubbleIcon} title={t('myPage.emptyCommentsTitle')} description={t('myPage.emptyCommentsDescription')} />
        ) : (
          <div className="flex flex-col">
            {comments.map((comment) => (
              <button
                key={comment.commentId}
                type="button"
                onClick={() => navigate(`/community/posts/${comment.postId}`)}
                className="flex flex-col gap-[6px] border-b border-gray-200 px-4 py-5 text-left"
              >
                <span className="flex w-full items-center gap-[6px]">
                  {comment.isReply && (
                    <span className="shrink-0 rounded-md border-[0.5px] border-purple-400 bg-purple-50 px-[6px] py-px typo-body-s text-purple-500">
                      {t('myPage.replyBadge')}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate text-14 leading-[1.4] tracking-[-0.48px] text-gray-800">
                    {comment.content}
                  </span>
                </span>
                <span className="flex items-center gap-[6px] typo-body-s">
                  <span className="truncate text-gray-500">
                    {t('myPage.commentOnPost', { nickname: comment.postWriterNickname })}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400">{formatDate(comment.createdAt)}</span>
                </span>
              </button>
            ))}
          </div>
        ))}

      {/* 맨 아래에 닿으면 다음 페이지를 불러온다 */}
      <div ref={loadMoreRef} className="h-px" />
      {activeQuery.isFetchingNextPage && (
        <p className="px-5 py-4 text-center typo-body-s text-gray-400">{t('myPage.loading')}</p>
      )}
    </div>
  )
}
