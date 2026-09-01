import { useEffect, useState } from 'react'

/**
 * 값이 delayMs 동안 더 바뀌지 않을 때만 갱신된 값을 반환.
 * 검색 자동완성처럼 타이핑마다 요청을 보내지 않아야 할 때 사용.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
