import { useInfiniteQuery } from '@tanstack/react-query'
import { getPlaceFolderScraps } from '../api/placeFolderScraps'

/** 리스트(폴더)에 저장한 장소들. 스크롤하면 다음 페이지(cursor)를 이어서 불러온다 */
export function usePlaceFolderScraps(placeFolderId: number | null) {
  return useInfiniteQuery({
    queryKey: ['placeFolderScraps', placeFolderId],
    queryFn: ({ pageParam }) => getPlaceFolderScraps(placeFolderId as number, { cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.placeScraps.hasNext ? (lastPage.placeScraps.nextCursor ?? undefined) : undefined,
    enabled: placeFolderId !== null && !Number.isNaN(placeFolderId),
  })
}
