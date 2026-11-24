import { useInfiniteQuery } from '@tanstack/react-query'
import { getMyComments, getMyPosts } from '../api/myActivity'

/** 내가 쓴 글. 스크롤하면 다음 페이지(cursor)를 이어서 불러온다 */
export function useMyPosts() {
  return useInfiniteQuery({
    queryKey: ['myPosts'],
    queryFn: ({ pageParam }) => getMyPosts({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.posts.hasNext ? (lastPage.posts.nextCursor ?? undefined) : undefined),
  })
}

/** 내가 쓴 댓글/답글 */
export function useMyComments() {
  return useInfiniteQuery({
    queryKey: ['myComments'],
    queryFn: ({ pageParam }) => getMyComments({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.comments.hasNext ? (lastPage.comments.nextCursor ?? undefined) : undefined,
  })
}
