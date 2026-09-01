import { formatRelativeTime } from '../../../shared/lib/formatRelativeTime'
import type { PostSummaryResponse } from '../api/posts.types'
import type { CommunityPost } from '../types'

export function toCommunityPost(summary: PostSummaryResponse): CommunityPost {
  return {
    id: String(summary.postId),
    author: {
      id: summary.writerNickname,
      name: summary.writerNickname,
    },
    createdAgo: formatRelativeTime(summary.createdAt),
    content: summary.content,
    photos: summary.imageUrls,
    participantCount: summary.reactionCount,
    commentCount: summary.commentCount,
    scrapCount: summary.scrapCount,
  }
}
