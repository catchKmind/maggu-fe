
//커뮤니티 내 댓글
export interface CommentResponse {
  commentId: number
  writerNickname: string
  content: string
  likeCount: number
  likedByMe: boolean
  createdAt: string
  replies: CommentResponse[]
  postWriter: boolean
}

export interface CommentCreateRequest {
  content: string
  parentCommentId?: number
}

export interface CommentCreateResponse {
  commentId: number
  parentCommentId?: number
}

export interface CommentLikeResponse {
  commentId: number
  liked: boolean
}

export interface StickerReactionRequest {
  stickerId: number
}

export interface StickerReactionResponse {
  postId: number
  myReactionSticker: string
}
