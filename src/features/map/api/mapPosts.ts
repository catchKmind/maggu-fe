import { api, type ApiResponse } from '../../../shared/lib/api'
import { toQueryString } from '../../../shared/lib/queryString'
import type { MapMarkersBounds } from './mapMarkers.types'
import type { MapPostCategory, MapPostsGeoJson } from './mapPosts.types'

const MAP_POSTS_PATH = '/api/v1/map/posts'

export function getMapPosts(bounds: MapMarkersBounds, category?: MapPostCategory) {
  return api
    .get<ApiResponse<MapPostsGeoJson>>(`${MAP_POSTS_PATH}${toQueryString({ ...bounds, category })}`)
    .then((res) => res.data)
}
