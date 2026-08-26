import { api, type ApiResponse } from '../../../shared/lib/api'
import { toQueryString } from '../../../shared/lib/queryString'
import type {
  CurationResponse,
  GetFeedParams,
  PageResponse,
  PostCreateRequest,
  PostCreateResponse,
  PostDeleteResponse,
  PostDetailResponse,
  PostShareResponse,
  PostSummaryResponse,
  SearchAutocompleteResponse,
  SearchPostsParams,
} from './posts.types'

const POSTS_PATH = '/api/v1/community/posts'

export function getFeed(params: GetFeedParams = {}) {
  return api
    .get<ApiResponse<PageResponse<PostSummaryResponse>>>(`${POSTS_PATH}${toQueryString(params)}`)
    .then((res) => res.data)
}

export function createPost(body: PostCreateRequest) {
  return api.post<ApiResponse<PostCreateResponse>>(POSTS_PATH, body).then((res) => res.data)
}

export function getPostDetail(postId: number) {
  return api.get<ApiResponse<PostDetailResponse>>(`${POSTS_PATH}/${postId}`).then((res) => res.data)
}

export function deletePost(postId: number) {
  return api.delete<ApiResponse<PostDeleteResponse>>(`${POSTS_PATH}/${postId}`).then((res) => res.data)
}

export function getPostShare(postId: number) {
  return api.get<ApiResponse<PostShareResponse>>(`${POSTS_PATH}/${postId}/share`).then((res) => res.data)
}

export function searchPosts({ keyword, ...rest }: SearchPostsParams) {
  return api
    .get<ApiResponse<PageResponse<PostSummaryResponse>>>(`${POSTS_PATH}/search${toQueryString({ keyword, ...rest })}`)
    .then((res) => res.data)
}

export function getSearchAutocomplete(keyword: string) {
  return api
    .get<ApiResponse<SearchAutocompleteResponse>>(`${POSTS_PATH}/search/autocomplete${toQueryString({ keyword })}`)
    .then((res) => res.data)
}

export function getCuration() {
  return api.get<ApiResponse<CurationResponse[]>>(`${POSTS_PATH}/curation`).then((res) => res.data)
}
