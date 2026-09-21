import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useMapboxMap } from '../hooks/useMapboxMap'
import { useMapViewport } from '../hooks/useMapViewport'
import { useMapPosts } from '../hooks/useMapPosts'
import { useSearchMapSpots } from '../hooks/useSearchMapSpots'
import { usePostMarkers } from '../hooks/usePostMarkers'
import { useSpotMarkers } from '../hooks/useSpotMarkers'
import { toPostSpot } from '../mappers/toPostSpot'
import { toSpotPin } from '../mappers/toSpotPin'
import { isOutOfServiceArea } from '../serviceArea'
import { OutOfServiceNotice } from './OutOfServiceNotice'
import type { MapPostCategory } from '../api/mapPosts.types'
import type { PhotoSpot } from '../types'

/** 이 줌보다 멀어지면 마커를 그리지 않는다 (전국이 마커로 뒤덮이는 걸 방지) */
const MIN_MARKER_ZOOM = 14
/** 밀집 지역에서도 화면이 가려지지 않도록 한 화면에 그리는 마커 수 상한 */
const MAX_MARKERS = 20
/** 검색 결과로 띄운 스팟이 화면에 들어오도록 맞출 때의 여백/최대 줌 */
const FIT_PADDING = 64
const FIT_MAX_ZOOM = 15

interface MapViewProps {
  onSpotClick?: (spot: PhotoSpot) => void
  category?: MapPostCategory
  /** 값이 있으면 그 키워드로 검색한 관광지 스팟을 핀으로 띄운다 */
  searchKeyword?: string | null
}

export function MapView({ onSpotClick, category, searchKeyword = null }: MapViewProps) {
  const { t } = useTranslation('map')
  const { containerRef, map } = useMapboxMap()
  const { bounds, zoom } = useMapViewport(map)

  const isZoomedIn = zoom !== null && zoom >= MIN_MARKER_ZOOM
  const { data: postsGeoJson } = useMapPosts(isZoomedIn ? bounds : null, category)
  const { data: searchedSpots } = useSearchMapSpots(searchKeyword)

  const posts = useMemo(
    () =>
      postsGeoJson?.features
        .filter((feature) => feature.properties.representativeImageUrl)
        .slice(0, MAX_MARKERS)
        .map(toPostSpot) ?? [],
    [postsGeoJson],
  )

  const spots = useMemo(
    () =>
      searchedSpots
        ?.slice(0, MAX_MARKERS)
        .map((spot) => toSpotPin(spot, t(`placeDetail.contentType.${spot.contentType}`))) ?? [],
    [searchedSpots, t],
  )

  usePostMarkers(map, posts, onSpotClick)
  useSpotMarkers(map, spots, onSpotClick)

  // 검색 결과가 오면 그 스팟들이 다 보이도록 지도를 옮겨준다
  useEffect(() => {
    if (!map || spots.length === 0) return

    const first = spots[0]
    if (spots.length === 1) {
      map.easeTo({ center: [first.lng, first.lat], zoom: FIT_MAX_ZOOM })
      return
    }

    const bounds = spots.reduce(
      (acc, spot) => acc.extend([spot.lng, spot.lat]),
      new mapboxgl.LngLatBounds([first.lng, first.lat], [first.lng, first.lat]),
    )
    map.fitBounds(bounds, { padding: FIT_PADDING, maxZoom: FIT_MAX_ZOOM })
  }, [map, spots])

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
