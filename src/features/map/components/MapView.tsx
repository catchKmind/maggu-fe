import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapboxMap } from '../hooks/useMapboxMap'

export function MapView() {
  const { containerRef } = useMapboxMap()

  return <div ref={containerRef} className="flex-1" />
}
