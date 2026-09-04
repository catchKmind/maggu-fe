import { api, type ApiResponse } from '../../../shared/lib/api'
import { toQueryString } from '../../../shared/lib/queryString'
import type { PageResponse, PostSummaryResponse } from './posts.types'
import type {
  FolderCreateRequest,
  FolderCreateResponse,
  FolderResponse,
  GetFolderScrapsParams,
} from './folders.types'

const FOLDERS_PATH = '/api/v1/community/folders'

export function getFolders() {
  return api.get<ApiResponse<FolderResponse[]>>(FOLDERS_PATH).then((res) => res.data)
}

export function createFolder(body: FolderCreateRequest) {
  return api.post<ApiResponse<FolderCreateResponse>>(FOLDERS_PATH, body).then((res) => res.data)
}

export function getFolderScraps(folderId: number, params: GetFolderScrapsParams = {}) {
  return api
    .get<ApiResponse<PageResponse<PostSummaryResponse>>>(`${FOLDERS_PATH}/${folderId}/scraps${toQueryString(params)}`)
    .then((res) => res.data)
}
