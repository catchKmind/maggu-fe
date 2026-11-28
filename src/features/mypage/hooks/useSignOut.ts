import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { buildLoginPath } from '../../../shared/lib/authRedirect'
import { useAppStore } from '../../../stores/useAppStore'
import { withdraw } from '../../auth/api/auth'

/**
 * 토큰·캐시를 비우고 로그인 화면으로 보낸다. 로그아웃 API가 없어서 클라이언트에서만 처리한다.
 * returnTo를 넘기면 로그인 후 그 페이지로 돌아온다 (게스트 → 실제 로그인 전환 등).
 */
export function useSignOut() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return (returnTo?: string) => {
    useAppStore.getState().signOut()
    queryClient.clear()
    navigate(buildLoginPath(returnTo), { replace: true })
  }
}

/** 회원 탈퇴 (DELETE /api/v1/auth/delete) 성공 시 로그아웃과 동일하게 정리한다. */
export function useWithdraw() {
  const signOut = useSignOut()

  return useMutation({
    mutationFn: withdraw,
    onSuccess: () => signOut(),
  })
}
