interface JsonLdProps {
  data: object
}

/**
 * 구조화 데이터(JSON-LD)를 <script type="application/ld+json">으로 렌더링한다.
 * 화면에는 보이지 않고 검색엔진·AI 크롤러만 읽는다.
 *
 * 장소 이름이나 주소에 "</script>"가 섞여 들어오면 태그가 닫혀 버리므로(XSS),
 * "<"를 유니코드 이스케이프(<)로 바꿔서 넣는다. JSON 값으로는 동일하게 해석된다.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
