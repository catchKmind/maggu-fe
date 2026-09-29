import { useMutation } from '@tanstack/react-query'
import { setAuthToken } from '../../../shared/lib/authToken'
import { useAppStore } from '../../../stores/useAppStore'
import { testLogin } from '../api/auth'

/**
 * "게스트로 시작하기" 버튼용. 실제 게스트 개념(무계정) API가 따로 없어서,
 * 매번 새 이메일/닉네임을 만들어 백엔드의 테스트 로그인(test-login)으로 대신 로그인시킨다.
 */
export function useGuestLogin() {
  return useMutation({
    mutationFn: async () => {
      const id = crypto.randomUUID().slice(0, 8)
      const token = await testLogin({ email: `guest-${id}@maggu.co.kr`, nickname: `게스트${id}` })
      setAuthToken(token.accessToken)
      useAppStore.getState().setLoggedIn(true)
      return token
    },
  })
}
