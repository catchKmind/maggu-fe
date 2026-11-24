import { api, type ApiResponse } from '../../../shared/lib/api'
import { toQueryString } from '../../../shared/lib/queryString'
import type { GetMyActivityParams, MyCommentListResponse, MyPostListResponse } from './myActivity.types'

const MY_POSTS_PATH = '/api/v1/mypage/posts'
const MY_COMMENTS_PATH = '/api/v1/mypage/comments'

// 내가 쓴 글 목록 (최신순, 삭제된 글 제외)
export function getMyPosts(params: GetMyActivityParams = {}) {
  return api.get<ApiResponse<MyPostListResponse>>(`${MY_POSTS_PATH}${toQueryString(params)}`).then((res) => res.data)
}

// 내가 쓴 댓글/답글 목록 (최신순, 삭제된 댓글·삭제된 글에 단 댓글 제외)
export function getMyComments(params: GetMyActivityParams = {}) {
  return api.get<ApiResponse<MyCommentListResponse>>(`${MY_COMMENTS_PATH}${toQueryString(params)}`).then((res) => res.data)
}
