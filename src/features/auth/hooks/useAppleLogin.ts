import { useMutation } from '@tanstack/react-query'
import { signInWithApple } from '../../../shared/lib/appleSignIn'
import { useAppStore } from '../../../stores/useAppStore'
import { loginWithApple } from '../api/auth'

export function useAppleLogin() {
  return useMutation({
    mutationFn: async () => {
      const { identityToken, authorizationCode, fullName } = await signInWithApple()
      const token = await loginWithApple({ identityToken, authorizationCode, fullName })
      useAppStore.getState().signIn(token.accessToken, 'member')
      return token
    },
  })
}
