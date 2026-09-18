import { api, type ApiResponse } from '../../../shared/lib/api'
import { toQueryString } from '../../../shared/lib/queryString'
import type {
  AutocompleteCandidateResponse,
  CursorPageResponse,
  PostFeedItemResponse,
  SearchMapPostsParams,
} from './mapSearch.types'

const MAP_SEARCH_POSTS_PATH = '/api/v1/map/search/posts'
const MAP_SEARCH_AUTOCOMPLETE_PATH = '/api/v1/map/search/autocomplete'

export function searchMapPosts(params: SearchMapPostsParams) {
  return api
    .get<ApiResponse<CursorPageResponse<PostFeedItemResponse>>>(`${MAP_SEARCH_POSTS_PATH}${toQueryString(params)}`)
    .then((res) => res.data)
}

export function getMapSearchAutocomplete(keyword: string) {
  return api
    .get<ApiResponse<AutocompleteCandidateResponse[]>>(`${MAP_SEARCH_AUTOCOMPLETE_PATH}${toQueryString({ keyword })}`)
    .then((res) => res.data)
}
