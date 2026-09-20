import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReportPost } from '../hooks/useReportPost'
import type { ReportReason } from '../api/reports.types'

const REPORT_REASONS: { key: ReportReason; labelKey: string }[] = [
  { key: 'HATE', labelKey: 'report.hate' },
  { key: 'HARASSMENT', labelKey: 'report.harassment' },
  { key: 'INAPPROPRIATE', labelKey: 'report.inappropriate' },
]

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="4" cy="9" r="1.2" fill="#A3A3A3" />
      <circle cx="9" cy="9" r="1.2" fill="#A3A3A3" />
      <circle cx="14" cy="9" r="1.2" fill="#A3A3A3" />
    </svg>
  )
}

interface PostMenuProps {
  postId: number
}

export function PostMenu({ postId }: PostMenuProps) {
  const { t } = useTranslation('community')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const reportPost = useReportPost()

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleReport = (reason: ReportReason) => {
    reportPost.mutate({ postId, reason })
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t('postMenu')}
        className="flex h-6 w-6 items-center justify-center"
      >
        <MoreIcon />
      </button>
      {isOpen && (
        <div className="absolute top-7 right-0 z-10 w-44 overflow-hidden rounded-2xl bg-white py-1 shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason.key}
              type="button"
              onClick={() => handleReport(reason.key)}
              className="block w-full px-4 py-2.5 text-left text-14 text-gray-700"
            >
              {t(reason.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
