import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleCommentLike } from '../api/comments'

export function useToggleCommentLike(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: number) => toggleCommentLike(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}
