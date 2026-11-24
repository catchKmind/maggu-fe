import { useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import { createRoot } from 'react-dom/client'
import { PostMarker } from '../components/PostMarker'
import type { MarkerItem } from '../mappers/toMapMarkers'
import type { PhotoSpot } from '../types'

/**
 * 지도 위 사진 마커를 그린다. 낱장 장소는 누르면 장소 시트를 열고(onSpotClick),
 * 묶음은 누르면 그 묶음이 쪼개지는 줌으로 확대한다.
 */
export function usePostMarkers(map: mapboxgl.Map | null, items: MarkerItem[], onSpotClick?: (spot: PhotoSpot) => void) {
  useEffect(() => {
    if (!map) return

    const markers = items.map((item) => {
      const el = document.createElement('div')
      const root = createRoot(el)
      let lngLat: [number, number]

      if (item.kind === 'spot') {
        lngLat = [item.spot.lng, item.spot.lat]
        root.render(
          <PostMarker imageUrl={item.spot.photos[0]} postCount={item.spot.postCount} onClick={() => onSpotClick?.(item.spot)} />,
        )
      } else {
        lngLat = [item.lng, item.lat]
        root.render(
          <PostMarker
            imageUrl={item.imageUrl}
            postCount={item.count}
            badgeCount={item.count}
            onClick={() => map.easeTo({ center: lngLat, zoom: item.expansionZoom, duration: 400 })}
          />,
        )
      }

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(lngLat).addTo(map)
      return { marker, root }
    })

    return () => {
      markers.forEach(({ marker, root }) => {
        marker.remove()
        // 렌더 도중 동기 unmount하면 React가 경고를 띄우므로 현재 렌더가 끝난 뒤로 미룬다
        queueMicrotask(() => root.unmount())
      })
    }
  }, [map, items, onSpotClick])
}
