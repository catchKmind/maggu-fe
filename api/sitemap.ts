import type { ApiResponse } from '../src/shared/lib/api'
import type { MapSpotsResponse } from '../src/features/map/api/mapSpots.types'
import { SERVICE_AREA } from '../src/features/map/serviceArea'
import { escapeHtml, getPlaceUrl, SITE_ORIGIN } from '../src/features/map/seo/placeSeo'
import { toQueryString } from '../src/shared/lib/queryString'

/**
 * /sitemap.xml (vercel.json rewrite). 서비스 범위 전체의 장소를 받아 공개 장소 페이지 URL 목록을 만든다.
 * 크롤러는 링크를 따라가서 페이지를 찾는데, 지도 앱은 장소 간 링크가 없어서 사이트맵으로 직접 알려줘야 한다.
 *
 * 주의: 지도 목록 API(/api/v1/map/spots)가 한 번에 돌려주는 개수에 상한이 있다면 일부 장소가 빠진다.
 * 서버가 살아나면 응답 개수를 확인하고, 상한이 있으면 범위를 나눠 여러 번 부르도록 바꿔야 한다.
 */
export const config = { runtime: 'edge' }

export default async function handler(request: Request): Promise<Response> {
  const { origin } = new URL(request.url)
  const urls = [`${SITE_ORIGIN}/`]

  try {
    const res = await fetch(`${origin}/api/v1/map/spots${toQueryString(SERVICE_AREA)}`, {
      headers: { Accept: 'application/json' },
    })
    if (res.ok) {
      const body = (await res.json()) as ApiResponse<MapSpotsResponse>
      const contentIds = new Set(body.data.features.map((feature) => feature.properties.contentId))
      for (const contentId of contentIds) urls.push(getPlaceUrl(contentId))
    }
  } catch {
    // 백엔드가 꺼져 있으면 홈 URL만 담긴 사이트맵을 돌려준다.
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`),
    '</urlset>',
  ].join('\n')

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': urls.length > 1 ? 'public, s-maxage=86400' : 'no-store',
    },
  })
}
