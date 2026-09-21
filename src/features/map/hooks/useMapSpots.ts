import { useQuery } from '@tanstack/react-query'
import { getMapSpots } from '../api/mapSpots'
import type { MapMarkersBounds } from '../api/mapMarkers.types'

export function useMapSpots(bounds: MapMarkersBounds | null) {
  return useQuery({
    queryKey: ['mapSpots', bounds],
    queryFn: () => getMapSpots(bounds as MapMarkersBounds),
    enabled: bounds !== null,
  })
}
