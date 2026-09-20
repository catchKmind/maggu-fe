import { useQuery } from '@tanstack/react-query'
import { searchPosts } from '../api/posts'

export function useSearchPosts(keyword: string | null, sort?: string) {
  return useQuery({
    queryKey: ['searchPosts', keyword, sort],
    queryFn: () => searchPosts({ keyword: keyword as string, sort }),
    enabled: keyword !== null && keyword.length > 0,
  })
}
