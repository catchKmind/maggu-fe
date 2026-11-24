import { api, type ApiResponse } from '../../../shared/lib/api'
import { toQueryString } from '../../../shared/lib/queryString'
import type { GetPlaceFolderScrapsParams, PlaceFolderScrapsResponse } from './placeFolderScraps.types'

const PLACE_FOLDERS_PATH = '/api/v1/my-places/folders'

// 폴더에 저장한 장소 목록 (최신 저장순). 남의 폴더면 403, 없는 폴더면 404
export function getPlaceFolderScraps(placeFolderId: number, params: GetPlaceFolderScrapsParams = {}) {
  return api
    .get<ApiResponse<PlaceFolderScrapsResponse>>(`${PLACE_FOLDERS_PATH}/${placeFolderId}/scraps${toQueryString(params)}`)
    .then((res) => res.data)
}
