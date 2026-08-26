import { api, type ApiResponse } from '../../../shared/lib/api'
import type { MapMarkersBounds, MapMarkersGeoJson } from './mapMarkers.types'

const MAP_MARKERS_PATH = '/api/v1/map/posts'

export function getMapMarkers({ minLat, minLng, maxLat, maxLng }: MapMarkersBounds) {
  const params = new URLSearchParams({
    minLat: String(minLat),
    minLng: String(minLng),
    maxLat: String(maxLat),
    maxLng: String(maxLng),
  })

  return api
    .get<ApiResponse<MapMarkersGeoJson>>(`${MAP_MARKERS_PATH}?${params}`)
    .then((res) => res.data)
}
