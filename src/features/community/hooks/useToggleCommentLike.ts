import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleCommentLike } from '../api/comments'
import type { CommentResponse } from '../api/comments.types'

/** 댓글·대댓글 트리에서 해당 댓글의 공감 상태를 뒤집는다. */
function toggleLikeInTree(comments: CommentResponse[], commentId: number): CommentResponse[] {
  return comments.map((comment) => {
    if (comment.commentId === commentId) {
      return {
        ...comment,
        likedByMe: !comment.likedByMe,
        likeCount: Math.max(0, comment.likeCount + (comment.likedByMe ? -1 : 1)),
      }
    }
    return { ...comment, replies: toggleLikeInTree(comment.replies, commentId) }
  })
}

export function useToggleCommentLike(postId: number) {
  const queryClient = useQueryClient()
  const key = ['comments', postId]

  return useMutation({
    mutationFn: (commentId: number) => toggleCommentLike(postId, commentId),
    // 응답을 기다리지 않고 하트·숫자를 먼저 바꾼다. 실패하면 되돌린다.
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<CommentResponse[]>(key)
      if (previous) queryClient.setQueryData(key, toggleLikeInTree(previous, commentId))
      return { previous }
    },
    onError: (_error, _commentId, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key })
    },
  })
}
