import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '../features/mypage/components/ConfirmDialog'
import { useSignOut } from '../features/mypage/hooks/useSignOut'
import { useAppStore } from '../stores/useAppStore'

/**
 * 게스트가 글쓰기·댓글·스크랩 같은 쓰기 기능을 눌렀을 때 뜨는 안내 팝업.
 * 쓰기 요청은 shared/lib/api.ts에서 막고, 여기서는 안내와 로그인 화면 이동만 맡는다.
 */
export function GuestNotice() {
  const { t } = useTranslation()
  const isOpen = useAppStore((s) => s.isGuestNoticeOpen)
  const close = useAppStore((s) => s.closeGuestNotice)
  const signOut = useSignOut()

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={t('guestNotice.title')}
      description={t('guestNotice.description')}
      cancelLabel={t('guestNotice.close')}
      confirmLabel={t('guestNotice.login')}
      onCancel={close}
      onConfirm={() => {
        close()
        signOut()
      }}
    />
  )
}
