import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CommunityHeader } from '../features/community/components/CommunityHeader'
import { FeedTabs } from '../features/community/components/FeedTabs'
import { SortMenu } from '../features/community/components/SortMenu'
import { SearchIconButton } from '../features/community/components/SearchIconButton'
import { PostCard } from '../features/community/components/PostCard'
import { MOCK_CURRENT_USER } from '../features/community/mocks/posts'
import { useCommunityFeed } from '../features/community/hooks/useCommunityFeed'
import { toCommunityPost } from '../features/community/mappers/toCommunityPost'
import type { CommunityFeedTab, CommunitySortOrder } from '../features/community/types'
import { BottomNavigation } from '../shared/components/BottomNavigation'

export default function CommunityPage() {
  const { t } = useTranslation('community')
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<CommunityFeedTab>('recommended')
  const [sortOrder, setSortOrder] = useState<CommunitySortOrder>('latest')
  const { data, isLoading, isError } = useCommunityFeed({ sort: sortOrder })
  const posts = data?.content.map(toCommunityPost) ?? []

  return (
    <div className="relative flex flex-1 flex-col">
      <CommunityHeader author={MOCK_CURRENT_USER} />

      <div className="flex items-center justify-between px-5 pb-3">
        <FeedTabs activeTab={activeTab} onChange={setActiveTab} />
        <div className="flex items-center gap-2">
          <SortMenu value={sortOrder} onChange={setSortOrder} />
          <SearchIconButton onClick={() => navigate('/community/search')} />
        </div>
      </div>

      <div className="pb-[120px]">
        {isLoading && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.loading')}</p>}
        {isError && <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.error')}</p>}
        {!isLoading && !isError && posts.length === 0 && (
          <p className="px-5 py-8 text-center text-14 text-gray-400">{t('feed.empty')}</p>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-[35px] z-20 mx-auto flex w-full max-w-[430px] justify-center">
        <BottomNavigation />
      </div>
    </div>
  )
}
