import { useQuery } from '@tanstack/react-query'
import { getFeedByContentId } from '../../community/api/posts'
import type { FeedSort } from '../../community/api/posts.types'

export function useContentFeed(contentId: string | null, feedSort: FeedSort) {
  return useQuery({
    queryKey: ['contentFeed', contentId, feedSort],
    queryFn: () => getFeedByContentId({ contentId: contentId as string, feedSort }),
    enabled: contentId !== null,
  })
}
