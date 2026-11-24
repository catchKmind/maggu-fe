import Supercluster from 'supercluster'
import type { MapMarkersBounds } from '../api/mapMarkers.types'
import type { MapPostFeature } from '../api/mapPosts.types'
import type { PhotoSpot } from '../types'
import { toPostSpot } from './toPostSpot'

/** 화면에서 이 픽셀 안에 겹치는 장소들은 한 묶음으로 보여준다 (마커 크기 48~84 기준) */
const CLUSTER_RADIUS_PX = 70
/** 이 줌 이상에서는 더 이상 묶지 않고 낱장으로 보여준다 */
const CLUSTER_MAX_ZOOM = 17

/** 묶음 계산에 쓰는 장소 하나: 대표 게시글 + 스크랩 수 */
export interface PlaceMarkerData {
  spot: PhotoSpot
  /** 대표 게시글의 스크랩 수 (묶음의 대표 사진을 고를 때 쓴다) */
  scrap: number
}

interface ClusterProps {
  spot: PhotoSpot
  scrap: number
  /** 묶음에 들어 있는 게시글 수 합계 */
  count: number
}

export type MarkerItem =
  | { kind: 'spot'; key: string; spot: PhotoSpot }
  | { kind: 'cluster'; key: string; lng: number; lat: number; count: number; imageUrl: string; expansionZoom: number }

/**
 * 서버는 게시글 단위로 내려주므로, 같은 장소(관광지 ID, 없으면 거의 같은 좌표)의 글을 하나의 장소로 합친다.
 * 장소의 대표 글은 스크랩이 가장 많은 글(같으면 더 최근 글 = postId가 큰 글)이다.
 */
export function groupPostsIntoPlaces(features: MapPostFeature[]): PlaceMarkerData[] {
  const groups = new Map<string, MapPostFeature[]>()
  for (const feature of features) {
    if (!feature.properties.representativeImageUrl) continue
    const [lng, lat] = feature.geometry.coordinates
    const key = feature.properties.tourismContentId ?? `at:${lat.toFixed(4)},${lng.toFixed(4)}`
    const group = groups.get(key)
    if (group) group.push(feature)
    else groups.set(key, [feature])
  }

  return [...groups.values()].map((posts) => {
    const best = posts.reduce((a, b) => {
      if (b.properties.scrapCount !== a.properties.scrapCount) return b.properties.scrapCount > a.properties.scrapCount ? b : a
      return b.properties.postId > a.properties.postId ? b : a
    })
    const spot = toPostSpot(best)
    // 서버가 센 "같은 장소의 전체 글 수"가 화면에 내려온 글 수보다 클 수 있어서 큰 쪽을 쓴다
    return { spot: { ...spot, postCount: Math.max(spot.postCount ?? 1, posts.length) }, scrap: best.properties.scrapCount }
  })
}

export type PlaceClusterIndex = Supercluster<ClusterProps, ClusterProps>

/** 장소들을 화면 거리로 묶기 위한 색인을 만든다 */
export function createClusterIndex(places: PlaceMarkerData[]): PlaceClusterIndex {
  const index: PlaceClusterIndex = new Supercluster<ClusterProps, ClusterProps>({
    radius: CLUSTER_RADIUS_PX,
    maxZoom: CLUSTER_MAX_ZOOM,
    minPoints: 2,
    map: (props) => ({ ...props }),
    // 묶음의 대표는 스크랩이 가장 많은 장소, 개수는 게시글 수의 합
    reduce: (accumulated, props) => {
      accumulated.count += props.count
      if (props.scrap > accumulated.scrap) {
        accumulated.scrap = props.scrap
        accumulated.spot = props.spot
      }
    },
  })
  index.load(
    places.map(({ spot, scrap }) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [spot.lng, spot.lat] },
      properties: { spot, scrap, count: spot.postCount ?? 1 },
    })),
  )
  return index
}

/** 현재 화면(bbox)과 줌에서 그려야 할 마커들: 낱장 장소 또는 묶음 */
export function getMarkerItems(index: PlaceClusterIndex, bounds: MapMarkersBounds, zoom: number): MarkerItem[] {
  const clusters = index.getClusters([bounds.minLng, bounds.minLat, bounds.maxLng, bounds.maxLat], Math.floor(zoom))
  return clusters.map((feature) => {
    const [lng, lat] = feature.geometry.coordinates
    const props = feature.properties
    if ('cluster' in props && props.cluster) {
      return {
        kind: 'cluster',
        key: `cluster-${props.cluster_id}`,
        lng,
        lat,
        count: props.count,
        imageUrl: props.spot.photos[0],
        expansionZoom: index.getClusterExpansionZoom(props.cluster_id),
      }
    }
    return { kind: 'spot', key: `spot-${props.spot.id}`, spot: props.spot }
  })
}
