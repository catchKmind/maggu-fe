import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MyPageHeader } from '../features/mypage/components/MyPageHeader'
import { EmptyState } from '../features/mypage/components/EmptyState'
import { SegmentTab, SegmentTabs } from '../features/mypage/components/SegmentTab'
import documentIcon from '../assets/mypage/icon_document.svg'
import chatBubbleIcon from '../assets/mypage/icon_chat_bubble.svg'

export type ActivityTab = 'posts' | 'comments'

interface MyPostItem {
  postId: number
  title: string
  thumbnailUrl: string | null
}

interface MyCommentItem {
  commentId: number
  postId: number
  content: string
  isReply: boolean
  postAuthorNickname: string
  createdAt: string
}

// TODO: '내가 쓴 글' / '내가 쓴 댓글' 조회 API가 아직 없음. 생기면 useQuery로 교체.
const MY_POSTS: MyPostItem[] = []
const MY_COMMENTS: MyCommentItem[] = []

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

  return (
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)]">
      <MyPageHeader title={t('myPage.activity')} />

      <SegmentTabs>
        <SegmentTab label={t('myPage.tabPosts')} count={MY_POSTS.length} isActive={tab === 'posts'} onClick={() => changeTab('posts')} />
        <SegmentTab
          label={t('myPage.tabComments')}
          count={MY_COMMENTS.length}
          isActive={tab === 'comments'}
          onClick={() => changeTab('comments')}
        />
      </SegmentTabs>

      {tab === 'posts' &&
        (MY_POSTS.length === 0 ? (
          <EmptyState
            icon={documentIcon}
            title={t('myPage.emptyPostsTitle')}
            description={t('myPage.emptyPostsDescription')}
            actionLabel={t('myPage.writePost')}
            onAction={() => navigate('/community/write')}
          />
        ) : (
          <div className="grid grid-cols-2 gap-2 p-4">
            {MY_POSTS.map((post) => (
              <button
                key={post.postId}
                type="button"
                onClick={() => navigate(`/community/posts/${post.postId}`)}
                className="h-[200px] overflow-hidden rounded-lg"
              >
                {post.thumbnailUrl ? (
                  <img src={post.thumbnailUrl} alt="" className="size-full object-cover" />
                ) : (
                  <span className="flex size-full items-center bg-purple-50 p-4 text-center text-14 leading-[1.4] font-semibold tracking-[-0.28px] text-purple-500">
                    {post.title}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}

      {tab === 'comments' &&
        (MY_COMMENTS.length === 0 ? (
          <EmptyState icon={chatBubbleIcon} title={t('myPage.emptyCommentsTitle')} description={t('myPage.emptyCommentsDescription')} />
        ) : (
          <div className="flex flex-col">
            {MY_COMMENTS.map((comment) => (
              <button
                key={comment.commentId}
                type="button"
                onClick={() => navigate(`/community/posts/${comment.postId}`)}
                className="flex flex-col gap-[6px] border-b border-gray-200 px-4 py-5 text-left"
              >
                <span className="flex w-full items-center gap-[6px]">
                  {comment.isReply && (
                    <span className="shrink-0 rounded-md border-[0.5px] border-purple-400 bg-purple-50 px-[6px] py-px text-12 leading-[18px] tracking-[-0.24px] text-purple-500">
                      {t('myPage.replyBadge')}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate text-14 leading-[1.4] tracking-[-0.48px] text-gray-800">
                    {comment.content}
                  </span>
                </span>
                <span className="flex items-center gap-[6px] text-12 leading-[18px] tracking-[-0.24px]">
                  <span className="truncate text-gray-500">
                    {t('myPage.commentOnPost', { nickname: comment.postAuthorNickname })}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400">{formatDate(comment.createdAt)}</span>
                </span>
              </button>
            ))}
          </div>
        ))}
    </div>
  )
}
