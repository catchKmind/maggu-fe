import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSlideSheet } from '../../../shared/hooks/useSlideSheet'
import { useReportPost } from '../hooks/useReportPost'
import { useDeletePost } from '../hooks/useDeletePost'
import { useMyAccount } from '../../mypage/hooks/useMyAccount'
import { ConfirmDialog } from '../../mypage/components/ConfirmDialog'
import { useShareUrl } from '../hooks/useSharePost'
import { copyText } from '../../../shared/lib/copyText'
import type { ReportReason } from '../api/reports.types'

const REPORT_REASONS: { key: ReportReason; labelKey: string }[] = [
  { key: 'HATE', labelKey: 'report.hate' },
  { key: 'HARASSMENT', labelKey: 'report.harassment' },
  { key: 'INAPPROPRIATE', labelKey: 'report.inappropriate' },
]

const ROW_CLASS = 'flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-4 text-left text-16'

function MoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="10.5" r="1.5" fill="var(--color-icon-muted)" />
      <circle cx="10.5" cy="10.5" r="1.5" fill="var(--color-icon-muted)" />
      <circle cx="15.5" cy="10.5" r="1.5" fill="var(--color-icon-muted)" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="17" cy="5.5" r="2.5" stroke="var(--color-icon-strong)" strokeWidth="1.5" />
      <circle cx="6.5" cy="12" r="2.5" stroke="var(--color-icon-strong)" strokeWidth="1.5" />
      <circle cx="17" cy="18.5" r="2.5" stroke="var(--color-icon-strong)" strokeWidth="1.5" />
      <path d="m8.7 10.7 6.1-3.9M8.7 13.3l6.1 3.9" stroke="var(--color-icon-strong)" strokeWidth="1.5" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.3 4.2a2 2 0 0 1 3.4 0l7.6 13.1a2 2 0 0 1-1.7 3H4.4a2 2 0 0 1-1.7-3l7.6-13.1Z"
        stroke="var(--color-error)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 9.5v4.5" stroke="var(--color-error)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="0.9" fill="var(--color-error)" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 6h12M8 6V4.5h4V6M6 6l.6 9.5h6.8L14 6M8.5 9v4M11.5 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type MenuStep = 'menu' | 'report'

interface PostMenuProps {
  postId: number
  /** 글쓴이 닉네임. 내 글이면 신고 대신 삭제 버튼을 보여주는 데 쓴다 */
  writerNickname?: string
  /** 공유 동작을 바꾸고 싶을 때 (예: 상세 화면의 '링크 복사됨' 표시). 없으면 기본 공유를 쓴다. */
  onShare?: () => void
}

/** 게시글 더보기(…) 메뉴. 바텀시트로 공유 / 신고를 띄우고, 신고를 누르면 사유를 고른다. */
export function PostMenu({ postId, writerNickname, onShare }: PostMenuProps) {
  const { t } = useTranslation('community')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { data: account } = useMyAccount()
  // 닉네임은 중복이 안 되는 값이라(프로필 수정에서 중복 검사) 글쓴이와 내 닉네임이 같으면 내 글로 본다
  const isMine = Boolean(account?.nickname && writerNickname && account.nickname === writerNickname)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const deletePostMutation = useDeletePost()
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<MenuStep>('menu')
  const { shouldRender, isVisible } = useSlideSheet(isOpen)
  const reportPost = useReportPost()
  // 메뉴를 열 때 링크를 미리 받아 둔다 (공유창은 누른 순간에 바로 열어야 해서)
  const shareUrl = useShareUrl(postId, isOpen)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 2000)
  }

  const close = () => {
    setIsOpen(false)
    setStep('menu')
  }

  const handleShare = async () => {
    if (onShare) {
      close()
      onShare()
      return
    }

    // 링크가 이미 준비돼 있으면 await 없이 바로 공유창을 연다 (누른 순간이어야 iOS가 허용한다)
    let url = shareUrl.data?.url
    const isInGesture = Boolean(url)
    if (!url) {
      try {
        url = (await shareUrl.refetch()).data?.url
      } catch {
        // 아래에서 실패로 처리
      }
    }
    close()
    if (!url) {
      showToast(t('postDetail.shareFailed'))
      return
    }

    if (isInGesture && typeof navigator.share === 'function') {
      try {
        await navigator.share({ url })
        return
      } catch (error) {
        // 사용자가 공유창을 닫은 경우는 그대로 끝낸다
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    // 공유창을 못 쓰는 환경(데스크톱 등)이거나 거절되면 링크를 복사한다
    showToast(t((await copyText(url)) ? 'postDetail.linkCopied' : 'postDetail.shareFailed'))
  }

  const handleDelete = () => {
    deletePostMutation.mutate(postId, {
      onSuccess: () => {
        setIsDeleteConfirmOpen(false)
        // 삭제한 글의 상세 화면이었다면 목록으로 돌아간다
        if (pathname.startsWith('/community/posts/')) navigate('/community', { replace: true })
      },
    })
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
        className="mr-1 flex h-5 w-5 items-center justify-center"
      >
        <MoreIcon />
      </button>

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-gray-800/90 px-4 py-2 typo-body-m whitespace-nowrap text-white"
        >
          {toast}
        </div>
      )}

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
            <div className="flex justify-center pt-3 pb-3">
              <div className="h-1 w-10 rounded-full bg-gray-200" />
            </div>

            <div className="flex flex-col gap-2 px-4 pt-2">
              {step === 'menu' ? (
                <>
                  <button type="button" onClick={handleShare} className={`${ROW_CLASS} text-gray-900`}>
                    {t('postDetail.share')}
                    <ShareIcon />
                  </button>
                  {isMine ? (
                    <button
                      type="button"
                      onClick={() => {
                        close()
                        setIsDeleteConfirmOpen(true)
                      }}
                      className={`${ROW_CLASS} text-error`}
                    >
                      {t('postDelete.label')}
                      <TrashIcon />
                    </button>
                  ) : (
                    <button type="button" onClick={() => setStep('report')} className={`${ROW_CLASS} text-error`}>
                      {t('report.label')}
                      <WarningIcon />
                    </button>
                  )}
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

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title={t('postDelete.title')}
        description={t('postDelete.description')}
        cancelLabel={t('postDelete.cancel')}
        confirmLabel={t('postDelete.confirm')}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        isPending={deletePostMutation.isPending}
      />
    </>
  )
}
