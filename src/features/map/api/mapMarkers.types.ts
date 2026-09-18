/// <reference types="geojson" />

export interface MapMarkersBounds {
  minLat: number //bbox 최소 위도
  minLng: number //bbox 최소 경도
  maxLat: number //bbox 최대 위도
  maxLng: number //bbox 최대 경도
}

export interface MapMarkerProperties {
  postId: number
  slug: string
  representativeImageUrl: string
  scrapCount: number
  tourismContentId: string
  placeName: string
  /** 같은 관광지(tourismContentId)에 연결된 게시글 전체 개수. tourismContentId가 없으면 null */
  placePostCount: number | null
}

export type MapMarkerFeature = GeoJSON.Feature<GeoJSON.Point, MapMarkerProperties>

export type MapMarkersGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, MapMarkerProperties>