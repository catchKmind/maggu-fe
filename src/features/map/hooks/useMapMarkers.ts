import { useQuery } from '@tanstack/react-query'
import { getMapMarkers } from '../api/getMapMarkers'
import type { MapMarkersBounds } from '../api/mapMarkers.types'

export function useMapMarkers(bounds: MapMarkersBounds | null) {
  return useQuery({
    queryKey: ['mapMarkers', bounds],
    queryFn: () => getMapMarkers(bounds as MapMarkersBounds),
    enabled: bounds !== null,
  })
}
