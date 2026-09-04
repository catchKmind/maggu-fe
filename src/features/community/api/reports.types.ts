export type ReportReason = 'HATE' | 'HARASSMENT' | 'INAPPROPRIATE'

export interface ReportCreateRequest {
  reason: ReportReason
  postId?: number
  commentId?: number
}

export interface ReportResponse {
  postId?: number
  commentId?: number
  reported: boolean
  autoHidden: boolean
}
