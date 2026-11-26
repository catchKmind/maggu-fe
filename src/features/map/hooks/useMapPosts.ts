import { useMemo } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getMapPosts } from '../api/mapPosts'
import type { MapMarkersBounds } from '../api/mapMarkers.types'
import type { MapPostCategory } from '../api/mapPosts.types'
import { toRequestBounds } from '../mappers/toRequestBounds'

export function useMapPosts(bounds: MapMarkersBounds | null, category?: MapPostCategory) {
  // 화면 범위를 칸에 맞춰 넓게 잡아서, 조금 움직인 것만으로는 새로 요청하지 않게 한다
  const requestBounds = useMemo(() => (bounds ? toRequestBounds(bounds) : null), [bounds])

  return useQuery({
    queryKey: ['mapPosts', requestBounds, category],
    queryFn: () => getMapPosts(requestBounds as MapMarkersBounds, category),
    enabled: requestBounds !== null,
    // 지도를 움직여 새 범위를 불러오는 동안에도 이전 마커를 그대로 둬서 깜빡이지 않게 한다
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  })
}
