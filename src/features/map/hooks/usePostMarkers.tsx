import { useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client'
import { PostMarker } from '../components/PostMarker'
import type { PhotoSpot } from '../types'

export function usePostMarkers(map: mapboxgl.Map | null, posts: PhotoSpot[], onSpotClick?: (spot: PhotoSpot) => void) {
  useEffect(() => {
    if (!map) return

    const markers = posts.map((post) => {
      const el = document.createElement('div')
      const root = createRoot(el)
      root.render(
        <PostMarker imageUrl={post.photos[0]} postCount={post.postCount} onClick={() => onSpotClick?.(post)} />,
      )

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat([post.lng, post.lat]).addTo(map)

      return { marker, root }
    })

    return () => {
      markers.forEach(({ marker, root }) => {
        marker.remove()
        // 렌더 도중 동기 unmount하면 React가 경고를 띄우므로 현재 렌더가 끝난 뒤로 미룬다
        queueMicrotask(() => root.unmount())
      })
    }
  }, [map, posts, onSpotClick])
}
