import { useQuery } from '@tanstack/react-query'
import { getPostShare } from '../api/posts'

/**
 * 게시글 공유 링크. 메뉴를 열 때 미리 받아 둔다.
 * 공유창(navigator.share)은 버튼을 누른 순간에 바로 불려야 해서(서버 응답을 기다린 뒤에 부르면
 * iOS Safari·웹뷰가 거절한다), 누르기 전에 링크를 준비해 둬야 한다.
 */
export function useShareUrl(postId: number, enabled: boolean) {
  return useQuery({
    queryKey: ['postShare', postId],
    queryFn: () => getPostShare(postId),
    enabled,
    staleTime: 5 * 60 * 1000,
  })
}
