import 'mapbox-gl/dist/mapbox-gl.css'
import { useTranslation } from 'react-i18next'
import { useMapboxMap } from '../hooks/useMapboxMap'
import { useMapBounds } from '../hooks/useMapBounds'
import { useMapSpots } from '../hooks/useMapSpots'
import { useSpotMarkers } from '../hooks/useSpotMarkers'
import { toSpotPin } from '../mappers/toSpotPin'
import type { PhotoSpot } from '../types'

interface MapViewProps {
  onSpotClick?: (spot: PhotoSpot) => void
}

export function MapView({ onSpotClick }: MapViewProps) {
  const { t } = useTranslation('map')
  const { containerRef, map } = useMapboxMap()
  const bounds = useMapBounds(map)
  const { data } = useMapSpots(bounds)

  const spots =
    data?.features.map((feature) =>
      toSpotPin(feature, t(`placeDetail.contentType.${feature.properties.contentType}`)),
    ) ?? []

  useSpotMarkers(map, spots, onSpotClick)

  return <div ref={containerRef} className="flex-1" />
}
