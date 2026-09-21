/// <reference types="geojson" />

/** /map/posts의 카테고리 필터. 상단 필터 칩과 대응 (카페에 해당하는 값은 아직 없음) */
export type MapPostCategory = 'FOOD' | 'LANDMARK' | 'STAY' | 'POPULAR'

export interface MapPostProperties {
  postId: number
  slug: string
  representativeImageUrl: string
  scrapCount: number
  /** 관광공사 콘텐츠 ID. 연결 안 된 글이면 null */
  tourismContentId: string | null
  placeName: string
  /** 같은 관광지(tourismContentId)에 연결된 게시글 전체 개수. tourismContentId가 없으면 null */
  placePostCount: number | null
}

export type MapPostFeature = GeoJSON.Feature<GeoJSON.Point, MapPostProperties>

export type MapPostsGeoJson = GeoJSON.FeatureCollection<GeoJSON.Point, MapPostProperties>
