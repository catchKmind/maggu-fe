const STORAGE_KEY = 'maggu-auth-token'

/**
 * 로그인 플로우가 아직 없어 발급/갱신 로직은 없음.
 * 로그인 구현 시 토큰 발급 직후 setAuthToken을 호출해주면 이후 모든 API 요청에 자동으로 실림.
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setAuthToken(token: string) {
  localStorage.setItem(STORAGE_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(STORAGE_KEY)
}
