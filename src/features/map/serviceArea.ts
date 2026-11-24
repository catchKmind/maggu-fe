import type { MapMarkersBounds } from './api/mapMarkers.types'

/**
 * 서비스 범위(대한민국 전국). 마라도(남쪽 끝)·독도(동쪽 끝)·백령도(서쪽 끝)·휴전선 일대(북쪽)를 모두 포함한 사각 범위다.
 * 사각형이라 범위 안에 걸치는 바다·일본 일부·북한 남부는 안내가 뜨지 않는다 (지도 중심이 범위 밖일 때만 안내).
 */
export const SERVICE_AREA = {
  minLat: 33.0,
  maxLat: 38.7,
  minLng: 124.5,
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
