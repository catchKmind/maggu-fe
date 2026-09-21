import { useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client'
import { SpotMarker } from '../components/SpotMarker'
import type { PhotoSpot } from '../types'

export function useSpotMarkers(map: mapboxgl.Map | null, spots: PhotoSpot[], onSpotClick?: (spot: PhotoSpot) => void) {
  useEffect(() => {
    if (!map) return

    const markers = spots.map((spot) => {
      const el = document.createElement('div')
      const root = createRoot(el)
      root.render(<SpotMarker isOngoingEvent={spot.isOngoingEvent} onClick={() => onSpotClick?.(spot)} />)

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([spot.lng, spot.lat])
        .addTo(map)

      return { marker, root }
    })

    return () => {
      markers.forEach(({ marker, root }) => {
        marker.remove()
        root.unmount()
      })
    }
  }, [map, spots, onSpotClick])
}
