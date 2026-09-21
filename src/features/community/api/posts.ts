import { api, type ApiResponse } from '../../../shared/lib/api'
import { toQueryString } from '../../../shared/lib/queryString'
import type {
  CurationResponse,
  CursorPageResponse,
  GetFeedByContentIdParams,
  GetFeedParams,
  PageResponse,
  PostCreateRequest,
  PostCreateResponse,
  PostDeleteResponse,
  PostDetailResponse,
  PostFeedItemResponse,
  PostShareResponse,
  PostSummaryResponse,
  SearchAutocompleteResponse,
  SearchPostsParams,
} from './posts.types'

// POST-API
const POSTS_PATH = '/api/v1/community/posts'

// 커뮤니티 피드 조회
export function getFeed(params: GetFeedParams = {}) {
  return api
    .get<ApiResponse<PageResponse<PostSummaryResponse>>>(`${POSTS_PATH}${toQueryString(params)}`)
    .then((res) => res.data)
}

// 커뮤니티 게시글 작성
export function createPost(body: PostCreateRequest) {
  return api.post<ApiResponse<PostCreateResponse>>(POSTS_PATH, body).then((res) => res.data)
}

// 게시글 상세 조회
export function getPostDetail(postId: number) {
  return api.get<ApiResponse<PostDetailResponse>>(`${POSTS_PATH}/${postId}`).then((res) => res.data)
}

// 게시글 삭제
export function deletePost(postId: number) {
  return api.delete<ApiResponse<PostDeleteResponse>>(`${POSTS_PATH}/${postId}`).then((res) => res.data)
}

// postId 활용해 게시글 공유 정보 조회
export function getPostShare(postId: number) {
  return api.get<ApiResponse<PostShareResponse>>(`${POSTS_PATH}/${postId}/share`).then((res) => res.data)
}

// 게시글 검색
export function searchPosts({ keyword, ...rest }: SearchPostsParams) {
  return api
    .get<ApiResponse<PageResponse<PostSummaryResponse>>>(`${POSTS_PATH}/search${toQueryString({ keyword, ...rest })}`)
    .then((res) => res.data)
}

// 검색어 자동완성
export function getSearchAutocomplete(keyword: string) {
  return api
    .get<ApiResponse<SearchAutocompleteResponse>>(`${POSTS_PATH}/search/autocomplete${toQueryString({ keyword })}`)
    .then((res) => res.data)
}

// 커뮤니티 큐레이션 조회
export function getCuration() {
  return api.get<ApiResponse<CurationResponse[]>>(`${POSTS_PATH}/curation`).then((res) => res.data)
}

// contentId 활용해 커뮤니티 피드 조회
export function getFeedByContentId(params: GetFeedByContentIdParams) {
  return api
    .get<ApiResponse<CursorPageResponse<PostFeedItemResponse>>>(`${POSTS_PATH}/feed${toQueryString(params)}`)
    .then((res) => res.data)
}
