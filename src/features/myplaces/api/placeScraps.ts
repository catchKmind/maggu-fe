import { api, type ApiResponse } from '../../../shared/lib/api'
import type { PlaceScrapCreateRequest, PlaceScrapCreateResponse } from './placeScraps.types'

const PLACE_SCRAP_PATH = '/api/v1/my-places/scrap'

export function createPlaceScrap(body: PlaceScrapCreateRequest) {
  return api.post<ApiResponse<PlaceScrapCreateResponse>>(PLACE_SCRAP_PATH, body).then((res) => res.data)
}
