import { useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client'
import { PhotoMarker } from '../components/PhotoMarker'
import type { PhotoSpot } from '../types'

export function usePhotoMarkers(map: mapboxgl.Map | null, photoSpots: PhotoSpot[]) {
  useEffect(() => {
    if (!map) return

    const markers = photoSpots.map((spot) => {
      const el = document.createElement('div')
      const root = createRoot(el)
      root.render(<PhotoMarker photos={spot.photos} />)

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
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
  }, [map, photoSpots])
}
