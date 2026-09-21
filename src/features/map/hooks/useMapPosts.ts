import { useQuery } from '@tanstack/react-query'
import { getMapPosts } from '../api/mapPosts'
import type { MapMarkersBounds } from '../api/mapMarkers.types'
import type { MapPostCategory } from '../api/mapPosts.types'

export function useMapPosts(bounds: MapMarkersBounds | null, category?: MapPostCategory) {
  return useQuery({
    queryKey: ['mapPosts', bounds, category],
    queryFn: () => getMapPosts(bounds as MapMarkersBounds, category),
    enabled: bounds !== null,
  })
}
