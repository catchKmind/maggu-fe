export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface TestLoginRequest {
  email: string
  nickname: string
}

export interface AppleLoginRequest {
  /** Apple identity token (JWT) */
  identityToken: string
  /** Apple authorization code. 서버 간 토큰 교환이 필요할 때 사용 */
  authorizationCode?: string
  /** 사용자 이름. Apple은 최초 로그인 시에만 제공 */
  fullName?: string
}

export interface WithdrawResponse {
  withdrawn: boolean
}
