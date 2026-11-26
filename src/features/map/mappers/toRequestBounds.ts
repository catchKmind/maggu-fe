import type { MapMarkersBounds } from '../api/mapMarkers.types'

/**
 * 지도 범위를 서버에 요청할 범위로 바꾼다. 화면보다 한두 칸 넓게, 일정한 격자(칸)에 맞춰서 잡는다.
 * 지도를 조금만 움직여도 범위 숫자가 달라져서 매번 새로 요청하던 것을, 같은 칸 안에서는 같은 요청으로 처리하려는 것이다.
 * (묶음 계산은 실제 화면 범위로 따로 하므로, 더 넓게 받아 온 마커는 화면 밖이면 그려지지 않는다)
 */
export function toRequestBounds(bounds: MapMarkersBounds): MapMarkersBounds {
  const span = Math.max(bounds.maxLat - bounds.minLat, bounds.maxLng - bounds.minLng)
  // 칸 크기: 화면 크기의 절반 이하 중 가장 큰 2의 거듭제곱 분할 (줌이 한 단계 바뀔 때마다 칸도 두 배/절반)
  const step = 180 / 2 ** Math.floor(Math.log2(180 / (span / 2)))
  const round = (value: number) => Number(value.toFixed(6))

  return {
    minLat: round(Math.floor(bounds.minLat / step) * step - step),
    minLng: round(Math.floor(bounds.minLng / step) * step - step),
    maxLat: round(Math.ceil(bounds.maxLat / step) * step + step),
    maxLng: round(Math.ceil(bounds.maxLng / step) * step + step),
  }
}
