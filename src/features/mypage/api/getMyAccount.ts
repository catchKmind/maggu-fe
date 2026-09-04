import { api, type ApiResponse } from '../../../shared/lib/api'
import type { MyAccountResponse } from './myAccount.types'

const MY_ACCOUNT_PATH = '/api/v1/mypage/account'

export function getMyAccount() {
  return api.get<ApiResponse<MyAccountResponse>>(MY_ACCOUNT_PATH).then((res) => res.data)
}
