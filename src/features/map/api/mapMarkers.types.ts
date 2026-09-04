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
}

export type MapMarkerFeature = GeoJSON.Feature<GeoJSON.Point, MapMarkerProperties>

export type MapMarkersGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, MapMarkerProperties>
