import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const DEFAULT_CENTER: [number, number] = [128.6613, 35.8855] // 동촌유원지 (대구 동구 효목동)
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
