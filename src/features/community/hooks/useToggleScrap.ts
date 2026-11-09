import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scrapPost, unscrapPost } from '../api/scraps'
import type { PostDetailResponse } from '../api/posts.types'

interface ToggleScrapInput {
  postId: number
  scrapped: boolean
}

export function useToggleScrap() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, scrapped }: ToggleScrapInput) =>
      scrapped ? unscrapPost(postId) : scrapPost({ postId }),
    // 응답을 기다리지 않고 상세 화면의 북마크 아이콘·숫자를 먼저 바꾼다. 실패하면 되돌린다.
    onMutate: async ({ postId, scrapped }) => {
      const key = ['postDetail', postId]
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<PostDetailResponse>(key)
      if (previous) {
        queryClient.setQueryData<PostDetailResponse>(key, {
          ...previous,
          scrappedByMe: !scrapped,
          scrapCount: Math.max(0, previous.scrapCount + (scrapped ? -1 : 1)),
        })
      }
      return { previous }
    },
    onError: (_error, { postId }, context) => {
      if (context?.previous) queryClient.setQueryData(['postDetail', postId], context.previous)
    },
    // 스크랩 상태는 피드 / 게시글 상세 / 검색 결과에 모두 보이므로 전부 다시 불러온다.
    onSettled: (_data, _error, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['communityFeed'] })
      queryClient.invalidateQueries({ queryKey: ['postDetail', postId] })
      queryClient.invalidateQueries({ queryKey: ['searchPosts'] })
    },
  })
}
