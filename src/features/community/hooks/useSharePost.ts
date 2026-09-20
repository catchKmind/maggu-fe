import { useMutation } from '@tanstack/react-query'
import { getPostShare } from '../api/posts'

export function useSharePost() {
  return useMutation({
    mutationFn: (postId: number) => getPostShare(postId),
  })
}
