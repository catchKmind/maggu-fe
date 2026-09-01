export interface CommunityAuthor {
  id: string
  name: string
  avatarUrl?: string
}

export type CommunityFeedTab = 'recommended' | 'question'
export type CommunitySortOrder = 'latest' | 'scrap'

export interface CommunityPost {
  id: string
  author: CommunityAuthor
  createdAgo: string
  content: string
  photos: string[]
  participantCount: number
  commentCount: number
  scrapCount: number
}
