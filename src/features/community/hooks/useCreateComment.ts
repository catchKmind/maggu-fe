import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment } from '../api/comments'
import type { CommentCreateRequest } from '../api/comments.types'

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CommentCreateRequest) => createComment(postId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      // 내 활동의 댓글 목록과 개수도 바뀐다
      queryClient.invalidateQueries({ queryKey: ['myComments'] })
      queryClient.invalidateQueries({ queryKey: ['myPosts'] })
    },
  })
}
