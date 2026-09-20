import { useQuery } from '@tanstack/react-query'
import { getPostDetail } from '../api/posts'

export function usePostDetail(postId: number) {
  return useQuery({
    queryKey: ['postDetail', postId],
    queryFn: () => getPostDetail(postId),
  })
}
