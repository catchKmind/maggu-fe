import { api, type ApiResponse } from '../../../shared/lib/api'
import type { PresignedUrlRequest, PresignedUrlResponse } from './uploads.types'

const PRESIGNED_URL_PATH = '/api/v1/uploads/presigned-url'

export function getPresignedUrl(body: PresignedUrlRequest) {
  return api.post<ApiResponse<PresignedUrlResponse>>(PRESIGNED_URL_PATH, body).then((res) => res.data)
}
