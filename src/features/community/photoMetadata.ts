export interface PhotoCoordinates {
  lat: number
  lng: number
}

function toObject(exif: unknown): Record<string, unknown> | null {
  if (exif == null) return null
  if (typeof exif === 'string') {
    try {
      return JSON.parse(exif) as Record<string, unknown>
    } catch {
      return null
    }
  }
  if (typeof exif === 'object') return exif as Record<string, unknown>
  return null
}

/** "37/1,33/1,2679/100" 같은 EXIF DMS 분수 문자열(도,분,초) → 10진수 도(度) */
function parseDmsString(value: string): number | null {
  const parts = value.split(',').map((p) => p.trim())
  if (parts.length !== 3) return null

  const toNumber = (fraction: string) => {
    const [num, den] = fraction.split('/').map(Number)
    return den ? num / den : NaN
  }
  const [d, m, s] = parts.map(toNumber)
  if ([d, m, s].some((n) => Number.isNaN(n))) return null
  return d + m / 60 + s / 3600
}

/**
 * Capacitor Camera의 metadata.exif에서 GPS 좌표를 뽑는다. 사진에 위치 정보가
 * 없거나 웹(브라우저)에서 고른 사진이면 null — 이 경우 MANUAL(직접 검색)로 대체해야 한다.
 *
 * 플랫폼별로 exif 구조가 달라서 둘 다 처리한다:
 * - iOS(CGImageProperties): exif.GPS.Latitude(10진수, 항상 양수) + LatitudeRef("N"/"S")
 * - Android(androidx ExifInterface): exif.GPSLatitude("d/1,m/1,s/100" 분수 문자열) + GPSLatitudeRef
 */
export function extractExifCoordinates(exif: unknown): PhotoCoordinates | null {
  const data = toObject(exif)
  if (!data) return null

  const gps = (data.GPS ?? data) as Record<string, unknown>
  const rawLat = gps.Latitude ?? gps.GPSLatitude
  const rawLng = gps.Longitude ?? gps.GPSLongitude
  const latRef = (gps.LatitudeRef ?? gps.GPSLatitudeRef) as string | undefined
  const lngRef = (gps.LongitudeRef ?? gps.GPSLongitudeRef) as string | undefined
  if (rawLat == null || rawLng == null) return null

  const parse = (raw: unknown): number | null => {
    if (typeof raw === 'number') return raw
    if (typeof raw === 'string') return parseDmsString(raw)
    return null
  }

  const lat = parse(rawLat)
  const lng = parse(rawLng)
  if (lat === null || lng === null) return null

  return {
    lat: latRef === 'S' ? -lat : lat,
    lng: lngRef === 'W' ? -lng : lng,
  }
}
