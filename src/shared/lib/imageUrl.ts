/** 업로드 이미지가 저장된 CloudFront 주소 */
const IMAGE_BASE_URL = 'https://d20ix5umg2h23d.cloudfront.net'

/**
 * 서버가 이미지 경로만 내려주는 경우(예: "POST/12/abc.png") 앞에 CloudFront 주소를 붙여 전체 주소로 만든다.
 * 이미 전체 주소(https://..., Giphy 등)면 그대로 둔다.
 * 지금은 지도 게시글 API(/api/v1/map/posts)만 경로로 내려준다. 서버가 전체 주소로 바꾸면 이 처리는 없어도 된다.
 */
export function toImageUrl(pathOrUrl: string) {
  if (/^(https?:|blob:|data:)/.test(pathOrUrl)) return pathOrUrl
  return `${IMAGE_BASE_URL}/${pathOrUrl.replace(/^\/+/, '')}`
}
