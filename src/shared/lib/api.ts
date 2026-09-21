import { getAuthToken, clearAuthToken } from './authToken'
import { isNativeApp } from './platform'
import { useAppStore } from '../../stores/useAppStore'

/**
 * API 클라이언트.
 * 웹: same-origin 상대경로(/api/...)로 호출 — vercel.json(배포)/vite.config.ts(로컬)가
 * 백엔드로 프록시해준다. 백엔드가 아직 HTTP만 지원해서 HTTPS 페이지에서 절대 URL로
 * 직접 부르면 Mixed Content로 브라우저가 요청을 막기 때문.
 * 네이티브 웹뷰: 프록시가 없으므로 VITE_API_BASE_URL로 백엔드에 직접 접속한다.
 */
const BASE_URL = isNativeApp() ? (import.meta.env.VITE_API_BASE_URL ?? '') : ''

export interface ApiResponse<T> {
  success: boolean
  status: number
  code: string
  message: string
  data: T
  timestamp: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  })
  // 액세스 토큰은 1시간 뒤 만료되는데 재발급 엔드포인트가 아직 없어서, 만료되면 로그아웃시킨다.
  // (토큰만 남아있으면 로그인된 것으로 취급돼 모든 요청이 조용히 401로 실패하기 때문)
  if (res.status === 401) {
    clearAuthToken()
    useAppStore.getState().setLoggedIn(false)
  }
  if (!res.ok) throw new ApiError(res.status, await res.text())
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
