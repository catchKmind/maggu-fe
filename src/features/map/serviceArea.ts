import type { MapMarkersBounds } from './api/mapMarkers.types'

/**
 * 서비스 범위(경상도). 경남·경북 본토에 울릉도/독도까지 포함한 사각 범위로,
 * 실제 등록된 장소 데이터 분포(위도 34.57~37.55, 경도 126.70~131.87)를 참고해 잡았다.
 */
const SERVICE_AREA = {
  minLat: 34.5,
  maxLat: 37.6,
  minLng: 127.5,
  maxLng: 131.9,
}

/** 지도 중심이 서비스 범위를 벗어났는지 */
export function isOutOfServiceArea(bounds: MapMarkersBounds | null): boolean {
  if (!bounds) return false

  const centerLat = (bounds.minLat + bounds.maxLat) / 2
  const centerLng = (bounds.minLng + bounds.maxLng) / 2

  return (
    centerLat < SERVICE_AREA.minLat ||
    centerLat > SERVICE_AREA.maxLat ||
    centerLng < SERVICE_AREA.minLng ||
    centerLng > SERVICE_AREA.maxLng
  )
}
