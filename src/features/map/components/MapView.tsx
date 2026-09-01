import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapboxMap } from '../hooks/useMapboxMap'
import { useMapBounds } from '../hooks/useMapBounds'
import { useMapMarkers } from '../hooks/useMapMarkers'
import { usePhotoMarkers } from '../hooks/usePhotoMarkers'
import { toPhotoSpot } from '../mappers/toPhotoSpot'
import type { PhotoSpot } from '../types'

interface MapViewProps {
  onSpotClick?: (spot: PhotoSpot) => void
}

export function MapView({ onSpotClick }: MapViewProps) {
  const { containerRef, map } = useMapboxMap()
  const bounds = useMapBounds(map)
  const { data } = useMapMarkers(bounds)

  const photoSpots =
    data?.features.filter((feature) => feature.properties.representativeImageUrl).map(toPhotoSpot) ?? []

  usePhotoMarkers(map, photoSpots, onSpotClick)

  return <div ref={containerRef} className="flex-1" />
}
