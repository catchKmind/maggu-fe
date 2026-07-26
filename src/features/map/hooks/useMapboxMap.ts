import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const DEFAULT_CENTER: [number, number] = [126.978, 37.5665] // 서울시청
const DEFAULT_ZOOM = 13

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

  useEffect(() => {
    if (!containerRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom,
    })
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { containerRef, mapRef }
}
