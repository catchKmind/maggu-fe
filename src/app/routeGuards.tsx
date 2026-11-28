import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { buildLoginPath, getRedirectTarget } from '../shared/lib/authRedirect'
import { selectIsLoggedIn, useAppStore } from '../stores/useAppStore'

/**
 * 로그인 안 됐으면 /login으로 보냄. 로그인 필요한 라우트들을 이걸로 묶어서 사용.
 * 공유 링크로 바로 들어온 경우를 위해 원래 주소를 redirect 쿼리로 넘겨, 로그인 후 그 페이지로 돌아오게 한다.
 */
export function RequireAuth() {
  const isLoggedIn = useAppStore(selectIsLoggedIn)
  const location = useLocation()
  if (!isLoggedIn) {
    const returnTo = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to={buildLoginPath(returnTo)} replace />
  }
  return <Outlet />
}

/** 이미 로그인 됐으면 복귀 경로(없으면 홈)로 보냄. /login 라우트에 사용. */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const isLoggedIn = useAppStore(selectIsLoggedIn)
  const location = useLocation()
  if (isLoggedIn) return <Navigate to={getRedirectTarget(location.search)} replace />
  return children
}
