import type { MapSpotDetail, TourContentType } from '../api/mapSpots.types'
import { toPlaceJsonLd } from '../mappers/toPlaceJsonLd'

/**
 * 공개 장소 페이지(/places/:contentId)의 SEO/GEO용 HTML 조각을 만든다.
 * 브라우저(PlacePage)와 Vercel 서버 함수(api/place-page.ts) 양쪽에서 쓰기 때문에
 * DOM이나 React에 의존하지 않는 순수 함수로만 구성한다.
 */

export const SITE_ORIGIN = 'https://maggu-fe.vercel.app'

/** 장소 데이터(관광공사)가 한국어라 서버 렌더링 문구도 한국어로 맞춘다. */
export const CONTENT_TYPE_LABEL_KO: Record<TourContentType, string> = {
  12: '관광지',
  14: '문화시설',
  15: '축제·공연·행사',
  25: '여행코스',
  28: '레포츠',
  32: '숙박',
  38: '쇼핑',
  39: '음식점',
}

export function getPlaceUrl(contentId: string) {
  return `${SITE_ORIGIN}/places/${encodeURIComponent(contentId)}`
}

/** 마지막 글자 받침 유무로 은/는을 고른다. 한글이 아니면(영문·숫자로 끝나는 이름) "은(는)"으로 둔다. */
function withTopicParticle(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  if (code < 0 || code > 11171) return `${word}은(는)`
  return `${word}${code % 28 === 0 ? '는' : '은'}`
}

/**
 * 검색 결과·AI 답변에 그대로 인용될 수 있는 한 문단 요약.
 * "무엇인지 → 어디인지 → 언제 여는지" 순서로, 데이터에 있는 사실만 조합한다(추측 문구 없음).
 */
export function buildPlaceDescription(detail: MapSpotDetail) {
  const label = CONTENT_TYPE_LABEL_KO[detail.contentType]
  const subject = withTopicParticle(detail.title)
  const sentences = [detail.addr ? `${subject} ${detail.addr}에 있는 ${label}입니다.` : `${subject} ${label}입니다.`]
  if (detail.eventPeriod) sentences.push(`행사 기간은 ${detail.eventPeriod}입니다.`)
  if (detail.businessHours) sentences.push(`이용 시간: ${detail.businessHours}.`)
  if (detail.closedDays) sentences.push(`쉬는 날: ${detail.closedDays}.`)
  return sentences.join(' ')
}

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch])
}

/** <script> 안에 넣는 JSON. "</script>"로 태그가 닫히지 않도록 "<"를 이스케이프한다. */
export function toSafeJson(data: object) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** <head>에 넣을 태그들: canonical, Open Graph, 장소 JSON-LD */
export function renderPlaceHeadTags(detail: MapSpotDetail) {
  const url = getPlaceUrl(detail.contentId)
  const title = escapeHtml(`${detail.title} | Maggu`)
  const description = escapeHtml(buildPlaceDescription(detail))
  const image = detail.images[0]

  return [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : '',
    `<script type="application/ld+json">${toSafeJson(toPlaceJsonLd(detail, url))}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')
}

/**
 * <div id="root"> 안에 미리 넣어둘 본문.
 * 자바스크립트를 실행하지 않는 크롤러는 이 마크업만 보고, 사람 방문자는 React가 뜨면서 이 내용을 교체한다.
 * 정보는 정의 목록(dl)으로 "항목명–값"을 짝지어 기계가 구조를 읽기 쉽게 한다.
 */
export function renderPlaceBody(detail: MapSpotDetail) {
  const rows: [string, string | null][] = [
    ['주소', detail.addr],
    ['행사 기간', detail.eventPeriod],
    ['이용 시간', detail.businessHours],
    ['쉬는 날', detail.closedDays],
    ['전화', detail.tel],
  ]
  const infoList = rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([term, value]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd>`)
    .join('')
  const photos = detail.images
    .slice(0, 6)
    .map((src, i) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(`${detail.title} 사진 ${i + 1}`)}" loading="lazy" />`)
    .join('')

  return [
    '<main>',
    '<article>',
    '<header>',
    `<p>${escapeHtml(CONTENT_TYPE_LABEL_KO[detail.contentType])}</p>`,
    `<h1>${escapeHtml(detail.title)}</h1>`,
    '</header>',
    `<p>${escapeHtml(buildPlaceDescription(detail))}</p>`,
    infoList ? `<dl>${infoList}</dl>` : '',
    photos ? `<figure>${photos}<figcaption>${escapeHtml(detail.title)}</figcaption></figure>` : '',
    '<p><a href="/">Maggu 지도에서 보기</a></p>',
    '</article>',
    '</main>',
  ].join('')
}

/**
 * 빌드된 index.html에 장소 정보를 끼워 넣는다.
 * title·description은 교체하고, 사이트 단위 JSON-LD는 그대로 둔 채 장소 JSON-LD를 추가한다.
 */
export function injectPlaceIntoHtml(template: string, detail: MapSpotDetail) {
  const title = escapeHtml(`${detail.title} | Maggu`)
  const description = escapeHtml(buildPlaceDescription(detail))

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`)
    .replace('</head>', `  ${renderPlaceHeadTags(detail)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderPlaceBody(detail)}</div>`)
}
