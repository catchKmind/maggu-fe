import { useEffect, useState } from 'react'
import type { MapMarkersBounds } from '../api/mapMarkers.types'

function toBounds(map: mapboxgl.Map): MapMarkersBounds {
  const bounds = map.getBounds()!
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()
  return { minLat: sw.lat, minLng: sw.lng, maxLat: ne.lat, maxLng: ne.lng }
}

/**
 * 지도 뷰포트(bbox + 줌)를 추적. map이 준비되면 초기값을 한 번 잡고,
 * 이후 이동/줌이 끝날 때(moveend)마다 갱신.
 */
export function useMapViewport(map: mapboxgl.Map | null) {
  const [bounds, setBounds] = useState<MapMarkersBounds | null>(null)
  const [zoom, setZoom] = useState<number | null>(null)

  useEffect(() => {
    if (!map) return

    const sync = () => {
      setBounds(toBounds(map))
      setZoom(map.getZoom())
    }
    sync()

    map.on('moveend', sync)
    return () => {
      map.off('moveend', sync)
    }
  }, [map])

  return { bounds, zoom }
}
