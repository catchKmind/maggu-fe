import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSlideSheet } from '../../../shared/hooks/useSlideSheet'
import { useReportPost } from '../hooks/useReportPost'
import { useSharePost } from '../hooks/useSharePost'
import type { ReportReason } from '../api/reports.types'

const REPORT_REASONS: { key: ReportReason; labelKey: string }[] = [
  { key: 'HATE', labelKey: 'report.hate' },
  { key: 'HARASSMENT', labelKey: 'report.harassment' },
  { key: 'INAPPROPRIATE', labelKey: 'report.inappropriate' },
]

const ROW_CLASS = 'flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4 text-left text-16'

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="4" cy="9" r="1.2" fill="#A3A3A3" />
      <circle cx="9" cy="9" r="1.2" fill="#A3A3A3" />
      <circle cx="14" cy="9" r="1.2" fill="#A3A3A3" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="17" cy="5.5" r="2.5" stroke="#171717" strokeWidth="1.5" />
      <circle cx="6.5" cy="12" r="2.5" stroke="#171717" strokeWidth="1.5" />
      <circle cx="17" cy="18.5" r="2.5" stroke="#171717" strokeWidth="1.5" />
      <path d="m8.7 10.7 6.1-3.9M8.7 13.3l6.1 3.9" stroke="#171717" strokeWidth="1.5" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.3 4.2a2 2 0 0 1 3.4 0l7.6 13.1a2 2 0 0 1-1.7 3H4.4a2 2 0 0 1-1.7-3l7.6-13.1Z"
        stroke="#DF0303"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 9.5v4.5" stroke="#DF0303" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="0.9" fill="#DF0303" />
    </svg>
  )
}

type MenuStep = 'menu' | 'report'

interface PostMenuProps {
  postId: number
  /** 공유 동작을 바꾸고 싶을 때 (예: 상세 화면의 '링크 복사됨' 표시). 없으면 기본 공유를 쓴다. */
  onShare?: () => void
}

/** 게시글 더보기(…) 메뉴. 바텀시트로 공유 / 신고를 띄우고, 신고를 누르면 사유를 고른다. */
export function PostMenu({ postId, onShare }: PostMenuProps) {
  const { t } = useTranslation('community')
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<MenuStep>('menu')
  const { shouldRender, isVisible } = useSlideSheet(isOpen)
  const reportPost = useReportPost()
  const sharePost = useSharePost()

  const close = () => {
    setIsOpen(false)
    setStep('menu')
  }

  const defaultShare = async () => {
    const { url } = await sharePost.mutateAsync(postId)
    if (navigator.share) {
      try {
        await navigator.share({ url })
      } catch {
        // 사용자가 공유 취소
      }
      return
    }
    await navigator.clipboard.writeText(url)
  }

  const handleShare = () => {
    close()
    if (onShare) onShare()
    else void defaultShare()
  }

  const handleReport = (reason: ReportReason) => {
    reportPost.mutate({ postId, reason })
    close()
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        aria-label={t('postMenu')}
        className="flex h-6 w-6 items-center justify-center"
      >
        <MoreIcon />
      </button>

      {shouldRender && (
        <div className="fixed inset-0 z-50" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label={t('postMenu')}
            onClick={close}
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            className={`absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col rounded-t-[24px] bg-white pb-[calc(var(--safe-bottom)+16px)] transition-transform duration-300 ease-out ${
              isVisible ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-9 rounded-full bg-gray-200" />
            </div>

            <div className="flex flex-col gap-2 px-4 pt-2">
              {step === 'menu' ? (
                <>
                  <button type="button" onClick={handleShare} className={`${ROW_CLASS} text-gray-900`}>
                    {t('postDetail.share')}
                    <ShareIcon />
                  </button>
                  <button type="button" onClick={() => setStep('report')} className={`${ROW_CLASS} text-[#df0303]`}>
                    {t('report.label')}
                    <WarningIcon />
                  </button>
                </>
              ) : (
                REPORT_REASONS.map((reason) => (
                  <button
                    key={reason.key}
                    type="button"
                    onClick={() => handleReport(reason.key)}
                    className={`${ROW_CLASS} text-gray-900`}
                  >
                    {t(reason.labelKey)}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
