import { api, type ApiResponse } from '../../../shared/lib/api'
import { toQueryString } from '../../../shared/lib/queryString'
import type { MapMarkersBounds } from './mapMarkers.types'
import type { MapSpotDetail, MapSpotsResponse } from './mapSpots.types'

const MAP_SPOTS_PATH = '/api/v1/map/spots'
const MAP_SEARCH_SPOTS_PATH = '/api/v1/map/search/spots'

export function getMapSpots(bounds: MapMarkersBounds) {
  return api.get<ApiResponse<MapSpotsResponse>>(`${MAP_SPOTS_PATH}${toQueryString(bounds)}`).then((res) => res.data)
}

export function getMapSpot(contentId: string) {
  return api.get<ApiResponse<MapSpotDetail>>(`${MAP_SPOTS_PATH}/${contentId}`).then((res) => res.data)
}

export function searchMapSpots(keyword: string) {
  return api
    .get<ApiResponse<MapSpotDetail[]>>(`${MAP_SEARCH_SPOTS_PATH}${toQueryString({ keyword })}`)
    .then((res) => res.data)
}
