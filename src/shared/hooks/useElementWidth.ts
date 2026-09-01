import { useLayoutEffect, useRef, useState } from 'react'

/**
 * 엘리먼트의 실제 렌더링 너비를 추적. @giphy/react-components의 Grid처럼
 * 픽셀 단위 width prop이 필요한 컴포넌트에 씀.
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) setWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, width }
}
