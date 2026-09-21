import { useQuery } from '@tanstack/react-query'
import { searchMapPosts } from '../api/mapSearch'
import type { FeedSort } from '../api/mapSearch.types'

export function useSearchMapPosts(keyword: string | null, feedSort: FeedSort) {
  return useQuery({
    queryKey: ['searchMapPosts', keyword, feedSort],
    queryFn: () => searchMapPosts({ keyword: keyword as string, feedSort }),
    enabled: keyword !== null && keyword.length > 0,
  })
}
