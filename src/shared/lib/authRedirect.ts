/**
 * 공유 링크로 들어온 비로그인 사용자를 로그인 후 원래 페이지로 돌려보내기 위한 헬퍼.
 * 복귀 경로는 /login?redirect=... 쿼리로 넘긴다. location.state와 달리 새로고침해도 남고,
 * 네이티브 앱(HashRouter)에서도 그대로 동작한다.
 */
const REDIRECT_PARAM = 'redirect'

/** 로그인 화면 주소를 만든다. 홈이면 굳이 붙이지 않는다 */
export function buildLoginPath(returnTo?: string): string {
  if (!returnTo || returnTo === '/' || !isSafePath(returnTo)) return '/login'
  return `/login?${REDIRECT_PARAM}=${encodeURIComponent(returnTo)}`
}

/** 로그인 화면 쿼리에서 복귀 경로를 꺼낸다. 없거나 안전하지 않으면 홈 */
export function getRedirectTarget(search: string): string {
  const target = new URLSearchParams(search).get(REDIRECT_PARAM)
  return target && isSafePath(target) ? target : '/'
}

/**
 * 앱 내부 경로만 허용한다 (오픈 리다이렉트 방지).
 * "//evil.com", "/\evil.com" 처럼 다른 출처로 해석될 수 있는 값과 로그인 화면 자체는 막는다.
 */
function isSafePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\') && !path.startsWith('/login')
}
