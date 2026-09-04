import { api, type ApiResponse } from '../../../shared/lib/api'
import type {
  CommentCreateRequest,
  CommentCreateResponse,
  CommentLikeResponse,
  CommentResponse,
  StickerReactionRequest,
  StickerReactionResponse,
} from './comments.types'

const postCommentsPath = (postId: number) => `/api/v1/community/posts/${postId}/comments`

export function getComments(postId: number) {
  return api.get<ApiResponse<CommentResponse[]>>(postCommentsPath(postId)).then((res) => res.data)
}

export function createComment(postId: number, body: CommentCreateRequest) {
  return api.post<ApiResponse<CommentCreateResponse>>(postCommentsPath(postId), body).then((res) => res.data)
}

export function toggleCommentLike(postId: number, commentId: number) {
  return api
    .post<ApiResponse<CommentLikeResponse>>(`${postCommentsPath(postId)}/${commentId}/like`)
    .then((res) => res.data)
}

export function reactToPost(postId: number, body: StickerReactionRequest) {
  return api
    .post<ApiResponse<StickerReactionResponse>>(`/api/v1/community/posts/${postId}/reactions`, body)
    .then((res) => res.data)
}
