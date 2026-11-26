import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { createRoot, type Root } from 'react-dom/client'
import { PostMarker } from '../components/PostMarker'
import type { MarkerItem } from '../mappers/toMapMarkers'
import type { PhotoSpot } from '../types'

interface MarkerEntry {
  marker: mapboxgl.Marker
  root: Root
  /** 마커 모양이 바뀌었는지 비교하는 값. 같으면 다시 그리지 않는다 */
  signature: string
}

function toSignature(item: MarkerItem) {
  return item.kind === 'spot'
    ? `spot|${item.spot.photos[0]}|${item.spot.postCount}|${item.spot.lng}|${item.spot.lat}`
    : `cluster|${item.imageUrl}|${item.count}|${item.lng}|${item.lat}|${item.expansionZoom}`
}

function removeEntry(entry: MarkerEntry) {
  entry.marker.remove()
  // 렌더 도중 동기 unmount하면 React가 경고를 띄우므로 현재 렌더가 끝난 뒤로 미룬다
  queueMicrotask(() => entry.root.unmount())
}

/**
 * 지도 위 사진 마커를 그린다. 낱장 장소는 누르면 장소 시트를 열고(onSpotClick),
 * 묶음은 누르면 그 묶음이 쪼개지는 줌으로 확대한다.
 *
 * 속도: 지도를 움직일 때마다 마커를 전부 지우고 다시 만들지 않고, 이미 있는 마커는 그대로 두고
 * 새로 생긴 것만 추가, 사라진 것만 제거, 모양이 바뀐 것만 다시 그린다.
 */
export function usePostMarkers(map: mapboxgl.Map | null, items: MarkerItem[], onSpotClick?: (spot: PhotoSpot) => void) {
  const entriesRef = useRef(new Map<string, MarkerEntry>())
  // 마커를 다시 만들지 않아도 항상 최신 클릭 함수를 부르도록 ref에 담아 둔다
  const onSpotClickRef = useRef(onSpotClick)
  onSpotClickRef.current = onSpotClick

  useEffect(() => {
    if (!map) return
    const entries = entriesRef.current

    const render = (root: Root, item: MarkerItem) => {
      if (item.kind === 'spot') {
        root.render(
          <PostMarker
            imageUrl={item.spot.photos[0]}
            postCount={item.spot.postCount}
            onClick={() => onSpotClickRef.current?.(item.spot)}
          />,
        )
      } else {
        root.render(
          <PostMarker
            imageUrl={item.imageUrl}
            postCount={item.count}
            badgeCount={item.count}
            onClick={() => map.easeTo({ center: [item.lng, item.lat], zoom: item.expansionZoom, duration: 400 })}
          />,
        )
      }
    }

    // 화면에서 사라진 마커만 제거
    const nextKeys = new Set(items.map((item) => item.key))
    for (const [key, entry] of entries) {
      if (nextKeys.has(key)) continue
      removeEntry(entry)
      entries.delete(key)
    }

    for (const item of items) {
      const lngLat: [number, number] = item.kind === 'spot' ? [item.spot.lng, item.spot.lat] : [item.lng, item.lat]
      const signature = toSignature(item)
      const existing = entries.get(item.key)

      if (existing) {
        // 모양이 같으면 그대로 두고, 바뀌었을 때만 다시 그린다
        if (existing.signature !== signature) {
          render(existing.root, item)
          existing.marker.setLngLat(lngLat)
          existing.signature = signature
        }
        continue
      }

      const el = document.createElement('div')
      const root = createRoot(el)
      render(root, item)
      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(lngLat).addTo(map)
      entries.set(item.key, { marker, root, signature })
    }
  }, [map, items])

  // 지도가 바뀌거나 화면을 떠날 때는 전부 정리
  useEffect(() => {
    const entries = entriesRef.current
    return () => {
      entries.forEach(removeEntry)
      entries.clear()
    }
  }, [map])
}
