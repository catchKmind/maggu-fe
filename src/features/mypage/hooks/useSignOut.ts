import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { clearAuthToken } from '../../../shared/lib/authToken'
import { useAppStore } from '../../../stores/useAppStore'
import { withdraw } from '../../auth/api/auth'

/** 토큰·캐시를 비우고 로그인 화면으로 보낸다. 로그아웃 API가 없어서 클라이언트에서만 처리한다. */
export function useSignOut() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return () => {
    clearAuthToken()
    useAppStore.getState().setLoggedIn(false)
    queryClient.clear()
    navigate('/login', { replace: true })
  }
}

/** 회원 탈퇴 (DELETE /api/v1/auth/delete) 성공 시 로그아웃과 동일하게 정리한다. */
export function useWithdraw() {
  const signOut = useSignOut()

  return useMutation({
    mutationFn: withdraw,
    onSuccess: signOut,
  })
}
