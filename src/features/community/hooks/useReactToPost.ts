import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reactToPost } from '../api/comments'

export function useReactToPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, stickerId }: { postId: number; stickerId: number }) =>
      reactToPost(postId, { stickerId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityFeed'] })
    },
  })
}
