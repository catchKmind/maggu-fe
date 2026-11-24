import { useEffect, useRef } from 'react'

/**
 * 반환된 ref를 목록 맨 아래의 빈 div에 달아 두면, 그 div가 화면 근처에 보일 때 onVisible을 부른다.
 * 무한 스크롤(다음 페이지 불러오기)에 쓴다. enabled가 false면(더 불러올 게 없거나 이미 불러오는 중) 감시하지 않는다.
 */
export function useLoadMoreOnVisible(onVisible: () => void, enabled: boolean) {
  const targetRef = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(onVisible)
  callbackRef.current = onVisible

  useEffect(() => {
    const target = targetRef.current
    if (!enabled || !target) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) callbackRef.current()
      },
      { rootMargin: '240px' },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [enabled])

  return targetRef
}
