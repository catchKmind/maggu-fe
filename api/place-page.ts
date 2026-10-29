import type { ApiResponse } from '../src/shared/lib/api'
import type { MapSpotDetail } from '../src/features/map/api/mapSpots.types'
import { injectPlaceIntoHtml } from '../src/features/map/seo/placeSeo'

/**
 * /places/:contentId 요청을 받아, 빌드된 index.html에 장소 정보를 채워서 돌려준다 (vercel.json rewrite).
 *
 * 왜 필요한가: 이 앱은 React SPA라 원래 HTML은 빈 <div id="root">뿐이다.
 * 구글은 자바스크립트를 실행해서 내용을 읽지만, 상당수 AI 크롤러(GPTBot, ClaudeBot, PerplexityBot 등)는
 * 처음 받은 HTML만 읽는다. 그래서 서버에서 title·description·JSON-LD·본문을 미리 넣어 준다.
 *
 * 백엔드 주소는 직접 부르지 않고 같은 도메인의 /api/v1/... 를 부른다.
 * vercel.json의 기존 프록시 rewrite를 그대로 타서 백엔드 IP·HTTP 설정이 한 곳에만 있게 하려는 것.
 */
export const config = { runtime: 'edge' }

const SPOT_DETAIL_PATH = '/api/v1/map/spots/'
const CACHE_OK = 'public, s-maxage=3600, stale-while-revalidate=86400'

export default async function handler(request: Request): Promise<Response> {
  const { origin, searchParams } = new URL(request.url)
  const contentId = searchParams.get('contentId') ?? ''

  const templateRes = await fetch(`${origin}/index.html`)
  const template = await templateRes.text()
  const htmlHeaders = { 'Content-Type': 'text/html; charset=utf-8' }

  // 백엔드가 꺼져 있거나 인증을 요구하면, 꾸미지 않은 SPA를 그대로 돌려줘서 사람 방문자 화면은 깨지지 않게 한다.
  // 이 응답은 캐시하지 않는다 (서버가 살아나면 바로 제대로 된 HTML이 나가도록).
  const fallback = () => new Response(template, { status: 200, headers: { ...htmlHeaders, 'Cache-Control': 'no-store' } })

  if (!/^\d+$/.test(contentId)) return fallback()

  let detailRes: Response
  try {
    detailRes = await fetch(`${origin}${SPOT_DETAIL_PATH}${contentId}`, { headers: { Accept: 'application/json' } })
  } catch {
    return fallback()
  }

  // 없는 장소는 404로 알려줘야 검색엔진이 빈 페이지를 색인하지 않는다.
  if (detailRes.status === 404) {
    return new Response(template.replace('</head>', '<meta name="robots" content="noindex" />\n  </head>'), {
      status: 404,
      headers: { ...htmlHeaders, 'Cache-Control': 'public, s-maxage=600' },
    })
  }
  if (!detailRes.ok) return fallback()

  const body = (await detailRes.json()) as ApiResponse<MapSpotDetail>
  if (!body?.data?.title) return fallback()

  return new Response(injectPlaceIntoHtml(template, body.data), {
    status: 200,
    headers: { ...htmlHeaders, 'Cache-Control': CACHE_OK },
  })
}
