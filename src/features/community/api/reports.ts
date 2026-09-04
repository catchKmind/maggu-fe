import { api, type ApiResponse } from '../../../shared/lib/api'
import type { ReportCreateRequest, ReportResponse } from './reports.types'

const REPORTS_PATH = '/api/v1/community/reports'

export function reportContent(body: ReportCreateRequest) {
  return api.post<ApiResponse<ReportResponse>>(REPORTS_PATH, body).then((res) => res.data)
}
