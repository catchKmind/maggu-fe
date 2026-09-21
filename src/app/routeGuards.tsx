import type { ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '../stores/useAppStore'

/** 로그인 안 됐으면 /login으로 보냄. 로그인 필요한 라우트들을 이걸로 묶어서 사용. */
export function RequireAuth() {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <Outlet />
}

/** 이미 로그인 됐으면 홈으로 보냄. /login 라우트에 사용. */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn)
  if (isLoggedIn) return <Navigate to="/" replace />
  return children
}
