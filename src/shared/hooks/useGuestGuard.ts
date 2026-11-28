import { selectIsGuest, useAppStore } from '../../stores/useAppStore'

/**
 * 게스트(둘러보기 전용)는 쓰기 화면으로 들어가기 전에 안내 팝업을 띄워 막는다.
 * 입력을 다 하고 나서야 막히는 일이 없도록, 글쓰기·리스트/스티커 만들기 같은 진입 버튼에 감싸서 쓴다.
 * (실제 쓰기 요청은 shared/lib/api.ts에서 한 번 더 막는다)
 */
export function useGuestGuard() {
  const isGuest = useAppStore(selectIsGuest)
  const openGuestNotice = useAppStore((s) => s.openGuestNotice)

  return <Args extends unknown[]>(action: (...args: Args) => void) =>
    (...args: Args) => {
      if (isGuest) openGuestNotice()
      else action(...args)
    }
}
