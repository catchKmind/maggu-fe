import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '../api/posts'

/** 내 게시글 삭제. 성공하면 게시글이 보이던 목록(피드·검색·장소별 피드)을 다시 불러온다. */
export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: (_result, postId) => {
      queryClient.removeQueries({ queryKey: ['postDetail', postId] })
      queryClient.invalidateQueries({ queryKey: ['communityFeed'] })
      queryClient.invalidateQueries({ queryKey: ['searchPosts'] })
      queryClient.invalidateQueries({ queryKey: ['contentFeed'] })
      queryClient.invalidateQueries({ queryKey: ['mapPosts'] })
    },
  })
}
