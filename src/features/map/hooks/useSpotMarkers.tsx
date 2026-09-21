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
        // 렌더 도중 동기 unmount하면 React가 경고를 띄우므로 현재 렌더가 끝난 뒤로 미룬다
        queueMicrotask(() => root.unmount())
      })
    }
  }, [map, spots, onSpotClick])
}
