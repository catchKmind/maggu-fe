import { useMutation } from '@tanstack/react-query'
import { reportContent } from '../api/reports'
import type { ReportReason } from '../api/reports.types'

export function useReportPost() {
  return useMutation({
    mutationFn: ({ postId, reason }: { postId: number; reason: ReportReason }) => reportContent({ postId, reason }),
  })
}
