import type { TourContentType } from './mapSpots.types'

export type FeedSort = 'POPULAR' | 'LATEST'

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
