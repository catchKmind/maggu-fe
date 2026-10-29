import type { MapSpotDetail, TourContentType } from '../api/mapSpots.types'

/**
 * 관광공사 contentTypeId → Schema.org 타입.
 * 문화시설(14)은 박물관·공연장·도서관이 섞여 있어 특정 하위 타입으로 단정하지 않고 TouristAttraction으로 둔다.
 * 축제(15)는 기간을 해석할 수 있을 때만 Event로 바꾼다 (toPlaceJsonLd 참고).
 */
const SCHEMA_TYPE_BY_CONTENT_TYPE: Record<TourContentType, string> = {
  12: 'TouristAttraction',
  14: 'TouristAttraction',
  15: 'Event',
  25: 'TouristTrip',
  28: 'SportsActivityLocation',
  32: 'LodgingBusiness',
  38: 'Store',
  39: 'Restaurant',
}

const DATE_PATTERN = /(\d{4})[.\-/]?(\d{2})[.\-/]?(\d{2})/g

type JsonLdValue = string | number | boolean | JsonLdObject | JsonLdValue[]
export interface JsonLdObject {
  [key: string]: JsonLdValue
}

/** "20261001 ~ 20261015", "2026.10.01~2026.10.15" 같은 기간 문자열에서 시작/종료일(ISO 8601)을 뽑는다. */
function parseEventPeriod(eventPeriod: string | null): { startDate: string; endDate?: string } | null {
  if (!eventPeriod) return null
  const dates = [...eventPeriod.matchAll(DATE_PATTERN)].map(([, y, m, d]) => `${y}-${m}-${d}`)
  if (dates.length === 0) return null
  return { startDate: dates[0], endDate: dates[1] }
}

/** null·빈 문자열·빈 배열인 필드를 지운다. 비어 있는 값을 그대로 내보내면 검증 도구에서 경고가 난다. */
function compact(obj: Record<string, unknown>): JsonLdObject {
  const result: JsonLdObject = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined || value === '') continue
    if (Array.isArray(value) && value.length === 0) continue
    result[key] = value as JsonLdValue
  }
  return result
}

/**
 * 장소 상세 응답을 Schema.org JSON-LD로 변환한다.
 *
 * 일부러 넣지 않은 필드:
 * - openingHours: businessHours가 "평일 08:30~18:00 / 주말 ..." 같은 자유 텍스트라 요일·시간을 정확히 나눌 수 없다.
 *   틀린 운영시간을 구조화해 두면 검색엔진·AI가 그 값을 사실처럼 인용하므로, 확실하지 않은 값은 비워 둔다.
 *
 * url은 공개 장소 페이지(/places/:contentId) 주소를 넘겨받아 넣는다.
 * 지도 바텀시트처럼 고유 URL이 없는 곳에서 쓸 때는 생략한다.
 */
export function toPlaceJsonLd(detail: MapSpotDetail, url?: string): JsonLdObject {
  const place = compact({
    name: detail.title,
    url,
    address: detail.addr
      ? { '@type': 'PostalAddress', streetAddress: detail.addr, addressCountry: 'KR' }
      : null,
    geo: { '@type': 'GeoCoordinates', latitude: detail.lat, longitude: detail.lng },
    telephone: detail.tel,
    image: detail.images,
  })

  const schemaType = SCHEMA_TYPE_BY_CONTENT_TYPE[detail.contentType]

  if (schemaType === 'Event') {
    const period = parseEventPeriod(detail.eventPeriod)
    // Event는 startDate가 필수라, 기간을 못 읽으면 장소(Place)로만 표시한다.
    if (!period) return { '@context': 'https://schema.org', '@type': 'Place', ...place }

    return compact({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: detail.title,
      startDate: period.startDate,
      endDate: period.endDate,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      image: detail.images,
      location: { '@type': 'Place', ...place },
    })
  }

  return { '@context': 'https://schema.org', '@type': schemaType, ...place }
}
