import { useState } from 'react'
import { CommunityHeader } from '../features/community/components/CommunityHeader'
import { FeedTabs } from '../features/community/components/FeedTabs'
import { SortMenu } from '../features/community/components/SortMenu'
import { SearchIconButton } from '../features/community/components/SearchIconButton'
import { PostCard } from '../features/community/components/PostCard'
import { MOCK_COMMUNITY_POSTS, MOCK_CURRENT_USER } from '../features/community/mocks/posts'
import type { CommunityFeedTab, CommunitySortOrder } from '../features/community/types'
import { BottomNavigation } from '../shared/components/BottomNavigation'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<CommunityFeedTab>('recommended')
  const [sortOrder, setSortOrder] = useState<CommunitySortOrder>('latest')

  return (
    <div className="relative flex flex-1 flex-col">
      <CommunityHeader author={MOCK_CURRENT_USER} />

      <div className="flex items-center justify-between px-5 pb-3">
        <FeedTabs activeTab={activeTab} onChange={setActiveTab} />
        <div className="flex items-center gap-2">
          <SortMenu value={sortOrder} onChange={setSortOrder} />
          <SearchIconButton />
        </div>
      </div>

      <div className="pb-[120px]">
        {MOCK_COMMUNITY_POSTS.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-[35px] z-20 mx-auto flex w-full max-w-[430px] justify-center">
        <BottomNavigation />
      </div>
    </div>
  )
}
