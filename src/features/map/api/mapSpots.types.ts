/// <reference types="geojson" />

/**
 * 관광공사 contentTypeId. 12: 관광지, 14: 문화시설, 15: 축제공연행사, 25: 여행코스,
 * 28: 레포츠, 32: 숙박, 38: 쇼핑, 39: 음식점
 */
export type TourContentType = 12 | 14 | 15 | 25 | 28 | 32 | 38 | 39

export interface TourSpotProperties {
  contentId: string
  contentType: TourContentType
  title: string
  /** 오늘 기준 진행중인 축제/공연/행사인지 여부. true면 지도 핀에 🔥 아이콘 표시용 */
  isOngoingEvent: boolean
}

export type MapSpotFeature = GeoJSON.Feature<GeoJSON.Point, TourSpotProperties>

export type MapSpotsResponse = GeoJSON.FeatureCollection<GeoJSON.Point, TourSpotProperties>

/** 상세 응답은 정보가 없는 필드를 null로 내려준다 (관광공사 원본 데이터에 비는 값이 많음) */
export interface MapSpotDetail {
  contentId: string
  contentType: TourContentType
  tel: string | null
  title: string
  addr: string | null
  images: string[]
  businessHours: string | null
  closedDays: string | null
  /** 축제 기간. 축제(contentType 15)가 아니면 null */
  eventPeriod: string | null
  lng: number
  lat: number
  /** 이 장소에 연결된 게시글들의 스크랩수 합계 */
  placeScrapCount: number | null
}
