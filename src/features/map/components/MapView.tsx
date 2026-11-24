import 'mapbox-gl/dist/mapbox-gl.css'
import { useMemo } from 'react'
import { useMapboxMap } from '../hooks/useMapboxMap'
import { useMapViewport } from '../hooks/useMapViewport'
import { useMapPosts } from '../hooks/useMapPosts'
import { usePostMarkers } from '../hooks/usePostMarkers'
import { createClusterIndex, getMarkerItems, groupPostsIntoPlaces } from '../mappers/toMapMarkers'
import { isOutOfServiceArea } from '../serviceArea'
import { OutOfServiceNotice } from './OutOfServiceNotice'
import type { MapPostCategory } from '../api/mapPosts.types'
import type { PhotoSpot } from '../types'

/**
 * 이 줌보다 멀어지면 마커를 그리지 않는다.
 * 전국으로 서비스를 넓혀서, 나라 전체가 보이는 정도(5)까지 사진을 보여준다. 가까운 사진은 묶음으로 합쳐 보여주므로
 * 멀리서도 화면이 뒤덮이지 않는다. 게시글이 많아져 응답이 무거워지면 다시 올린다 (이전 값: 경상도 7, 그 전 14).
 */
const MIN_MARKER_ZOOM = 5

interface MapViewProps {
  onSpotClick?: (spot: PhotoSpot) => void
  category?: MapPostCategory
}

export function MapView({ onSpotClick, category }: MapViewProps) {
  const { containerRef, map } = useMapboxMap()
  const { bounds, zoom } = useMapViewport(map)

  const isZoomedIn = zoom !== null && zoom >= MIN_MARKER_ZOOM
  const { data: postsGeoJson } = useMapPosts(isZoomedIn ? bounds : null, category)

  // 같은 장소의 글을 한 장소로 합치고, 가까운 장소끼리는 화면 거리로 묶는다 (아이폰 사진 앱 지도처럼)
  const clusterIndex = useMemo(() => createClusterIndex(groupPostsIntoPlaces(postsGeoJson?.features ?? [])), [postsGeoJson])
  const markerItems = useMemo(
    () => (isZoomedIn && bounds && zoom !== null ? getMarkerItems(clusterIndex, bounds, zoom) : []),
    [clusterIndex, isZoomedIn, bounds, zoom],
  )

  usePostMarkers(map, markerItems, onSpotClick)

  return (
    <div className="relative flex flex-1 flex-col">
      <div ref={containerRef} className="flex-1" />
      {isOutOfServiceArea(bounds) && (
        <div className="pointer-events-none absolute inset-x-4 top-[calc(var(--safe-top,0px)+59px)] z-10">
          <OutOfServiceNotice />
        </div>
      )}
    </div>
  )
}
