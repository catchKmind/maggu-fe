import { api, type ApiResponse } from '../../../shared/lib/api'
import type { ScrapCreateRequest, ScrapResponse } from './scraps.types'

const SCRAPS_PATH = '/api/v1/community/scraps'

export function scrapPost(body: ScrapCreateRequest) {
  return api.post<ApiResponse<ScrapResponse>>(SCRAPS_PATH, body).then((res) => res.data)
}

export function unscrapPost(postId: number) {
  return api.delete<ApiResponse<ScrapResponse>>(`${SCRAPS_PATH}/${postId}`).then((res) => res.data)
}

export function moveScrapFolder(postId: number, folderId: number) {
  return api
    .patch<ApiResponse<ScrapResponse>>(`${SCRAPS_PATH}/${postId}/folder/${folderId}`)
    .then((res) => res.data)
}
