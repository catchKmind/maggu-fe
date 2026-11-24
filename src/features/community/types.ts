import type { StickerReactionItem } from './api/posts.types'

export interface CommunityAuthor {
  id: string
  name: string
  avatarUrl?: string
}

export type CommunityFeedTab = 'recommended' | 'question'
/** 서버 sort 파라미터 값 그대로 (latest / most_scrapped) */
export type CommunitySortOrder = 'latest' | 'most_scrapped'

export interface PostLocation {
  lat: number
  lng: number
  placeName: string
  source: 'AUTO' | 'MANUAL'
  /** 관광지 검색으로 고른 경우의 관광공사 콘텐츠 ID. 지도 장소 시트와 게시글을 연결하는 데 쓰인다. */
  tourismContentId?: string
}

export interface CommunityPost {
  id: string
  author: CommunityAuthor
  createdAgo: string
  content: string
  photos: string[]
  stickerReactions: StickerReactionItem[]
  participantCount: number
  commentCount: number
  scrapCount: number
  scrappedByMe: boolean
}
