export type PostCategory = 'CURATION' | 'INFO' | 'RECOMMEND' | 'QUESTION'
export type LocationSource = 'AUTO' | 'MANUAL'

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

/** 게시글에 달린 스티커 반응 하나 (같은 스티커로 공감한 수) */
export interface StickerReactionItem {
  stickerId: number
  imageUrl: string
  count: number
  reactedByMe: boolean
}

export interface PostSummaryResponse {
  postId: number
  slug: string
  writerNickname: string
  content: string
  imageUrls: string[]
  placeName: string
  category: PostCategory
  reactionCount: number
  reactedByMe: boolean
  stickerReactions: StickerReactionItem[]
  scrapCount: number
  commentCount: number
  scrappedByMe: boolean
  createdAt: string
}

export interface PostDetailResponse {
  postId: number
  slug: string
  writerNickname: string
  content: string
  imageUrls: string[]
  placeName: string
  latitude: number
  longitude: number
  tourismContentId: string
  category: PostCategory
  scrapCount: number
  scrappedByMe: boolean
  stickerReactionCounts: Record<string, number>
  myReactionSticker: string
  myReactionStickerId: number | null
  stickerReactions: StickerReactionItem[]
  createdAt: string
  updatedAt: string
}

export interface PostCreateRequest {
  content: string
  category: PostCategory
  imageUrls?: string[]
  placeName?: string
  tourismContentId?: string
  locationSource?: LocationSource
  latitude?: number
  longitude?: number
}

export interface PostCreateResponse {
  postId: number
  slug: string
}

export interface PostShareResponse {
  postId: number
  url: string
}

export interface PostDeleteResponse {
  postId: number
  deleted: boolean
}

export interface SearchAutocompleteResponse {
  keywords: string[]
}

export interface CurationResponse {
  title: string
  keyword: string
  posts: PostSummaryResponse[]
}

export interface GetFeedParams {
  category?: PostCategory
  sort?: string
  page?: number
  size?: number
}

export interface SearchPostsParams {
  keyword: string
  sort?: string
  page?: number
  size?: number
}

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

export interface GetFeedByContentIdParams {
  contentId: string
  feedSort: FeedSort
  cursor?: string
  size?: number
}
