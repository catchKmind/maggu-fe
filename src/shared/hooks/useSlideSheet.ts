import { useEffect, useState } from 'react'

const TRANSITION_MS = 300

/**
 * 바텀시트가 열릴 때 translate-y-full -> translate-y-0 트랜지션이 매번 재생되도록 하는 훅.
 * shouldRender는 isOpen effect에서 커밋되고 브라우저가 닫힌 상태를 페인트한 "뒤"에
 * 다음 effect가 실행되는 것이 React에서 보장되므로, isVisible을 별도 effect에서 true로 바꿔야 함.
 */
export function useSlideSheet(isOpen: boolean) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      return
    }

    setIsVisible(false)
    const timeout = setTimeout(() => setShouldRender(false), TRANSITION_MS)
    return () => clearTimeout(timeout)
  }, [isOpen])

  useEffect(() => {
    if (shouldRender && isOpen) {
      setIsVisible(true)
    }
  }, [shouldRender, isOpen])

  return { shouldRender, isVisible }
}
