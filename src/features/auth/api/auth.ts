import { api, type ApiResponse } from '../../../shared/lib/api'
import type { AppleLoginRequest, TestLoginRequest, TokenResponse, WithdrawResponse } from './auth.types'

const AUTH_PATH = '/api/v1/auth'

export function testLogin(body: TestLoginRequest) {
  return api.post<ApiResponse<TokenResponse>>(`${AUTH_PATH}/test-login`, body).then((res) => res.data)
}

export function loginWithApple(body: AppleLoginRequest) {
  return api.post<ApiResponse<TokenResponse>>(`${AUTH_PATH}/login`, body).then((res) => res.data)
}

export function withdraw() {
  return api.delete<ApiResponse<WithdrawResponse>>(`${AUTH_PATH}/delete`).then((res) => res.data)
}
