import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment } from '../api/comments'
import type { CommentCreateRequest } from '../api/comments.types'

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CommentCreateRequest) => createComment(postId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}
