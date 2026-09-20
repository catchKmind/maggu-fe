import { useQuery } from '@tanstack/react-query'
import { searchMapPosts } from '../api/mapSearch'
import type { FeedSort } from '../../community/api/posts.types'

const DEFAULT_FEED_SORT: FeedSort = 'LATEST'

export function useSearchMapPosts(keyword: string | null, feedSort: FeedSort = DEFAULT_FEED_SORT) {
  return useQuery({
    queryKey: ['searchMapPosts', keyword, feedSort],
    queryFn: () => searchMapPosts({ keyword: keyword as string, feedSort }),
    enabled: keyword !== null && keyword.length > 0,
  })
}
