import type { TourContentType } from './mapSpots.types'

/** 서버 feedSort 값 그대로: 스크랩 많은순 / 최신순 */
export type FeedSort = 'most_scrapped' | 'latest'

export interface CursorPageResponse<T> {
  content: T[]
  nextCursor: string | null
  hasNext: boolean
}

export interface PostFeedItemResponse {
  postId: number
  imageUrl: string
}

export interface SearchMapPostsParams {
  keyword: string
  feedSort: FeedSort
  cursor?: string
  size?: number
}

export interface AutocompleteCandidateResponse {
  contentId: string
  contentType: TourContentType
  title: string
}
