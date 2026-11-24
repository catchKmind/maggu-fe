import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getMapPosts } from '../api/mapPosts'
import type { MapMarkersBounds } from '../api/mapMarkers.types'
import type { MapPostCategory } from '../api/mapPosts.types'

export function useMapPosts(bounds: MapMarkersBounds | null, category?: MapPostCategory) {
  return useQuery({
    queryKey: ['mapPosts', bounds, category],
    queryFn: () => getMapPosts(bounds as MapMarkersBounds, category),
    enabled: bounds !== null,
    // 지도를 움직여 새 범위를 불러오는 동안에도 이전 마커를 그대로 둬서 깜빡이지 않게 한다
    placeholderData: keepPreviousData,
  })
}
