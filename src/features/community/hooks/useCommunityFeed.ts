import { useQuery } from '@tanstack/react-query'
import { getFeed } from '../api/posts'
import type { GetFeedParams } from '../api/posts.types'

export function useCommunityFeed(params: GetFeedParams = {}) {
  return useQuery({
    queryKey: ['communityFeed', params],
    queryFn: () => getFeed(params),
  })
}
