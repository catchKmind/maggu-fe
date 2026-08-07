import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapboxMap } from '../hooks/useMapboxMap'
import { usePhotoMarkers } from '../hooks/usePhotoMarkers'
import { MOCK_PHOTO_SPOTS } from '../mocks/photoSpots'

export function MapView() {
  const { containerRef, map } = useMapboxMap()
  usePhotoMarkers(map, MOCK_PHOTO_SPOTS)

  return <div ref={containerRef} className="flex-1" />
}
