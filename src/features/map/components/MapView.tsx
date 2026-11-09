import 'mapbox-gl/dist/mapbox-gl.css'
import { useMemo } from 'react'
import { useMapboxMap } from '../hooks/useMapboxMap'
import { useMapViewport } from '../hooks/useMapViewport'
import { useMapPosts } from '../hooks/useMapPosts'
import { usePostMarkers } from '../hooks/usePostMarkers'
import { toPostSpot } from '../mappers/toPostSpot'
import { isOutOfServiceArea } from '../serviceArea'
import { OutOfServiceNotice } from './OutOfServiceNotice'
import type { MapPostCategory } from '../api/mapPosts.types'
import type { PhotoSpot } from '../types'

/**
 * 이 줌보다 멀어지면 마커를 그리지 않는다.
 * 게시글이 아직 적어서 경상도 전체가 보이는 정도(7)까지 사진을 보여준다.
 * 게시글이 많아져 화면이 뒤덮이면 다시 올린다 (이전 값 14 = 동네 몇 블록 정도).
 */
const MIN_MARKER_ZOOM = 7
/** 밀집 지역에서도 화면이 가려지지 않도록 한 화면에 그리는 마커 수 상한 */
const MAX_MARKERS = 20

interface MapViewProps {
  onSpotClick?: (spot: PhotoSpot) => void
  category?: MapPostCategory
}

export function MapView({ onSpotClick, category }: MapViewProps) {
  const { containerRef, map } = useMapboxMap()
  const { bounds, zoom } = useMapViewport(map)

  const isZoomedIn = zoom !== null && zoom >= MIN_MARKER_ZOOM
  const { data: postsGeoJson } = useMapPosts(isZoomedIn ? bounds : null, category)

  const posts = useMemo(
    () =>
      postsGeoJson?.features
        .filter((feature) => feature.properties.representativeImageUrl)
        .slice(0, MAX_MARKERS)
        .map(toPostSpot) ?? [],
    [postsGeoJson],
  )

  usePostMarkers(map, posts, onSpotClick)

  return (
    <div className="relative flex flex-1 flex-col">
      <div ref={containerRef} className="flex-1" />
      {isOutOfServiceArea(bounds) && (
        <div className="pointer-events-none absolute inset-x-4 top-28 z-10">
          <OutOfServiceNotice />
        </div>
      )}
    </div>
  )
}
