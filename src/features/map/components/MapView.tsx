import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapboxMap } from '../hooks/useMapboxMap'
import { usePhotoMarkers } from '../hooks/usePhotoMarkers'
import type { PhotoSpot } from '../types'

interface MapViewProps {
  photoSpots: PhotoSpot[]
  onSpotClick?: (spot: PhotoSpot) => void
}

export function MapView({ photoSpots, onSpotClick }: MapViewProps) {
  const { containerRef, map } = useMapboxMap()
  usePhotoMarkers(map, photoSpots, onSpotClick)

  return <div ref={containerRef} className="flex-1" />
}
