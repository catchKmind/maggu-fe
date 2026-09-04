export type AuthProvider = 'GOOGLE' | 'TEST'

export interface MyAccountResponse {
  provider: AuthProvider
  email: string
  nickname: string
}
