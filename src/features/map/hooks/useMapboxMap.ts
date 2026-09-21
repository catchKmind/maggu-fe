import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

// 경산 정평동 일대. 동촌유원지는 등록된 장소 데이터가 하나도 없어 지도가 비어 보여서,
// 대구권에서 스팟이 가장 많이 모여있는 곳으로 잡아둠.
const DEFAULT_CENTER: [number, number] = [128.73487, 35.82631]
const DEFAULT_ZOOM = 15

interface UseMapboxMapOptions {
  center?: [number, number]
  zoom?: number
}

export function useMapboxMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
}: UseMapboxMapOptions = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const mapInstance = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom,
    })
    mapRef.current = mapInstance
    mapInstance.on('load', () => setMap(mapInstance))

    return () => {
      mapInstance.remove()
      mapRef.current = null
      setMap(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { containerRef, mapRef, map }
}
