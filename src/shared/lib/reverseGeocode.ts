const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

/** 위경도 → 사람이 읽을 수 있는 주소 문자열. Mapbox Geocoding API 사용 (실패 시 null). */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=ko&limit=1`

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    return data.features?.[0]?.place_name ?? null
  } catch {
    return null
  }
}
