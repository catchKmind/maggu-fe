import { useQuery } from '@tanstack/react-query'
import { getComments } from '../api/comments'

export function useComments(postId: number) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  })
}
