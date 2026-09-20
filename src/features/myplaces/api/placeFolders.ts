import { api, type ApiResponse } from '../../../shared/lib/api'
import type { PlaceFolderCreateRequest, PlaceFolderCreateResponse, PlaceFolderResponse } from './placeFolders.types'

const PLACE_FOLDERS_PATH = '/api/v1/my-places/folders'

export function getPlaceFolders() {
  return api.get<ApiResponse<PlaceFolderResponse[]>>(PLACE_FOLDERS_PATH).then((res) => res.data)
}

export function createPlaceFolder(body: PlaceFolderCreateRequest) {
  return api.post<ApiResponse<PlaceFolderCreateResponse>>(PLACE_FOLDERS_PATH, body).then((res) => res.data)
}
