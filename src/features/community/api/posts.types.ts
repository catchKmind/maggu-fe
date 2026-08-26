export type PostCategory = 'CURATION' | 'INFO' | 'RECOMMEND'
export type LocationSource = 'AUTO' | 'MANUAL'

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
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
